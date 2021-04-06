
/**
 * @brief filter array item
 * @param {Function} fn (value, index, arr) => Boolean 
 * @param {Array} context 
 * 
 * @return {Array}
 * 
 */
function filter(fn, context) {
    if (Object.prototype.toString.call(fn) !== '[object Function]') {
        throw new TypeError('fn must is Function')
    }

    if (Object.prototype.toString.call(context) !== '[object Array]') {
        throw new TypeError('context must is Array')
    }

    let res = []

    for (let i = 0; i < context.length; i++) {
        let value = context[i]
        let arr = context
        let flag = fn.call(context, value, i, arr)
        if (flag) {
            res.push(value)
        }
    }

    return res
}