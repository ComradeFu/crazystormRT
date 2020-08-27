/**
 * crazy storm 引擎对应的 layer 类
 */
const CrazyObject = require("./CrazyObect")
const CrazyBulletEmmiter = require("./CrazyBulletEmmiter")
module.exports = class CrazyLayer extends CrazyObject
{
    constructor(rt, config)
    {
        super(rt, config)
        this.name = config.name

        this.bullet_emitters = {}

        //初始化自己的各种小组件
        this.load_bullet_emmiter(config)
    }

    load_bullet_emmiter(config)
    {
        let bullet_emmiters = config.bullet_emitters

        for (let id in bullet_emmiters)
        {
            let bullet_emmiter = bullet_emmiters[id]

            let emmiter = new CrazyBulletEmmiter(this.rt, bullet_emmiter)
            this.bullet_emitters[id] = emmiter

            this.add_child(emmiter)
        }

        //处理绑定关系，绑定的发射器退化成，只提供配置克隆的能力，不具有发射能力
        for (let bullet_emmiter_id in this.bullet_emitters)
        {
            let bullet_emmiter = this.bullet_emitters[bullet_emmiter_id]
            if (bullet_emmiter.bound_id != -1)
            {
                //设定为真
                bullet_emmiter.set_bound_template()

                let bound_emmiter = this.bullet_emitters[bullet_emmiter.bound_id]
                bound_emmiter.set_bound_emmiter(bullet_emmiter)
            }
        }
    }
}
