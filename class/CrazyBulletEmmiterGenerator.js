/**
 * 子弹发射器的生成器
 * 会按照start frame 来生成emmiter
 */
module.exports = class CrazyBulletEmmiterGenerator
{
    constructor(owner)
    {
        this.owner = owner

        //避免循环引用的问题。。
        this.CrazyBulletEmmiter = require("./CrazyBulletEmmiter")

        //待生成的 waitings 队列
        this.waitings = []
    }

    insert(emmiter_conf)
    {
        let insert_index = 0
        for (let one of this.waitings)
        {
            if (one.start_frame >= emmiter_conf.start_frame)
            {
                break
            }

            insert_index++
        }

        this.waitings.splice(insert_index, 0, emmiter_conf)
    }

    insert_many(emmiter_confs)
    {
        for (let one of emmiter_confs)
            this.insert(one)
    }

    update()
    {
        this.try_create_emmiter()
    }

    try_create_emmiter()
    {
        let front = this.waitings[0]
        if (!front)
            return

        let frame_count = this.owner.frame_count
        if (front.start_frame > frame_count)
            return

        //删除
        this.waitings.splice(0, 1)

        let owner = this.owner

        let emmiter = new this.CrazyBulletEmmiter(owner.rt, front)
        owner.add_child(emmiter)

        let emmiters = owner.emmiters
        if (!emmiters)
        {
            emmiters = owner.emmiters = {}
        }
        emmiters[emmiter.eid] = emmiter

        //坐标
        if (front.local_pos)
        {
            emmiter.set_local_pos(front.local_pos)
        }

        this.try_create_emmiter()
    }
}
