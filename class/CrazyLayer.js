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

        this.bullet_emitters = undefined

        //按照持续事件排出来的待发射emmiter 配置
        this.bullet_emmiter_generator = new CrazyBulletEmmiterGenerator(this)

        //初始化自己的各种小组件
        this.load_bullet_emmiter(config)
    }

    load_bullet_emmiter(config)
    {
        let bullet_emmiters = this.bullet_emitters = deep_clone(config.bullet_emitters)
        //处理绑定关系
        for (let id in bullet_emmiters)
        {
            let bullet_emmiter = bullet_emmiters[id]
            if (bullet_emmiter.bound_id == -1)
            {
                //比较特殊，需要转成相对坐标
                if (bullet_emmiter.pos)
                {
                    let world_pos = new Vector(...bullet_emmiter.pos)
                    let relative_pos = this.to_local_pos(world_pos)

                    delete bullet_emmiter.pos
                    bullet_emmiter.local_pos = relative_pos
                }

                //加入发射队列
                this.bullet_emmiter_generator.insert(bullet_emmiter)
            }
            else
            {
                //比较特殊，需要转成相对坐标
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
        }
    }

    on_update()
    {
        //更新发射生成
        this.bullet_emmiter_generator.update()
    }
}
