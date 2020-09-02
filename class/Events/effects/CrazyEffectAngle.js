/**
 * 发射角度变化
 */
const CrazyEffectBase = require("./CrazyEffectBase")

module.exports = class CrazyEffectAngle extends CrazyEffectBase
{
    static get_name()
    {
        return "朝向"
    }

    //获取当时的值
    get_origin_val()
    {
        return this.obj.angle
    }

    do_effect()
    {
        let val = this.get_cur_val()
        this.obj.set_angle(val)
    }
}
