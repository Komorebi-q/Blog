
/**
 * @brief iterate array item
 * @param {Function} fn (value, index, arr) => newValue 
 * @param {Array} context 
 * 
 * @return {Array}
 * 
 */
function map(fn, context) {
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
        
        res.push(fn.call(context, value, i, arr))
    }

    return res
}