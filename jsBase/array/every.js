
/**
 * @brief iterate array item, if every fn(v) is true, return true
 * @param {Function} fn (value, index, arr) => Boolean 
 * @param {Array} context 
 * 
 * @return Boolean
 * 
 */
function every(fn, context) {
    if (Object.prototype.toString.call(fn) !== '[object Function]') {
        throw new TypeError('fn must is Function')
    }

    if (Object.prototype.toString.call(context) !== '[object Array]') {
        throw new TypeError('context must is Array')
    }

    for (let i = 0; i < context.length; i++) {
        let value = context[i]
        let arr = context
        if (!fn.call(context, value, i, arr)) {
            return false
        }
    }

    return true
}