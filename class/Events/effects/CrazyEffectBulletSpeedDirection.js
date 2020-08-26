/**
 * 速度角度变化效果，三种，减少、增加、变化到
 */
const CrazyEffectBase = require("./CrazyEffectBase")

module.exports = class CrazyEffectLife extends CrazyEffectBase
{
    static get_name()
    {
        return "子弹速度方向"
    }

    //获取当时的值
    get_origin_val()
    {
        //弧度值
        let rad = this.obj.speed.getAngle()
        return rad / Math.PI * 180
    }

    do_effect()
    {
        //角度
        let val = this.get_cur_val()
        val = val / 180 * Math.PI

        this.obj.speed.setAngle(val)
    }
}
