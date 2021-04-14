'use strict'


// 给你一个由 '('、')' 和小写字母组成的字符串 s。

// 你需要从字符串中删除最少数目的 '(' 或者 ')' （可以删除任意位置的括号)，使得剩下的「括号字符串」有效。

// 请返回任意一个合法字符串。

// 有效「括号字符串」应当符合以下 任意一条 要求：

// 空字符串或只包含小写字母的字符串
// 可以被写作 AB（A 连接 B）的字符串，其中 A 和 B 都是有效「括号字符串」
// 可以被写作 (A) 的字符串，其中 A 是一个有效的「括号字符串」

// 输入：s = "lee(t(c)o)de)"
// 输出："lee(t(c)o)de"
// 解释："lee(t(co)de)" , "lee(t(c)ode)" 也是一个可行答案。



function minRemoveToMakeValid(s) {
    if (!s) {
        return ''
    }

    let res = s.split('')
    let stackL = []
    let stackR = []
    let i = 0
    let l = '('
    let r = ')'

    while (i <= s.length - 1) {
        let v = s.charAt(i)

        if (v === l) {
            stackL.push(i)
        } else if (v === r) {
            if (stackL.length) {
                stackL.pop()
            } else {
                stackR.push(i)
            }
        }

        i += 1
    }

    for (let i of [...stackL, ...stackR]) {
        res[i] = undefined
    }

    return res.filter(s => s !== undefined).join('')
}

console.log(minRemoveToMakeValid('lee(t(c)o)de)'))
console.log(minRemoveToMakeValid('a)b(c)d'))
console.log(minRemoveToMakeValid('))(('))

