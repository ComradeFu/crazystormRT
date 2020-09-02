/**
 * crazy storm 引擎对应的 layer 类
 */
const CrazyObject = require("./CrazyObect")
const CrazyBulletEmmiterGenerator = require("./CrazyBulletEmmiterGenerator")
const Vector = require("../../common/Vector")
const { deep_clone } = require("../utils/function")

module.exports = class CrazyLayer extends CrazyObject
{
    constructor(rt, config)
    {
        super(rt, config)
        this.name = config.name

        //配置
        this.bullet_emitters = {}

        //按照持续事件排出来的待发射emmiter 配置
        this.bullet_emmiter_generator = new CrazyBulletEmmiterGenerator(this)

        //初始化自己的各种小组件
        this.load_bullet_emmiter(config)
    }

    load_bullet_emmiter(config)
    {
        let bullet_emmiters = this.bullet_emmiters = deep_clone(config.bullet_emitters)
        //处理绑定关系
        for (let id in bullet_emmiters)
        {
            let bullet_emmiter = bullet_emmiters[id]
            bullet_emmiter.eid = id

            if (bullet_emmiter.is_deep_bound)
            {
                //深度绑定相当于一个全新的发射器，比较特殊，需要转成相对坐标
                if (bullet_emmiter.pos)
                {
                    //不再决定位置
                    delete bullet_emmiter.pos
                    bullet_emmiter.local_pos = new Vector(0, 0)
                }
                let source = bullet_emmiters[bullet_emmiter.bound_id]
                let bounds = source.bounds
                if (!bounds)
                {
                    bounds = source.bounds = []
                }
                bounds.push(bullet_emmiter)
            }
            else
            {
                if (bullet_emmiter.pos)
                {
                    //算出相对位置
                    let center_pos = this.rt.center_pos
                    let world_pos = new Vector(...bullet_emmiter.pos)

                    let local_pos = world_pos.subtractNew(center_pos)

                    delete bullet_emmiter.pos
                    bullet_emmiter.local_pos = local_pos
                }

                //加入发射队列
                this.bullet_emmiter_generator.insert(bullet_emmiter)
            }
        }
    }

    on_update()
    {
        //更新发射生成
        this.bullet_emmiter_generator.update()
    }
}
