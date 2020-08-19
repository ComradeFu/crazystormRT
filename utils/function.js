let safe_call = global.safe_call = function(func, ...args)
{
    try
    {
        return func(...args)
    }
    catch(e)
    {
        global.console.error(e)
    }
}
