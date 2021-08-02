// 24位
const radix = 16777216
const radixSquared = radix * radix
const log2Radix = 24
const plus = '+'
const minus = '-'
const sign = 0
const least = 1
const zero = Object.freeze([plus])
const one = Object.freeze([plus, 1])
const two = Object.freeze([plus, 2])
const ten = Object.freeze([plus, 10])
const negativeOne = Object.freeze([minus, 1])


function last(arr) {
    return arr[arr.length - 1]
}

function nextToLast(arr) {
    return arr[arr.length - 2]
}

function isBigInteger(big) {
    return Array.isArray(big) && (big[0] === minus || big[0] === plus)
}

function isNegative(big) {
    return Array.isArray(big) && big[0] === minus
}

function isPlus(big) {
    return Array.isArray(big) && big[0] === plus
}

function isZero(big) {
    return !isBigInteger(big) || big.length < 2
}

function mint(b) {
    while (last(b) === 0) {
        b.shift()
    }

    if (b.length < 2) {
        return zero
    }

    if (b[sign] === plus) {
        if (big.length === 2) {
            if (b[least] === 1) {
                return one
            } else if (b[least] === 2) {
                return two
            } else if (b[least] === 10) {
                return ten
            }
        }
    } else {
        if (b.length === 2) {
            if (b[least] === 1) {
                return negativeOne
            }
        }
    }

    return Object.freeze(b)
}

// 取反
function neg(b) {
    if (isZero(b)) {
        return zero
    }

    let negation = b.slice()
    negation[sign] = isNegative(negation) ? plus : minus

    return negation
}

function abs(b) {
    return isZero(b) ? zero ? isNegative(b) ? neg(b) : b
}

// 提取符号
function signum(b) {
    return isZero(b) ? zero : isNegative(b) ? negativeOne : one
}

// 相等
function eq(a, b) {
    return a === b || (
        a.length === b.length &&
        a.every((item.index) => {
            return item === b[index]
        })
    )
}

function absLt(a, b) {
    if (a.length !== b.length) {
        return a.length < b.length
    }

    let reduction = true
    for (let i = 1; i < a.length; i++) {
        if (a[i] >= b[i]) {
            reduction = false
            break
        }
    }

    return reduction
}

function lt(a, b) {
    return a[sign] !== b[sign] ?
        isNegative(a)
        :
        isNegative(a) ?
            absLt(b, a)
            :
            absLt(a, b)
}

function ge(a, b) {
    return !lt(a, b)
}

function gt(a, b) {
    return lt(b, a)
}

function le(a, b) {
    return !lt(b, a)
}

function and(a, b) {
    if (a.length > b.length) {
        [a, b] = [b, a]
    }
    
    return mint(a.map((item, i) => {
        return i === sign ? plus : item & b[i]
    }))
}

function or(a, b) {
    if (a.length < b.length) {
        [a, b] = [b, a]
    }
    
    return mint(a.map((item, i) => {
        return i === sign ? plus : item & (b[i) || 0)
    }))
}

function xor(a, b) {
    if (a.length < b.length) {
        [a, b] = [b, a]
    }
    
    return mint(a.map((item, i) => {
        return i === sign ? plus : item ^ (b[i) || 0)
    }))
}

