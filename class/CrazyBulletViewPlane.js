const CrazyBulletView = require("./CrazyBulletView")
const Vector = require("./../utils/Vector")
//子弹的view类
module.exports = class BulletView extends CrazyBulletView
{
    constructor(bullet, info)
    {
        super(bullet, info)

        this.bullet = bullet

        let fight = this.fight = info.fight
        let battle = this.battle = info.battle
        let owner = this.owner = info.owner

        let offset_x = this.offset_x = info.offset_x
        let offset_y = this.offset_y = info.offset_y

        this.pos_scale = new Vector(info.pos_scale_x, info.pos_scale_y)

        let pos = bullet.pos

        //新建一个子弹出来
        let bullet_info = {
            pos: [pos.x * info.pos_scale_x + offset_x, pos.y * info.pos_scale_y + offset_y],
            camp: owner.camp,
            owner: owner,
            ai_type: "m/crazystorm_bullet",
            ai_config: {
                crazy_bullet: bullet,
            },
            view_angle: bullet.angle,
        }
        bullet_info.obj_id = 17700 + bullet.conf.type
        let view = fight.generate_bullet(this.battle, owner, bullet_info);
        this.view = view

        //变形
        this.on_set_scale(bullet.scale)

        //透明度
        let alpha = bullet.conf.alpha
        this.on_set_alpha(alpha)

        //色相
        if (global.enable_rgb)
        {
            let o = {};
            o.r = bullet.conf.R / 255;
            o.g = bullet.conf.G / 255;
            o.b = bullet.conf.B / 255;
            // o.clear = false;
            fight.push_view(battle, "colorfilter", view.id, o);
        }

        //渲染模式
        if (bullet.conf.highlight_blend_effect)
        {
            fight.push_view(battle, "change_blend_mode", view.id, "lighter");
        }

        //拖影效果


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

    on_set_pos(old_pos, new_pos)
    {
        let new_pos_clone = new_pos.clone()
        new_pos_clone.hadamardProduct(this.pos_scale)

        //设置子弹的位置
        let pos_x = new_pos_clone.x + this.offset_x
        let pos_y = new_pos_clone.y + this.offset_y

        let target = this.view

        target.speed[0] += pos_x - target.pos[0];
        target.speed[1] += pos_y - target.pos[1];
    }

    on_set_angle(angle)
    {
        this.view.view_angle = angle
    }

    on_set_scale(scale)
    {
        let fight = this.fight
        let battle = this.battle

        let scale_x = scale.x
        let scale_y = scale.y
        let view = this.view

        // view.scale = [scale_x, scale_y]
        view.scale = [scale_y, scale_x]
        fight.push_view(battle, "update_scale", view.id);
    }

    on_set_alpha(alpha)
    {
        let fight = this.fight
        let battle = this.battle

        let view = this.view
        view.alpha = alpha;
        fight.push_view(battle, "change_alpha", view.id, alpha);
    }
}
