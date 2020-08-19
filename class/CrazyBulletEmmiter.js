/**
 * crazy storm 引擎对应的 子弹发射 类
 */
const CrazyObject = require("./CrazyObect")
module.exports = class CrazeBulletEmmiter extends CrazyObject
{
    constructor(rt, conf)
    {
        super(rt, conf)
        
        this.layer_id = conf.layer_id

        //持续
        this.start_frame = conf.start_frame
        this.stop_frame = conf.stop_frame

        this.conf = conf

        //
    }

    //跳动
    on_update(tick)
    {
        //还没有开始
        if(tick < this.start_frame)
            return

        //已经结束
        if(tick > this.stop_frame)
            return

        
    }
}
