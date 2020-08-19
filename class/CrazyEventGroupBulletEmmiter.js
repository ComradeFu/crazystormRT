/**
 * 重载的，专属于子弹发射器的事件
 */
const CrazyEventGroup = require("./CrazyEventGroup")

//不同的效果的映射表
let effect2class =
{
    
}

module.exports = class CrazyEventGroupBulletEmmiter extends CrazyEventGroup
{
    constructor(conf)
    {
        conf = conf || {}

        super(conf)

        this.load_events(conf.events)
    }

    load_events(conf)
    {
        if(!conf)
            return

        for(let one in conf)
        {
            let event = new CrazeEvent(this, one)
            this.events.push(event)
        }
    }
}
