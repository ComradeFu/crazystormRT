/**
 * 事件的效果基类
 */
const CrazyNumber = require("./../../CrazyNumber")
module.exports = class CrazyEffectBase
{
    constructor(group, conf)
    {
        this.group = group
        this.obj = group.obj

        this.effect = Object.assign({}, conf.effect)
        this.effect.target_val = this.get_target_val(this.effect.target_val)

        this.frame_count = 1 //对，第一次就会变化。。

        this.effect_change = conf.effect_change
        this.trans_frame = conf.trans_frame //
        this.trigger_times = conf.trigger_times

        //启动标志
        this.started = false
    }

    static get_name()
    {

    }

    get_target_val(conf)
    {
        let rand_number = new CrazyNumber(...conf)
        return rand_number.val
    }

    //开始
    start()
    {
        this.started = true
        this.origin_val = this.__get_origin_val()
    }

    //获取当时的值
    __get_origin_val()
    {
        let func_name = `get_origin_val_${this.obj.tp}`
        let func = this[func_name] || this.get_origin_val
        if (!func)
        {
            global.console.error(`${this.get_name()} 效果，没有实现对 ${this.obj.tp} 类型的 get_origin_val 函数`)
            return
        }

        return func.call(this)
    }

    //获取当前的效果值（不一定都用得上，有些效果是直接生效的）
    get_cur_val()
    {
        let origin_val = this.origin_val
        let target_val = this.effect.target_val

        let gap_val = undefined
        //如果是变化到，则需要结合origin_val来进行
        if (this.effect.op == "变化到")
            gap_val = target_val - origin_val
        else if (this.effect.op == "减少")
            gap_val = -target_val
        else
            gap_val = target_val

        let change_val = 0
        //三种不同变换方式
        if (this.effect_change == "正比")
            change_val = gap_val * (this.frame_count / this.trans_frame)
        else if (this.effect_change == "正弦")
        {
            let factor = this.frame_count / this.trans_frame
            let cur_rad = factor * Math.PI / 2

            change_val = Math.sin(cur_rad) * gap_val
        }
        //固定
        else if (this.effect_change == "固定")
            change_val = gap_val

        return origin_val + change_val
    }

    tick()
    {
        try
        {
            this.__do_effect()
        }
        catch (e)
        {
            global.console.error(e)
        }

        this.frame_count++

        if (this.frame_count > this.trans_frame)
        {
            return false
        }

        return true
    }

    //返回 false 结束，返回 true 继续
    __do_effect()
    {
        let func_name = `do_effect_${this.obj.tp}`
        let func = this[func_name] || this.do_effect
        if (!func)
        {
            global.console.error(`${this.get_name()} 效果，没有实现对 ${this.obj.tp} 类型的 do_effect 函数`)
            return
        }

        return func.call(this)
    }
}
