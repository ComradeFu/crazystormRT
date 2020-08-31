/**
 * 加速度方向 变化效果，三种，减少、增加、变化到
 */
const CrazyEffectBase = require("./CrazyEffectBase")

module.exports = class CrazyEffectBulletSpeedAccDirection extends CrazyEffectBase
{
    static get_name()
    {
        return "子弹加速度方向"
    }

    //子弹效果
    get_origin_val_bullet()
    {
        //弧度值
        let rad = this.obj.speed_acc.getAngle()
        return rad / Math.PI * 180
    }

    do_effect_bullet()
    {
        //角度
        let val = this.get_cur_val()
        val = val / 180 * Math.PI

        this.obj.speed_acc.setAngle(val)
    }

    //发射器效果
    get_origin_val_emmiter()
    {
        return this.obj.active_conf.bullet_speed_acc_angle
    }

    do_effect_emmiter()
    {
        let val = this.get_cur_val()
        this.obj.active_conf.bullet_speed_acc_angle = val
    }
}
