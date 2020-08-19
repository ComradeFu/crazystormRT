/**
 * 当前Xpos条件
 */
const CrazyConditionBase = require("./CrazyConditionBase")

module.exports = class CrazyConditionXPos extends CrazyConditionBase
{
    //关注的事件
    get_concert_event_names()
    {
        return ["tick"]
    }

    //获取比较的值
    get_compare_val()
    {
        return this.obj.pos[0]
    }
}
