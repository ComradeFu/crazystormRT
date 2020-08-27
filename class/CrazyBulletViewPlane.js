const CrazyBulletView = require("./CrazyBulletView")
//子弹的view类
module.exports = class BulletView extends CrazyBulletView
{
    constructor(bullet, info)
    {
        super(bullet, info)

        this.bullet = bullet

        this.fight = info.fight
        this.battle = info.battle
        let owner = this.owner = info.owner
        let pos = bullet.pos

        //新建一个子弹出来
        let bullet_info = {
            pos: [pos.x, pos.y],
            camp: owner.camp,
            owner: owner,
            ai_type: "m/crazystorm_bullet",
            ai_config: {
                crazy_bullet: bullet,
            },
            view_angle: bullet.angle,
        }
        bullet_info.obj_id = 11001; //先固定
        let view = this.fight.generate_bullet(this.battle, owner, bullet_info);
        this.view = view

        //变形
        let scale_x = bullet.conf.scale_x
        let scale_y = bullet.conf.scale_y

        view.scale = [scale_x, scale_y]
        this.fight.push_view(this.battle, "update_scale", view.id);

        //色相跟透明度


        view.on_destroy = function ()
        {
            if (!bullet.is_destroyed)
                //同步销毁
                bullet.destroy()
        }
    }

    on_remove()
    {
        //同时销毁子弹

        // this.fight.add_to_remove(this.battle, this.view.id);
    }

    on_destroy()
    {
        this.fight.add_to_remove(this.battle, this.view.id);
    }

    on_add()
    {

    }

    on_set_pos(pos)
    {
        //设置子弹的位置
        let pos_x = pos.x
        let pos_y = pos.y

        let target = this.view
        target.speed[0] += pos_x - target.pos[0];
        target.speed[1] += pos_y - target.pos[1];
    }

    on_set_angle(angle)
    {
        this.view.view_angle = angle
    }
}
