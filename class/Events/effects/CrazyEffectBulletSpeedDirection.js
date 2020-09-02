/**
 * 速度角度变化效果，三种，减少、增加、变化到
 */
const CrazyEffectBase = require("./CrazyEffectBase")
const Vector = require("../../../utils/Vector")
const CrazyNumber = require("../../CrazyNumber")
const { rad2angle } = require("../../../utils/function")

module.exports = class CrazyEffectBulletSpeedDirection extends CrazyEffectBase
{
    static get_name()
    {
        return "子弹速度方向"
    }

    //需要转换一次
    get_target_val(conf)
    {
        if (conf[0] == "自机")
        {
            let rt = this.obj.rt
            let pos = this.obj.pos

            let self_plane_pos = rt.self_plane.pos
            //计算角度
            let vec = new Vector(self_plane_pos.x - pos.x, self_plane_pos.y - pos.y)
            let rad = vec.getAngle()

            return rad2angle(rad)
        }

        let rand_number = new CrazyNumber(...conf)
        return rand_number.val
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
