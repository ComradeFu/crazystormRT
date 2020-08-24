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
const CrazyObject = require("./CrazyObect")
class CrazyStormRT 
{
    constructor(config)
    {
        this.config = new CrazyConfig(config)

        //object id helper
        this.id_helper = 0

        //根节点
        this.root = new CrazyObject(this)
        this.center = null

        //开始初始化
        this.load()

        this.frame_count = 0

        //创建 battle 的物体
        this.create_battle()
    }

    //从配置中load入
    load()
    {
        this.total_frame = this.config.total_frame
        this.desc = this.config.desc

        this.center = new CrazyCenter(this, this.config.center)
        this.root.add_child(this.center)
    }

    //创建battle有关的obj
    create_battle()
    {
        //玩家
        this.self_plane = new CrazyObject(this, {
            pos:[100, 700]
        })
    }

    //进行跳动
    update()
    {
        if(this.frame_count >= this.total_frame)
            return
        
        this.frame_count ++

        this.root.update()

        if(this.frame_count >= this.total_frame)
            this.stop()
    }

    stop()
    {
        if(this.on_stop)
        {
            this.on_stop()
        }
    }

    //获取id
    get_new_id()
    {
        return ++this.id_helper
    }
}

module.exports = CrazyStormRT
