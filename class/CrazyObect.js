/**
 * 运动的基类
 * 能自我进行跳动运动，并更新位置
 */
const Vector = require("../utils/Vector")
const { safe_call, random, angle2rad, rad2angle } = require("../utils/function")

module.exports = class CrazyObject
{
    constructor(rt, info)
    {
        info = info || {}
        //runtime 
        this.rt = rt

        //life（截止帧） -1 永久
        this.life = info.life || -1

        this.frame_count = 0

        //自己的id
        this.id = rt.get_new_id()

        this.pos = new Vector(0, 0)

        //位置（都是世界坐标）
        if (info.pos)
            this.set_pos(info.pos)

        //角度
        this.angle = info.angle || 0

        //速度
        let speed = info.speed || 0
        let speed_rand = info.speed_rand || 0
        speed += random(0, speed_rand + 1)

        let speed_angle = info.speed_angle || 0
        let speed_angle_rand = info.speed_angle_rand || 0
        speed_angle += random(0, speed_angle_rand + 1)

        this.speed = new Vector(speed, 0)
        this.speed.setAngle(angle2rad(speed_angle))

        //速度缩放
        let speed_scale_x = info.speed_scale_x || 1
        let speed_scale_y = info.speed_scale_y || 1
        this.speed_scale = new Vector(speed_scale_x, speed_scale_y)

        //加速度
        let speed_acc = info.speed_acc || 0
        let speed_acc_rand = info.speed_acc_rand || 0
        speed_acc += random(0, speed_acc_rand + 1)

        let speed_acc_angle = info.speed_acc_angle || 0
        let speed_acc_angle_random = info.speed_acc_angle_random || 0
        speed_acc_angle += random(0, speed_acc_angle_random + 1)

        this.speed_acc = new Vector(speed_acc, 0)
        this.speed_acc.setAngle(angle2rad(speed_acc_angle))

        this.face_speed_angle = info.face_speed_angle

        //多重受力（算是加速度其实）
        this.forces = {
            //source-val 对
        }

        //子object
        this.children = {}

        //父节点
        this.father = null

        //自身事件
        this.event_groups = []
    }

    /**
     * 再次注意RT的坐标系不是完整的，坐标都是world pos。
     * 只是在 set_pos 的时候会自动对 children 进行统一的偏移
     * pos = Vector(x, y)
     */
    set_pos(pos)
    {
        if (pos.length == 2)
        {
            pos = new Vector(pos[0], pos[1])
        }

        if (!(pos instanceof Vector))
            throw Error("invalid pos!")

        //会连带自己的子节点进行世界坐标变化
        let old_pos = this.pos
        this.pos = pos

        safe_call(this.on_set_pos.bind(this), pos)

        let offset = pos.subtractNew(old_pos)
        for (let id in this.children)
        {
            let child = this.children[id]
            let new_pos = child.pos.add(offset)

            child.set_pos(new_pos)
        }
    }

    on_set_pos()
    {
        //pass
    }

    //设置角度（不是弧度)
    set_angle(angle)
    {
        this.angle = angle

        this.on_set_angle(angle)
    }

    on_set_angle()
    {
        //pass
    }

    //设置速度 Vector(magnitude, angle)
    set_speed(speed)
    {
        this.speed = speed
    }

    //设置加速度 Vector(magnitute, angle)
    set_speed_acc(speed_acc)
    {
        this.speed_acc = speed_acc
    }

    //摧毁自己
    destroy()
    {
        this.is_destroyed = true

        //摧毁子节点
        for (let id in this.children)
        {
            let child = this.children[id]
            child.on_destroy()
        }

        let father = this.father
        if (father)
            father.remove_child(this)

        safe_call(this.on_destroy.bind(this))
    }

    on_destroy()
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
        for (let id in child.children)
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
        if (!(child instanceof CrazyObject))
            throw Error("child must be a CrazyObject.")

        if (child.father)
            child.father.remove_child(child)

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
        this.__tick(tick)
    }

    __tick(tick)
    {
        this.frame_count++

        //事件
        this.on_event("tick")

        this.update_pos()
        this.update_speed()

        this.update_events()

        //update child
        for (let id in this.children)
        {
            let child = this.children[id]
            child.update(tick)
        }

        this.update_life()

        safe_call(this.on_update.bind(this), tick)
    }

    update_pos()
    {
        //每跳动一帧，就要更新一次位置。这里偷懒直接x、y转化一个 vector 进行运算
        let old_pos = this.pos.clone()

        //速度缩放
        let speed = this.speed.hadamardProductNew(this.speed_scale)

        let new_pos_vector = this.pos.addNew(speed)
        this.set_pos(new_pos_vector)

        if (this.face_speed_angle)
        {
            let distance = new_pos_vector.subtractNew(old_pos)
            let move_angle = distance.getAngle()

            move_angle = rad2angle(move_angle)
            this.set_angle(move_angle)
        }
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
        for (let source in this.forces)
        {
            let force = this.forces[source]
            total_force.add(force)
        }

        //影响当前的速度
        this.speed.add(total_force)
    }

    update_life()
    {
        if (this.life == -1)
            return

        let frame_count = this.frame_count
        if (frame_count > this.life + 1)
        {
            //开始销毁程序
            this.destroy()
        }
    }

    update_events()
    {
        for (let event_group of this.event_groups)
            event_group.update()
    }

    on_update()
    {
        //pass
    }

    //透传事件
    trigger_object_event(event_name, ...args)
    {
        this.on_event(event_name, ...args)
        //遍历子节点进行，所有的事件都是透穿
        for (let id in this.children)
        {
            let child = this.children[id]
            safe_call(child.trigger_object_event.bind(child), event_name, ...args)
        }
    }

    on_event(event_name, ...args)
    {
        //触发自己的group
        for (let event_group of this.event_groups)
            event_group.trigger(event_name, ...args)
    }
}
