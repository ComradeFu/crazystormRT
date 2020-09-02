/**
 * 透明度变化
 */
const CrazyEffectBase = require("./CrazyEffectBase")

module.exports = class CrazyEffectAlpha extends CrazyEffectBase
{
    static get_name()
    {
        return "不透明度"
    }

    //获取当时的值
    get_origin_val()
    {
        return this.obj.alpha
    }

    do_effect()
    {
        let val = this.get_cur_val()
        this.obj.set_alpha(val)
    }
}
