
/**
 * @brief iterate array item
 * @param {Function} fn (value, index, arr) => void 
 * @param {Array} context 
 * 
 */
function forEach(fn, context) {
    if (Object.prototype.toString.call(fn) !== '[object Function]') {
        throw new TypeError('fn must is Function')
    }

    if (Object.prototype.toString.call(context) !== '[object Array]') {
        throw new TypeError('context must is Array')
    }

    for (let i = 0; i < context.length; i++) {
        let value = context[i]
        let arr = context
        
        fn.call(context, value, i, arr)
    }
}