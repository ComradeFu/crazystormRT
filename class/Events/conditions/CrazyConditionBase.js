/**
 * 事件的条件基类
 */
module.exports = class CrazyConditionBase
{
    constructor(group, info)
    {
        this.group = group
        this.obj = group.obj

        //判断的值
        this.val = info.condition_val

        //op关键字
        this.op = info.op
    }

    static get_name()
    {
        return undefined
    }

    //获取对应的事件名称
    get_concert_event_names()
    {
        throw Error("must override get_concert_event_names method.")
    }

    get_compare_val()
    {
        throw Error("must override get_compare_val method.")
    }

    check_condition()
    {
        let val = this.get_compare_val()
        switch (this.op)
        {
            case ">":
                return val > this.val
            case "<":
                return val < this.val
            case "=":
                return val == this.val
            default:
                throw new Error(`unknow event condition op ${this.op}`)
        }
    }

    //间隔进行增加，这是 group 统一调用的逻辑。我觉得作者这里的概念有点奇怪
    increase_val(val)
    {
        this.val += val
    }
}

