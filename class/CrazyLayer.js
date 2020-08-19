/**
 * crazy storm 引擎对应的 layer 类
 */
const CrazyObject = require("./CrazyObect")
const CrazyBulletEmmiter = require("./CrazyBulletEmmiter")
module.exports = class CrazyLayer extends CrazyObject
{
    constructor(config)
    {
        super(config)
        this.name = config.name
        
        this.bullet_emitters = {}

        //初始化自己的各种小组件
        this.load_bullet_emmiter(config)
    }

    load_bullet_emmiter(config)
    {
        let bullet_emmiters = config.bullet_emmiters

        for(let id in bullet_emmiters)
        {
            let emmiter = new CrazyBulletEmmiter(this.rt, bullet_emmiter)
            this.bullet_emitters[emmiter.id] = emmiter
        }
    }
}
