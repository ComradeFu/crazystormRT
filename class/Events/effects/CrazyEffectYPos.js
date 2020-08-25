/**
 * y 坐标效果，三种，减少、增加、变化到
 */
const CrazyEffectBase = require("./CrazyEffectBase")

module.exports = class CrazyEffectLife extends CrazyEffectBase
{
    static get_name()
    {
        return "Y坐标"
    }

    //获取当时的值
    get_origin_val()
    {
        return this.obj.pos[1]
    }

    do_effect()
    {
        let val = this.get_cur_val()
        this.obj.set_pos([this.obj.pos[0], val])
    }
}
