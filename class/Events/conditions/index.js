const modules = {}

let modules_arr = [
    require("./CrazyConditionCurFrame"),
    require("./CrazyConditionXPos"),
    require("./CrazyConditionYPos")
]

for (let mod of modules_arr)
{
    modules[mod.get_name()] = mod
}

module.exports = modules
