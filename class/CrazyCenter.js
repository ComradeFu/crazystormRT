/**
 * crazy storm  的center层
 */
const CrazyLayer = require("./CrazyLayer")
module.exports = class CrazyCenter
{
    constructor(config)
    {
        super(config)
        this.name = config.name

        //初始化自己的各种小组件
        this.layers = {}

        this.load_layers(config)
    }

    load_layers(config)
    {
        let conf_layers = config.layers
        for(let id in conf_layers)
        {
            let conf_layer = conf_layers[id]
            let layer = new CrazyLayer(this.rt, conf_layer)

            this.layers[layer.id] = layer
            this.add_child(layer)
        }
    }
}
