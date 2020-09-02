const modules = {}

let modules_arr = [
    require("./CrazyEffectBulletSpeed"),
    require("./CrazyEffectBulletSpeedDirection"),
    require("./CrazyEffectBulletSPeedAcc"),
    require("./CrazyEffectBulletSpeedAccDirection"),
    require("./CrazyEffectLife"),
    require("./CrazyEffectSpeed"),
    require("./CrazyEffectSpeedDirection"),
    require("./CrazyEffectXPos"),
    require("./CrazyEffectYPos"),
    require("./CrazyEffectEmmitAngle"),
    require("./CrazyEffectRadius"),
    require("./CrazyEffectBulletCount"),
    require("./CrazyEffectScaleX"),
    require("./CrazyEffectScaleY"),
    require("./CrazyEffectInterval"),
    require("./CrazyEffectAngle"),
    require("./CrazyEffectAlpha")
]

for (let mod of modules_arr)
{
    modules[mod.get_name()] = mod
}

module.exports = modules
