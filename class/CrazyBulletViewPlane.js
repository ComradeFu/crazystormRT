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
            ai_type: "c/do_nothing",
            view_angle: bullet.angle,
        }
        bullet_info.obj_id = 11001; //先固定
        let view = this.fight.generate_bullet(this.battle, owner, bullet_info);
        this.view = view
    }

    on_remove()
    {

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
}
