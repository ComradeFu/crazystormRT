/**
 * crazy storm 的事件类
 */
const Conditions = require("./conditions")
const Effects = require("./effects")

module.exports = class CrazyEvent
{
    constructor(group, conf)
    {
        this.group = group
        this.obj = group.obj //绑定的 obj

        this.conf = conf

        //已经触发的次数    
        this.cur_trigger_times = 0

        //规定触发的次数
        this.trigger_times = conf.effect.trigger_times

        this.conds = {}

        //effect 是执行 one by one 的
        this.active_effects = []

        //初始化conditions
        this.load_conditions(conf.conds)

        //上一次增加cond值
        this.last_time_increase_cond = 0
    }

    load_conditions(conf)
    {
        this.conds.op = conf.op
        let conds = []
        for (let one of conf.vars)
        {
            let cls = Conditions[one.condition_name]
            if (!cls)
            {
                global.console.error(`找不到事件条件：`, one.condition_name)
                continue
            }

            let cond = new cls(this.group, one)

            let event_names = cond.get_concert_event_names()
            for (let event_name of event_names)
            {
                this.group.listen(event_name, this)
            }

            conds.push(cond)
        }

        this.conds.conds = conds
    }

    //检查
    check()
    {
        let conds = this.conds.conds
        let op = this.conds.op

        let ret = true
        for (let one of conds)
        {
            ret = one.check_condition()
            if (op == "且" && !ret)
                return false

            if (op == "或" && ret)
                return true
        }

        return ret
    }

    //关心的事件来了
    trigger()
    {
        if (this.trigger_times !== 0 && this.cur_trigger_times >= this.trigger_times)
            return

        if (!this.check())
            return

        //开始触发
        this.trigger_effects()

        this.cur_trigger_times++
    }

    trigger_effects()
    {
        let conf_effect = this.conf.effect

        let cls = Effects[conf_effect.effect.effect_name]
        if (!cls)
        {
            global.console.error(`找不到事件效果: ${conf_effect.effect.effect_name}`)
            return
        }

        let effect = new cls(this.group, conf_effect)
        effect.event = this

        this.active_effects.push(effect)
    }

    //跳动
    tick()
    {
        //跳动第一个生效的effect
        let first = this.active_effects[0]
        while (first)
        {
            if (!first.started)
                first.start()

            let state = first.tick()
            if (state)
            {
                //不再跳动
                first = undefined
            }
            else
            {
                //说明结束，将其删除
                this.active_effects.splice(0, 1)
                first = this.active_effects[0]
            }
        }

        //
        this.tick_increase_cond()
    }

    tick_increase_cond()
    {
        let next_time_should_increase = this.last_time_increase_cond + this.group.interval
        if (this.obj.frame_count < next_time_should_increase)
            return

        for (let cond of this.conds.conds)
            cond.increase_val(this.group.interval_increasement)

        this.last_time_increase_cond = this.obj.frame_count
    }
}
