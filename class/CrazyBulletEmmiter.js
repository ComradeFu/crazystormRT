/**
 * crazy storm 引擎对应的 子弹发射 类
 */
const Vector = require("../utils/Vector")
const CrazyObject = require("./CrazyObect")
const CrazyBullet = require("./CrazyBullet")
const CrazyEventGroup = require("./Events/CrazyEventGroup")

const { random } = require("../utils/function")
const Define = require("./CrazyDefines")
module.exports = class CrazeBulletEmmiter extends CrazyObject
{
    constructor(rt, conf)
    {
        super(rt, conf)

        this.layer_id = conf.layer_id

        //持续
        this.start_frame = conf.start_frame
        this.stop_frame = conf.stop_frame
        this.total_bullets = -1
        this.emmited_bullets = 0

        //发射坐标
        this.shoot_pos = new Vector(conf.emmite_pos_x, conf.emmite_pos_y)
        this.shoot_pos_rand = new Vector(conf.emmite_pos_x_rand, conf.emmite_pos_y_rand)

        //发射的半径信息
        this.radius = conf.emmite_radius
        this.radius_rand = conf.emmite_radius_rand
        this.radius_offset_angle = conf.emmite_offset_angle
        this.radius_offset_angle_rand = conf.emmite_offset_angle_rand

        this.bullet_count = conf.bullet_count
        this.bullet_count_rand = conf.bullet_count_rand

        //周期
        this.interval = conf.interval
        this.interval_rand = conf.interval_rand

        //发射范围信息
        this.range = conf.range
        this.range_rand = conf.emitter_range_rand
        this.bullet_offset_angle = conf.bullet_offset_angle
        this.bullet_offset_angle_rand = conf.emitter_angle_rand

        //绑定信息
        this.is_bound = conf.is_bound
        this.bound_id = conf.bound_id
        this.is_deep_bound = conf.is_deep_bound

        this.conf = conf

        //bullets
        this.bullets = {}

        this.next_emmit_time = 0

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
        return bullet_offset_angle + (x - (bullet_count / 2) * (range / bullet_count))
    }

    //发动一次子弹
    emmit_bullets()
    {
        //发射角度
        let bullet_count = this.bullet_count + random(0, this.bullet_count_rand + 1)
        let range = this.range + random(0, this.range_rand + 1)

        let radius_offset_angle = this.radius_offset_angle + random(0, this.radius_offset_angle_rand + 1)
        let bullet_offset_angle = this.bullet_offset_angle + random(0, this.bullet_offset_angle_rand + 1)

        //发射点位置
        let radius = this.radius + random(0, this.radius_rand + 1)

        //发射位置
        let shoot_pos = this.shoot_pos.clone()
        this.trans_pos(shoot_pos) //转换一次自身跟自机
        shoot_pos.x += random(0, this.shoot_pos_rand.x + 1)
        shoot_pos.y += random(0, this.shoot_pos_rand.y + 1)

        //组合好子弹obj
        let conf = this.conf
        let bullet_conf =
        {
            type: conf.bullet_type,

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
        }

        for (let index = 0; index < bullet_count; index++)
        {
            //发射点的半径 angle
            let radius_angle = this.emmit_angle(bullet_count, range, radius_offset_angle, index)

            let shoot_pos_vec = new Vector(radius)
            shoot_pos_vec.setAngle(radius_angle)

            shoot_pos_vec.add(shoot_pos)

            //发射的angle
            let emmit_angle = this.emmit_angle(bullet_count, range, bullet_offset_angle, index)
            emmit_angle += random(0, this.conf.speed_angle_rand + 1)

            let bullet_info = {
                pos: shoot_pos_vec,
                speed_angle: emmit_angle
            }

            bullet_info = Object.assign({}, bullet_conf, bullet_info)
            let bullet = new CrazyBullet(this.rt, bullet_info, this)

            let bullet_view_class = this.rt.bullet_view_class
            if (bullet_view_class)
            {
                let cls = bullet_view_class[0]
                let bullet_view = new cls(bullet, bullet_view_class[1])
                bullet.set_view(bullet_view)
            }

            //注意添加的是root节点（一旦发射不受其他影响之故）
            this.rt.root.add_child(bullet)

            this.bullets[bullet.id] = bullet

        }
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

    //跳动
    on_update()
    {
        let cur_tick = this.rt.frame_count

        //还没有开始
        if (cur_tick < this.start_frame)
            return

        //已经结束
        if (cur_tick > this.stop_frame)
            return

        let next_emmit_time = this.next_emmit_time
        if (cur_tick >= next_emmit_time)
        {
            if (this.total_bullets != -1 && this.emmited_bullets >= this.total_bullets)
                return

            //递增
            this.next_emmit_time = cur_tick + this.conf.interval + random(0, this.conf.interval_rand + 1) + 1

            this.emmited_bullets++
            //发射一次子弹
            this.emmit_bullets()
        }
    }
}
