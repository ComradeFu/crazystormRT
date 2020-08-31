/**
 * 加速度（矢量）变化效果，三种，减少、增加、变化到
 */
const CrazyEffectBase = require("./CrazyEffectBase")

module.exports = class CrazyEffectBulletSPeedAcc extends CrazyEffectBase
{
    static get_name()
    {
        return "子弹加速度"
    }

    //子弹的效果
    get_origin_val_bullet()
    {
        return this.obj.speed_acc.getLength()
    }

    do_effect_bullet()
    {
        let val = this.get_cur_val()
        this.obj.speed_acc.setLength(val)
    }

    //发射器的效果
    get_origin_val_emmiter()
    {
        return this.obj.active_conf.bullet_speed_acc
    }

    do_effect_emmiter()
    {
        let val = this.get_cur_val()
        this.obj.active_conf.bullet_speed_acc = val
    }
}
