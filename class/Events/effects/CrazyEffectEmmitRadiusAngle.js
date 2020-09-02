/**
 * 半径方向 变化效果，三种，减少、增加、变化到
 */
const CrazyEffectBase = require("./CrazyEffectBase")

module.exports = class CrazyEffectEmmitRadiusAngle extends CrazyEffectBase
{
    static get_name()
    {
        return "半径方向"
    }

    //获取当时的值
    get_origin_val()
    {
        return this.obj.radius_offset_angle.base
    }

    do_effect()
    {
        let val = this.get_cur_val()
        this.obj.radius_offset_angle.base = val
    }
}
