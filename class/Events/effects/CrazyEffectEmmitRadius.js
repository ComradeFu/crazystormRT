/**
 * 发射半径 变化效果，三种，减少、增加、变化到
 */
const CrazyEffectBase = require("./CrazyEffectBase")

module.exports = class CrazyEffectEmmitRadius extends CrazyEffectBase
{
    static get_name()
    {
        return "半径"
    }

    //获取当时的值
    get_origin_val()
    {
        return this.obj.radius.base
    }

    do_effect()
    {
        let val = this.get_cur_val()
        this.obj.radius.base = val
    }
}
