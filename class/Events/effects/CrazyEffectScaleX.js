/**
 * 发射宽比变化
 */
const CrazyEffectBase = require("./CrazyEffectBase")

module.exports = class CrazyEffectScaleX extends CrazyEffectBase
{
    static get_name()
    {
        return "宽比"
    }

    //子弹的效果
    get_origin_val_bullet()
    {
        return this.obj.scale.x
    }

    do_effect_bullet()
    {
        let val = this.get_cur_val()
        let new_vec = this.obj.scale.clone()

        new_vec.x = val
        this.obj.set_scale(new_vec)
    }

    //发射器效果
    get_origin_val_emmiter()
    {
        return this.obj.active_conf.bullet_scale_x
    }

    do_effect_emmiter()
    {
        let val = this.get_cur_val()
        this.obj.active_conf.bullet_scale_x = val
    }
}
