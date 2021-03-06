/**
 * x 坐标效果，三种，减少、增加、变化到
 */
const CrazyEffectBase = require("./CrazyEffectBase")

module.exports = class CrazyEffectXPos extends CrazyEffectBase
{
    static get_name()
    {
        return "X坐标"
    }

    //获取当时的值
    get_origin_val()
    {
        return this.obj.pos.x
    }

    do_effect()
    {
        let val = this.get_cur_val()
        this.obj.set_pos([val, this.obj.pos.y])
    }
}
