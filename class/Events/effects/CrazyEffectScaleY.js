/**
 * 发射高比变化
 */
const CrazyEffectBase = require("./CrazyEffectBase")

module.exports = class CrazyEffectScaleY extends CrazyEffectBase
{
    static get_name()
    {
        return "高比"
    }

    //子弹效果
    get_origin_val_bullet()
    {
        return this.obj.scale.y
    }

    do_effect_bullet()
    {
        let val = this.get_cur_val()
        let new_vec = this.obj.scale.clone()

        new_vec.y = val
        this.obj.set_scale(new_vec)
    }

    //发射器效果
    get_origin_val_emmiter()
    {
        return this.obj.active_conf.bullet_scale_y
    }

    do_effect_emmiter()
    {
        let val = this.get_cur_val()
        this.obj.active_conf.bullet_scale_y = val
    }
}
