/**
 * 当前帧条件
 */
const CrazyConditionBase = require("./CrazyConditionBase")

module.exports = class CrazyConditionCurFrame extends CrazyConditionBase
{
    //关注的事件
    get_concert_event_names()
    {
        return ["tick"]
    }

    static get_name()
    {
        return "当前帧"
    }

    //获取比较的值
    get_compare_val()
    {
        let rt = this.obj.rt
        return rt.frame_cout
    }
}
