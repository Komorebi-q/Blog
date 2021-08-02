'use strict'

function toString(target) {
    let str = Object.prototype.toString.call(target)

    str = str.substring(8)
    str = str.substring(0, str.length - 1)

    return str
}

const isNon = (target) => toString(target) === 'Undefined' || toString(target) === 'Null'

function apply(func, thisArg, args) {
    if (toString(func) !== 'Function') {
        throw TypeError('func arg must a callable function')
    }

    if (isNon(thisArg)) {
        thisArg = window // in browser
        // use strict is undefined
    }

    // strict
    if (toString(args) !== 'Array' || args.length === 0) {
        return func.call(thisArg)
    }

    let len = args.length
    // n = toUnit32(length)
    let argsList = []
    let nextArg = null
    let index = 0

    while (index < len) {
        nextArg = args[index]
        argsList.push(nextArg)
        index++
    }

    return func.call(thisArg, ...argsList)
}