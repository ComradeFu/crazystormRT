/**
 * 速度（矢量）变化效果，三种，减少、增加、变化到
 */
const CrazyEffectBase = require("./CrazyEffectBase")

module.exports = class CrazyEffectLife extends CrazyEffectBase
{
    static get_name()
    {
        return "速度"
    }

    //获取当时的值
    get_origin_val()
    {
        return this.obj.speed.getLength()
    }

    do_effect()
    {
        let val = this.get_cur_val()
        this.obj.speed.setLength(val)
    }
}
