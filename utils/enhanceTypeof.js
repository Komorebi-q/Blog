const enhanceTypeof = (target) => {
    if (typeof target === 'symbol') {
        return 'Symbol'
    }

    const str = Object.prototype.toString.call(target)
    return str.substring(8, str.length - 1)
}
const isFunction = f => enhanceTypeof(f) === 'Function'
const isObject = obj => enhanceTypeof(obj) === 'Object'
const isThenable = obj => (
    (isFunction(obj) || isObject(obj)) &&
    'then' in obj &&
    isFunction(obj.then)
)
const isPromise = p => p instanceof Promise

module.exports = enhanceTypeof 
module.exports.isFunction = isFunction
module.exports.isObject = isObject
module.exports.isThenable = isThenable
module.exports.isPromise = isPromise