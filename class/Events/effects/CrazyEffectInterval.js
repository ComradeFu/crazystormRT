/**
 * 发射周期变化
 */
const CrazyEffectBase = require("./CrazyEffectBase")

module.exports = class CrazyEffectInterval extends CrazyEffectBase
{
    static get_name()
    {
        return "周期"
    }

    //获取当时的值
    get_origin_val()
    {
        return this.obj.interval.base
    }

    do_effect()
    {
        let val = this.get_cur_val()
        this.obj.interval.base = val
    }
}
