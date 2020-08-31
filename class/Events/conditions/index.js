const modules = {}

let modules_arr = [
    require("./CrazyConditionCurFrame"),
    require("./CrazyConditionXPos"),
    require("./CrazyConditionYPos"),
    require("./CrazyConditionRadius"),
    require("./CrazyConditionBulletCount")
]

for (let mod of modules_arr)
{
    modules[mod.get_name()] = mod
}

module.exports = modules
