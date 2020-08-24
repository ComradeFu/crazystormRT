/**
 * 核心子弹类
 */
const CrazyObject = require("./CrazyObect")
const CrazyBulletView = require("./CrazyBulletView")
module.exports = class CrazyBullet extends CrazyObject
{
    constructor(rt, conf, emmiter)
    {
        super(rt, conf)

        //发射器
        this.emmiter = emmiter

        this.conf = conf

        //子弹的view类
        this.view = undefined

        //事件
        this.init_event_group()

        global.console.log(`bullet ${this.id} create !`)
    }

    init_event_group()
    {
        let bullet_events = this.conf.bullet_events
        if(bullet_events)
            this.event_group.init_by_conf(bullet_events)
    }

    set_view(view)
    {
        if(! view instanceof CrazyBulletView)
            throw new Error("子弹类需要view类来设定view")

        this.view = view
    }

    on_add(...args)
    {
        if(!this.view)
            return

        this.view.on_add(...args)
    }

    on_remove(...args)
    {
        if(!this.view)
            return

        this.view.on_remove(...args)
    }

    on_set_pos(...args)
    {
        global.console.log(`bullet ${this.id} move : ${args[0].x}, ${args[0].y}`)
        if(!this.view)
            return

        this.view.on_set_pos(...args)
    }
}
