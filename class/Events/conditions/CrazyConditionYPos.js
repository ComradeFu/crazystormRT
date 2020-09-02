/**
 * 当前Ypos条件
 */
const CrazyConditionBase = require("./CrazyConditionBase")

module.exports = class CrazyConditionYPos extends CrazyConditionBase
{
    //关注的事件
    get_concert_event_names()
    {
        return ["tick"]
    }

    static get_name()
    {
        return "Y坐标"
    }

    //获取比较的值
    get_compare_val()
    {
        return this.obj.pos.y
    }
}
