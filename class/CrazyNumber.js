/**
 * Crazy的Number， 0+90 表示 在 0 + [-90, 90] 中进行激荡
 */
const { lerp } = require("../utils/function")
module.exports = class CrazyNumber
{
    constructor(base, rand)
    {
        rand = rand || 0

        this.base = base
        this.rand = rand

        //固定的（不会每次调用都变化的值)
        this.fixed_val = base + lerp(-rand, rand, Math.random())
    }

    get val()
    {
        let base = this.base
        let rand = this.rand
        return base + lerp(-rand, rand, Math.random())
    }
}
