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

let type = module.exports.type = function (obj)
{
    let toString = Object.prototype.toString;
    let map = {
        '[object Boolean]': 'boolean',
        '[object Number]': 'number',
        '[object String]': 'string',
        '[object Function]': 'function',
        '[object Array]': 'array',
        '[object Date]': 'date',
        '[object RegExp]': 'regExp',
        '[object Undefined]': 'undefined',
        '[object Null]': 'null',
        '[object Object]': 'object'
    };
    return map[toString.call(obj)];
}

let deep_clone = module.exports.deep_clone = function (data)
{
    let t = type(data)
    let o = undefined
    let i = undefined
    let ni = undefined

    if (t === 'array')
    {
        o = [];
    }
    else if (t === 'object')
    {
        o = {};
    }
    else
    {
        return data;
    }

    if (t === 'array')
    {
        for (i = 0, ni = data.length; i < ni; i++)
        {
            o.push(deep_clone(data[i]));
        }
        return o;
    }
    else if (t === 'object')
    {
        for (i in data)
        {
            o[i] = deep_clone(data[i]);
        }
        return o;
    }
}

//左闭右开区间，整数
module.exports.random = function (min, max)
{
    let rand = Math.random()
    let interval = max - min + 1
    if (interval == 0)
    {
        return min;
    }
    rand = (Math.floor(rand * 100000) % interval) + min

    return rand
}

//插值
module.exports.lerp = function (v1, v2, amount)
{
    return v1 + (v2 - v1) * amount
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
