const modules = {}

let modules_arr = [
    require("./CrazyEffectBulletSpeed"),
    require("./CrazyEffectBulletSpeedDirection"),
    require("./CrazyEffectLife"),
    require("./CrazyEffectSpeed"),
    require("./CrazyEffectSpeedDirection"),
    require("./CrazyEffectXPos"),
    require("./CrazyEffectYPos"),
    require("./CrazyEffectEmmitAngle"),
]

for (let mod of modules_arr)
{
    modules[mod.get_name()] = mod
}

module.exports = modules
