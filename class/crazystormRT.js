/**
 * crazy storm 1.03 （配置 1.01）的RunTime 类
 * 
 * 会对外暴露两个主要对象：
 * 1、自身信息（boss），主要是位置信息pos，可以被外界修改；
 * 2、自机信息（玩家），主要也是位置信息pos，可以被外界修改；
 * 
 * 会对外提供一个类：
 * 1、子弹View层基类（用来沟通view层跟里面逻辑层的关系）
 */
const CrazyConfig = require("./CrazyConfig")
const CrazyCenter = require("./CrazyCenter")
class CrazyStormRT 
{
    constructor(config)
    {
        this.config = new CrazyConfig(config)

        //根节点
        this.center = null

        //开始初始化
        this.load()

        this.frame_count = 0
    }

    //从配置中load入
    load()
    {
        this.center = new CrazyCenter(this, this.config)
    }

    //进行跳动
    update()
    {
        this.frame_count ++
        this.center.update()
    }
}

module.exports = CrazyStormRT
