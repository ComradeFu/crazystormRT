/**
 * 运动的基类
 * 能自我进行跳动运动，并更新位置
 */
const Vector = require ("../utils/Vector")
const safe_call = global.safe_call

module.exports = class CrazyObject
{
    constructor(rt, info)
    {
        //runtime 
        this.rt = rt
        
        //自己的id
        this.id = info.id

        //位置（都是世界坐标）
        this.pos = info.pos || []

        //速度
        this.speed = new Vector(info.speed, 0)
        this.speed.setAngle(info.speed_angle)

        //加速度
        this.speed_acc = new Vector(info.speed_acc, 0)
        this.speed_acc.setAngle(info.speed_acc_angle)

        //多重受力（算是加速度其实）
        this.forces = {
            //source-val 对
        }

        //子object
        this.children = {}

        //父节点
        this.father = null
    }

    /**
     * 再次注意RT的坐标系不是完整的，坐标都是world pos。
     * 只是在 set_pos 的时候会自动对 children 进行统一的偏移
     * */ 
    set_pos(pos)
    {
        assert(pos.length == 2)
        //会连带自己的子节点进行世界坐标变化
        let old_pos = this.pos
        this.pos = pos

        safe_call(this.on_set_pos.bind(this))

        let offset = [
            pos[0] - old_pos[0],
            pos[1] - old_pos[1]
        ]
        for(let id in this.children)
        {
            let child = this.children[id]
            let new_pos = [
                offset[0] + child.pos[0],
                offset[1] + child.pos[1]
            ]
            child.set_pos(new_pos)
        }
    }

    on_set_pos()
    {
        //pass
    }

    //从父级删除
    remove_from()
    {
        this.father.remove_child(this)
    }

    //删除子节点，简单直接触发遍历删除
    remove_child(child)
    {
        for(let id of child.children)
        {
            let sub_child = child.children[id]
            child.remove_child(sub_child)
        }

        let id = child.id
        delete this.children[id]

        safe_call(child.on_remove.bind(child))
    }

    on_remove()
    {
        //pass
    }

    //add_to
    add_to(target)
    {
        target.add_child(this)
    }

    add_child(child)
    {
        assert(target instanceof CrazyObject)

        child.father = this
        this.children[child.id] = child

        safe_call(child.on_add.bind(child))
    }

    on_add()
    {
        //pass
    }

    //增加受力，val 是 2次vector
    add_force(source, val)
    {
        this.forces[source] = val
    }

    del_force(source)
    {
        delete this.forces[source]
    }

    get_force(source)
    {
        return this.forces[source]
    }

    //跳动自身的接口
    update(tick)
    {
        this.update_pos()
        this.update_speed() 

        //update child
        for(let id in this.children)
        {
            let child = this.children[id]
            child.update(tick)
        }

        safe_call(this.on_update.bind(this), tick)
    }

    update_pos()
    {
        //每跳动一帧，就要更新一次位置。这里偷懒直接x、y转化一个 vector 进行运算
        let vector_pos = new Vector(...this.pos)

        let new_pos_vector = vector_pos.add(this.speed)
        this.set_pos(new_pos_vector.x, new_pos_vector.y)
    }

    update_speed()
    {
        this.update_acc()
        this.update_forces()  
    }

    update_acc()
    {
        //同时计算好加速度
        this.speed.add(this.speed_acc)
    }

    update_forces()
    {
        //计算好受力
        let total_force = new Vector()
        for(let source in this.forces)
        {
            let force = this.forces[source]
            total_force.add(force)
        }

        //影响当前的速度
        this.speed.add(total_force)
    }

    on_update(tick)
    {
        //pass
    }
}
