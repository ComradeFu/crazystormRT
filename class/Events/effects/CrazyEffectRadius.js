/**
 * 发射半径变化
 */
const CrazyEffectBase = require("./CrazyEffectBase")

module.exports = class CrazyEffectRadius extends CrazyEffectBase
{
    static get_name()
    {
        return "半径"
    }

    //获取当时的值
    get_origin_val()
    {
        return this.obj.radius
    }

    do_effect()
    {
        let val = this.get_cur_val()
        this.obj.set_radius(val)
    }
}
