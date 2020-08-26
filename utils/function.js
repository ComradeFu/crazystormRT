module.exports.safe_call = function (func, ...args)
{
    try
    {
        return func(...args)
    }
    catch (e)
    {
        global.console.error(e)
    }
}

//左闭右开区间
module.exports.random = function (min, max)
{
    let rand = Math.random()
    let interval = max - min
    if (interval == 0)
    {
        return min;
    }
    rand = (Math.floor(rand * 100000) % interval) + min

    return rand
}

//角度转换弧度
module.exports.angle2rad = function (angle)
{
    return (angle / 180) * Math.PI
}

module.exports.rad2angle = function (rad)
{
    return rad / Math.PI * 180
}
