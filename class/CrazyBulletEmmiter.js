/**
 * crazy storm 引擎对应的 子弹发射 类
 */
const Vector = require("../utils/Vector")
const CrazyNumber = require("./CrazyNumber")
const CrazyObject = require("./CrazyObect")
const CrazyBullet = require("./CrazyBullet")
const CrazyEventGroup = require("./Events/CrazyEventGroup")

const { lerp, angle2rad, rad2angle } = require("../utils/function")
const Define = require("./CrazyDefines")
module.exports = class CrazeBulletEmmiter extends CrazyObject
{
    constructor(rt, conf)
    {
        super(rt, conf)

        this.layer_id = conf.layer_id

        //目前是给事件系统所使用
        this.tp = "emmiter"

        //持续
        this.start_frame = conf.start_frame
        this.stop_frame = conf.stop_frame
        this.total_bullets = -1
        this.emmited_bullets = 0

        //发射坐标
        this.shoot_pos = new Vector(conf.emmite_pos_x, conf.emmite_pos_y)
        this.shoot_pos_rand = new Vector(conf.emmite_pos_x_rand, conf.emmite_pos_y_rand)

        //发射的半径信息
        this.radius = new CrazyNumber(conf.emmite_radius, conf.emmite_radius_rand)
        this.radius_offset_angle = new CrazyNumber(conf.emmite_offset_angle, conf.emmite_offset_angle_rand)

        this.bullet_count = new CrazyNumber(conf.bullet_count, conf.bullet_count_rand)

        //周期
        this.interval = new CrazyNumber(conf.interval, conf.interval_rand)

        //发射范围信息
        this.range = new CrazyNumber(conf.range, conf.range_rand)
        this.bullet_offset_angle = new CrazyNumber(conf.bullet_offset_angle, conf.emitter_angle_rand)

        //绑定信息
        this.is_bound = conf.is_bound
        this.bound_id = conf.bound_id
        this.is_deep_bound = conf.is_deep_bound
        this.is_relative_bound_direction = conf.is_relative_bound_direction

        this.conf = conf
        this.active_conf = Object.assign({}, conf)

        //bullets
        this.bullets = {}

        //
        this.init_event_group()
    }

    init_event_group()
    {
        let emmiter_events = this.conf.emmiter_events
        if (emmiter_events)
        {
            for (let emmiter_event of emmiter_events)
            {
                let group = new CrazyEventGroup(this)
                group.init_by_conf(emmiter_event)

                this.event_groups.push(group)
            }
        }
    }

    /**
     * 动态计算以及子弹应该有的角度（因为可能修改）发射点的 pos
     * 第 x 个，0 <= x < this.bullet_count
     */
    emmit_angle(bullet_count, range, bullet_offset_angle, x)
    {
        return bullet_offset_angle + (x - (bullet_count - 1) / 2) * (range / bullet_count)
    }

    //发动一次子弹
    emmit_bullets()
    {
        //发射角度
        let bullet_count = this.bullet_count.val
        let range = this.range.val

        let radius_offset_angle = this.radius_offset_angle.val
        let bullet_offset_angle = this.bullet_offset_angle.val

        //如果绑定了，而且方向跟父节点有关系，还要加上父节点的速度方向
        if (this.bound_id != -1 && this.is_relative_bound_direction)
        {
            let father_angle = this.father.speed.getAngle()
            bullet_offset_angle += rad2angle(father_angle)
        }

        //发射点位置
        let radius = this.radius.val

        //发射位置
        let shoot_pos = this.shoot_pos.clone()
        this.trans_pos(shoot_pos) //转换一次自身跟自机
        shoot_pos.x += lerp(-this.shoot_pos_rand.x, this.shoot_pos_rand.x, Math.random())
        shoot_pos.y += lerp(-this.shoot_pos_rand.y, this.shoot_pos_rand.y, Math.random())

        //组合好子弹obj
        let conf = this.active_conf
        let bullet_conf =
        {
            type: conf.bullet_type,

            life: conf.bullet_life,
            scale_x: conf.bullet_scale_x,
            scale_y: conf.bullet_scale_y,
            R: conf.bullet_R,
            G: conf.bullet_G,
            B: conf.bullet_B,
            alpha: conf.bullet_alpha,
            angle: conf.bullet_rotate_angle,
            face_speed_angle: conf.bullet_face_speed_angle,
            speed: conf.bullet_speed,
            speed_rand: conf.bullet_speed_rand,
            speed_angle: conf.bullet_speed_angle,
            speed_angle_rand: conf.bullet_speed_angle_rand,
            speed_acc: conf.bullet_speed_acc,
            speed_acc_rand: conf.bullet_speed_acc_rand,
            speed_acc_angle: conf.bullet_speed_acc_angle,
            speed_acc_angle_rand: conf.bullet_speed_acc_angle_rand,

            speed_scale_x: conf.speed_scale_x,
            speed_scale_y: conf.speed_scale_y,

            atomization_effect: conf.atomization_effect,
            erase_effect: conf.erase_effect,
            highlight_blend_effect: conf.highlight_blend_effect,
            drag_effect: conf.drag_effect,
            erase_when_out: conf.erase_when_out,
            invincible: conf.invincible,

            bullet_events: conf.bullet_events,
            mask_effect: conf.mask_effect,
            inverse_force_effect: conf.inverse_force_effect,
            force_field_effect: conf.force_field_effect,

            //绑定的发射器
            bounds: conf.bounds,
        }

        for (let index = 0; index < bullet_count; index++)
        {
            //发射点的半径 angle
            let radius_angle = this.emmit_angle(bullet_count, range, radius_offset_angle, index)

            let shoot_pos_vec = new Vector(radius)
            shoot_pos_vec.setAngle(angle2rad(radius_angle))

            shoot_pos_vec.add(shoot_pos)

            //发射的angle
            let emmit_angle = this.emmit_angle(bullet_count, range, bullet_offset_angle, index)
            emmit_angle += lerp(-this.conf.speed_angle_rand, this.conf.speed_angle_rand, Math.random())

            let bullet_info = {
                pos: shoot_pos_vec,
                speed_angle: emmit_angle
            }

            bullet_info = Object.assign({}, bullet_conf, bullet_info)

            this.shoot_bullet(bullet_info)
        }
    }

    //发射
    shoot_bullet(bullet_info)
    {
        let bullet = new CrazyBullet(this.rt, bullet_info, this)

        let bullet_view_class = this.rt.bullet_view_class
        if (bullet_view_class)
        {
            let cls = bullet_view_class[0]
            let bullet_view = new cls(bullet, bullet_view_class[1], this)
            bullet.set_view(bullet_view)
        }

        //注意添加的是root节点（一旦发射不受其他影响之故）

        //更新，直接不再受root控制

        // this.rt.root.add_child(bullet)

        this.bullets[bullet.id] = bullet
    }

    //转换坐标
    trans_pos(pos)
    {
        let rt = this.rt
        if (pos.x == Define.SELF_POS)
        {
            pos.x = this.pos.x
        }
        else if (pos.x == Define.SELF_PLANE_POS)
        {
            pos.x = rt.self_plane.pos.x
        }

        if (pos.y == Define.SELF_POS)
        {
            pos.y = this.pos.y
        }
        else if (pos.y == Define.SELF_PLANE_POS)
        {
            pos.y = rt.self_plane.pos.y
        }
    }

    //设置半径
    set_radius(radius)
    {
        this.radius = radius

        //触发事件
        this.on_event("radius_change")
    }

    //设置发射条数
    set_bullet_count(count)
    {
        this.bullet_count = count

        //触发事件
        this.on_event("bullet_count_change")
    }

    //跳动
    on_update()
    {
        let cur_tick = this.frame_count
        //已经结束
        if (cur_tick > this.stop_frame)
            return

        let interval = this.interval.val
        if (cur_tick != 0 && (cur_tick % interval) == 0)
        {
            if (this.total_bullets != -1 && this.emmited_bullets >= this.total_bullets)
                return

            this.emmited_bullets++
            //发射一次子弹
            this.emmit_bullets()
        }
    }
}
