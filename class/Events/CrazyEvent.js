/**
 * crazy storm 的事件类
 */
const Conditions = require("./conditions")
const Effects = require("./effects")

module.exports = class CrazyStorm
{
    constructor(group, conf)
    {
        this.group = group
        this.obj = group.obj //绑定的 obj

        //已经触发的次数    
        this.cur_trigger_times = 0

        //规定触发的次数
        this.trigger_times = conf.trigger_times

        this.conds = []

        //effect 是执行 one by one 的
        this.active_effects = []

        //初始化conditions
        this.load_conditions(conf.conds)
    }

    load_conditions(conf)
    {
        for (let one of conf)
        {
            let cls = Conditions[one.condition_name]
            let cond = new cls(this.group, one)

            this.conds.push(cond)
        }
    }

    //检查
    check()
    {
        for (let one of this.conds)
        {
            if (!one.check())
                return false
        }

        return true
    }

    //关心的事件来了
    trigger()
    {
        if (this.cur_trigger_times >= this.trigger_times)
            return

        if (this.check())
            return

        //开始触发
        this.trigger_effects()

        this.cur_trigger_times++
    }

    trigger_effects()
    {
        for (let one of this.cond.effect)
        {
            let cls = Effects[one.effect_name]
            let effect = new cls(this.group, one)

            this.active_effects.push(effect)
        }
    }

    //跳动
    tick()
    {
        //跳动第一个生效的effect
        let first = this.active_effects[0]
        if (first)
        {
            let state = first.tick()
            if (!state)
            {
                //说明结束，将其删除
                this.active_effects.splice(0, 1)
            }
        }
    }
}
