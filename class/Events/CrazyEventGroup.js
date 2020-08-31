/**
 * crazystorm 的事件组系统
 * 兼简单的事件派发系统
 * 
 * 注意这不是标准的 “事件系统”，而是简化之后的、更简易的体系
 * 
 */
const { safe_call } = require("../../utils/function")
const CrazyEvent = require("./CrazyEvent")
module.exports = class CrazyEventGroup
{
    constructor(obj)
    {
        this.obj = obj

        this.event_id_helper = 0

        this.events = []

        //正在触发中的事件列表
        this.doing_events = []

        // eventname -> list
        this.event_listeners = {}
    }

    init_by_conf(conf)
    {
        this.desc = conf.desc
        this.interval = conf.interval
        this.interval_increasement = conf.interval_increasement

        for (let one of conf.events)
        {
            let event = new CrazyEvent(this, one)
            event.event_id = ++this.event_id_helper

            this.events.push(event)
        }
    }

    listen(event_name, event)
    {
        let listeners = this.event_listeners[event_name]
        if (!listeners)
            listeners = this.event_listeners[event_name] = []

        //检查是否已经存在
        for (let listener of listeners)
        {
            if (listener === event)
                return
        }

        listeners.push(event)

        let that = this
        return function ()
        {
            that.unlisten(event_name, event)
        }
    }

    //取消监听
    unlisten(event_name, listener)
    {
        let listeners = this.event_listeners[event_name]
        if (!listeners)
            return

        for (let index = 0; index < listeners.length; index++)
        {
            let event_listener = listeners[index]
            if (event_listener === listener)
            {
                listeners.splice(index, 1)
                return
            }
        }
    }

    trigger(event_name, ...args)
    {
        //挨个触发
        this.doing_events.push([event_name, ...args])

        this.try_trigger_one()
    }

    try_trigger_one()
    {
        if (this.is_doing_event)
            return

        let first = this.doing_events.splice(0, 1)[0]
        if (!first)
            return

        this.is_doing_event = true

        let event_name = first.splice(0, 1)
        let listeners = this.event_listeners[event_name] || []
        //遍历进行触发
        for (let listener of listeners)
        {
            safe_call(listener.trigger.bind(listener), ...first)
        }

        this.is_doing_event = false

        this.try_trigger_one()
    }

    update()
    {
        this.tick_events()
    }

    tick_events()
    {
        for (let event of this.events)
        {
            safe_call(event.tick.bind(event))
        }
    }
}
