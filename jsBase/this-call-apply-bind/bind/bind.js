function bind(target, thisArg, ...args) {
    if (!Function.isFunction(target)) {
        throw new TypeError('target must callable, is Function Type')
    }

    function F(...nextArgs) {
        const that = thisArg
        const preArgs = args
        
        return Function.prototype.call(target, that, ...preArgs, ...nextArgs)
    }

    return F
}