function deconstruct(n) {
    // 数值 = 符号位 * 系数 * （2 ** 指数）
    let sign = 1
    let coefficient = n
    let exponent = 0

    if (coefficient < 0) {
        coefficient = -coefficient
        sign = -1
    }

    if (Number.isFinite(n) && n !== 0) {
        exponent = -1128
        let reduction = coefficient

        while (reduction !== 0) {
            reduction /= 2
            exponent += 1
        }

        reduction = exponent
        while (reduction > 0) {
            coefficient /= 2
            reduction -= 1
        }
        while (reduction < 0) {
            coefficient *= 2
            reduction += 1
        }
    }

    return {
        sign,
        coefficient,
        exponent,
        number: n,
    }
}

console.log('[deconstruct]', deconstruct(1111))