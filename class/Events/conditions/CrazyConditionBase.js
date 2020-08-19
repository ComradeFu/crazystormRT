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
        this.val = 0

        //op关键字
        this.op = info.op

        //检查成功之后的回调函数
        this.on_check_success = undefined

        this.regist_group_event()
    }

    //获取对应的事件名称
    get_concert_event_names()
    {
        throw Error("must override get_concert_event_names method.")
    }

    regist_group_event()
    {
        let that = this
        let event_names = this.get_concert_event_names()
        for(let event_name of event_names)
        {
            let handler = this.group.listen(event_name, ()=>
            {
                if(that.check_condition())
                {
                    this.on_check_success()
                }
            })
        }
    }

    get_compare_val()
    {
        throw Error("must override get_compare_val method.")
    }

    check_condition()
    {
        let val = this.get_compare_val()
        switch(this.op)
        {
            case ">":
                return this.val > val
            case "<":
                return this.val < val
            case "=":
                return this.val == val
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

