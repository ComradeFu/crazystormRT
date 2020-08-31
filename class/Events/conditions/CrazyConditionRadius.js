/**
 * 当前发射的半径，这个 condition 应该是专属 bulletemmiter 的
 */
const CrazyConditionBase = require("./CrazyConditionBase")

module.exports = class CrazyConditionRadius extends CrazyConditionBase
{
    //关注的事件
    get_concert_event_names()
    {
        return ["radius_change"]
    }

    static get_name()
    {
        return "半径"
    }

    //获取比较的值
    get_compare_val()
    {
        return this.obj.radius
    }
}
