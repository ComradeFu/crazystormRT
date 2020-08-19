/**
 * 事件的效果基类
 */
module.exports = class CrazyEffectBase
{
    constructor(group, conf)
    {
        this.group = group
        this.obj = obj
    }

    do_effect()
    {
        throw Error("must override do_effect method.")
    }
}
