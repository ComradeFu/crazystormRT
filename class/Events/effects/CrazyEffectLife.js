/**
 * 生命变化效果，三种，减少、增加、变化到
 */
const CrazyEffectBase = require("./CrazyEffectBase")

module.exports = class CrazyEffectLife extends CrazyEffectBase
{
    constructor(group, conf)
    {
        super(group, conf)
    }

    static get_name()
    {
        return "生命值"
    }

    //获取当时的值
    get_origin_val()
    {
        return this.obj.life
    }

    do_effect()
    {
        let val = this.get_cur_val()
        this.obj.life = val
    }
}
