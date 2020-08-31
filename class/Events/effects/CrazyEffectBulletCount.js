/**
 * 发射半径变化
 */
const CrazyEffectBase = require("./CrazyEffectBase")

module.exports = class CrazyEffectBulletCount extends CrazyEffectBase
{
    static get_name()
    {
        return "条数"
    }

    //获取当时的值
    get_origin_val_emmiter()
    {
        return this.obj.bullet_count
    }

    do_effect_emmiter()
    {
        let val = this.get_cur_val()
        this.obj.set_bullet_count(val)
    }
}
