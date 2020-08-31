/**
 * 速度角度变化效果，三种，减少、增加、变化到
 */
const CrazyEffectBase = require("./CrazyEffectBase")

module.exports = class CrazyEffectBulletSpeedDirection extends CrazyEffectBase
{
    static get_name()
    {
        return "子弹速度方向"
    }

    //子弹效果
    get_origin_val_bullet()
    {
        //弧度值
        let rad = this.obj.speed.getAngle()
        return rad / Math.PI * 180
    }

    do_effect_bullet()
    {
        //角度
        let val = this.get_cur_val()
        val = val / 180 * Math.PI

        this.obj.speed.setAngle(val)
    }

    //发射器效果
    get_origin_val_emmiter()
    {
        return this.obj.active_conf.bullet_speed_angle
    }

    do_effect_emmiter()
    {
        let val = this.get_cur_val()
        this.obj.active_conf.bullet_speed_angle = val
    }
}
