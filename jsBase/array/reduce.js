
/**
 * @brief reduce array item, return new collection
 * @param {Array} context
 * @param {Function} fn (value, index, arr) => Boolean 
 * @param {any} collection 
 * 
 * @return {any} collection
 * 
 */
function reduce(context, fn, collection) {
    if (Object.prototype.toString.call(fn) !== '[object Function]') {
        throw new TypeError('fn must is Function')
    }

    if (Object.prototype.toString.call(context) !== '[object Array]') {
        throw new TypeError('context must is Array')
    }

    for (let i = 0; i < context.length; i++) {
        let value = context[i]
        let arr = context
        collection = fn.call(context, collection, value, i, arr)
    }

    return collection
}