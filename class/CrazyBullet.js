/**
 * 核心子弹类
 */
const CrazyObject = require("./CrazyObect")
const CrazyBulletView = require("./CrazyBulletView")
const CrazyEventGroup = require("./Events/CrazyEventGroup")
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

        // global.console.log(`bullet ${this.id} create !`)
    }

    init_event_group()
    {
        let bullet_events = this.conf.bullet_events
        if (bullet_events)
        {
            for (let bullet_event of bullet_events)
            {
                let group = new CrazyEventGroup(this)
                group.init_by_conf(bullet_event)

                this.event_groups.push(group)
            }
        }
    }

    set_view(view)
    {
        if (!(view instanceof CrazyBulletView))
            throw new Error("子弹类需要view类来设定view")

        this.view = view
    }

    on_add(...args)
    {
        if (!this.view)
            return

        this.view.on_add(...args)
    }

    on_remove(...args)
    {
        let emmiter = this.emmiter
        delete emmiter.bullets[this.id]

        if (!this.view)
            return

        this.view.on_remove(...args)
    }

    on_set_pos(...args)
    {
        // global.console.log(`bullet[${this.id}] update pos : ${args[0].x}, ${args[0].y}`)
        if (!this.view)
            return

        this.view.on_set_pos(...args)
    }

    on_set_angle(...args)
    {
        if (!this.view)
            return

        this.view.on_set_angle(...args)
    }

    on_destroy()
    {
        if (!this.view)
            return

        this.view.on_destroy()
    }
}
