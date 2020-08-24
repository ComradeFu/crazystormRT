const modules = require("./Events/conditions");

/**
 * bullet 的view 类，不可直接使用
 */
modules.exports = class CrazyBulletView
{
    constructor(obj)
    {

    }

    on_remove()
    {
        throw new Error("must override on_remove function!")
    }

    on_add()
    {
        throw new Error("must override on_add function!")
    }

    on_set_pos()
    {
        throw new Error("must override on_set_pos function!")
    }
}
