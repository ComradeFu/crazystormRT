/**
 * 当前发射的子弹条数，这个 condition 应该是专属 bulletemmiter 的
 */
const CrazyConditionBase = require("./CrazyConditionBase")

module.exports = class CrazyConditionBulletCount extends CrazyConditionBase
{
    //关注的事件
    get_concert_event_names()
    {
        return ["bullet_count_change"]
    }

    static get_name()
    {
        return "条数"
    }

    //获取比较的值
    get_compare_val()
    {
        return this.obj.bullet_count
    }
}
