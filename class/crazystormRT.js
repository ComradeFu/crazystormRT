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
const Vector = require("../utils/Vector")
class CrazyStormRT 
{
    constructor(config)
    {
        this.config = new CrazyConfig(config)

        //object id helper
        this.id_helper = 0

        //额外参数
        this.emmiter_extra_info = {}

        //根节点
        this.root = new CrazyObject(this)
        this.center = null

        this.total_frame = 0

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

        //记下来当时的 center x y （计算发射器坐标用）
        this.center_pos = new Vector(...this.config.center.pos)
    }

    //创建battle有关的obj
    create_battle()
    {
        //玩家
        this.self_plane = new CrazyObject(this, {
            pos: [100, 700]
        })
    }

    //进行跳动
    update()
    {
        if (this.frame_count > this.total_frame)
            return false

        if (this.frame_count == 0)
        {
            this.start()
        }

        this.root.update()

        this.frame_count++

        if (this.frame_count > this.total_frame)
        {
            this.stop()
            return false
        }

        return true
    }

    start()
    {
        //重新生成
        this.center = new CrazyCenter(this, this.config.center)
        this.root.add_child(this.center)

        if (this.on_start)
        {
            this.on_start()
        }
    }

    stop()
    {
        //重置 framecout
        this.frame_count = 0

        //重新生成新的 center
        this.center.destroy()

        if (this.on_stop)
        {
            this.on_stop()
        }
    }

    //获取id
    get_new_id()
    {
        return ++this.id_helper
    }

    //设置子弹view类
    set_bullet_view_class(view_class)
    {
        this.bullet_view_class = view_class
    }

    //设置发射器的额外子弹参数
    set_emmiter_extra_info(id, info)
    {
        let emmiter_info = this.emmiter_extra_info[id]
        if (!emmiter_info)
        {
            emmiter_info = this.emmiter_extra_info[id] = {}
        }

        Object.assign(emmiter_info, info)
    }
}

module.exports = CrazyStormRT
