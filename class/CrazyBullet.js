/**
 * 核心子弹类
 */
const CrazyObject = require("./CrazyObect")
const CrazyBulletView = require("./CrazyBulletView")
const CrazyEventGroup = require("./Events/CrazyEventGroup")
const CrazyBulletEmmiterGenerator = require("./CrazyBulletEmmiterGenerator")

const Vector = require("../../common/Vector")

module.exports = class CrazyBullet extends CrazyObject
{
    constructor(rt, conf, emmiter)
    {
        super(rt, conf)

        //目前是给事件系统所使用
        this.tp = "bullet"

        //发射器
        this.emmiter = emmiter

        //宽高比
        this.scale = new Vector(conf.scale_x || 1, conf.scale_y || 1)

        //透明度
        this.alpha = conf.alpha

        this.conf = conf

        //子弹的view类
        this.view = undefined

        //事件
        this.init_event_group()

        // global.console.log(`bullet ${this.id} create !`)

        //子弹的life要做一次修改，跟消除子弹
        this.erase_effect = conf.erase_effect
        if (conf.erase_effect)
        {
            this.erase_effect_time = 20 //10帧来让它消失

            this.origin_life = this.life
            this.life += this.erase_effect_time
        }

        //同时，将绑定的子弹发射器，给绑到子弹
        if (conf.bounds)
        {
            let generator = new CrazyBulletEmmiterGenerator(this)
            generator.insert_many(conf.bounds)

            this.bullet_emmiter_generator = generator
        }
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

    on_update()
    {
        //更新发射生成
        if (this.bullet_emmiter_generator)
            this.bullet_emmiter_generator.update()

        //更新死亡动作
        this.check_erase_effect()
    }

    check_erase_effect()
    {
        if (!this.origin_life)
            return

        let past_time = this.frame_count - this.origin_life
        if (past_time < 0)
            return

        //比例
        let factor = (this.erase_effect_time - past_time) / this.erase_effect_time

        //缩放效果
        this.set_scale(new Vector(factor, factor))

        //透明度
        this.set_alpha(factor)
    }

    set_view(view)
    {
        if (!(view instanceof CrazyBulletView))
            throw new Error("子弹类需要view类来设定view")

        this.view = view
    }

    set_scale(scale)
    {
        this.scale = scale

        this.on_set_scale(scale)
    }

    on_set_scale(scale)
    {
        if (!this.view)
            return

        this.view.on_set_scale(scale)
    }

    set_alpha(alpha)
    {
        this.alpha = alpha

        this.on_set_alpha(alpha)
    }

    on_set_alpha(alpha)
    {
        if (!this.view)
            return

        this.view.on_set_alpha(alpha)
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
