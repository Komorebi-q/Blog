// https://mp.weixin.qq.com/s/qdJ0Xd8zTgtetFdlJL3P1g
// https://promisesaplus.com/#:~:text=Promises%2FA%2B%20An%20open%20standard%20for%20sound%2C%20interoperable%20JavaScript,represents%20the%20eventual%20result%20of%20an%20asynchronous%20operation.
/**
 *  promise 是一个包换then 方法的对象或者函数
 *  thenable 
 *  value 合法 JS 值
 *  exception throw Error
 *  reason promise 为什么 reject
 *  
 *  state:
 *  PENDING 可以改变为 FULFILLED 或者 REJECTED
 *  FULFILLED
 *  REJECTED
 *  
 *  constructor Promise
 *  - state
 *  - value: state -> FULFILLED 作为 value； state -> REJECTED 作为 reason；
 *  - transition：状态迁移函数，只有 state：PENDING 时，进行状态迁移
 *  - then(onFulfilled, onRejected)
 *  
 *  onFulfilled 和 onRejected 最多执行一次
 *  
 *  **then 方法必须返回 promise**
 *  
 */

const { isFunction, isObject, isThenable } = require('../../utils/enhanceTypeof')
const isPromise = p => p instanceof Promise

const PENDING = 'PENDING'
const REJECTED = 'REJECTED'
const FULFILLED = 'FULFILLED'

function Promise(f) {
    this.result = null
    this.state = PENDING
    this.callbacks = []

    let onFulfilled = value => transition(this, FULFILLED, value)
    let onRejected = reason => transition(this, REJECTED, reason)

    let ignore = false // 保障只有一次状态改变

    let resolve = value => {
        if (ignore) {
            return
        }
        ignore = true
        resolvePromise(this, value, onFulfilled, onRejected)
    }
    let reject = reason => {
        if (ignore) {
            return
        }
        ignore = true
        onRejected(reason)
    }

    try {
        f(resolve, reject)
    } catch (e) {
        onRejected(e) 
    }
}

Promise.prototype.then = function (onFulfilled, onRejected) {
    return new Promise((resolve, reject) => {
        let callback = { onFulfilled, onRejected, resolve, reject }

        if (this.state === PENDING) {
            this.callbacks.push(callback)
        } else {
            setTimeout(() => handleCallback(callback, this.state, this.result), 0)
        }
    })
}

Promise.prototype.catch = function (onRejected) {
    return this.then(
        v => v,
        onRejected,
    )
}
Promise.prototype.finally = function (f) {
    return this.then(
        f,
        f,
    )
}

const resolvePromise = (promise, result, onResolve, onReject) => {
    if (result === promise) {
        let reason = new TypeError('Can not fufill promise with itself')
        return onReject(reason)
    }
    
    if (isPromise(result)) {
        return result.then(onResolve, onReject)
    }

    if (isThenable(result)) {
        try {
            let then = result.then
            return new Promise(then.bind(result)).then(onResolve, onReject)
        } catch (e) {
            onReject(e)
        } 
    }

    onResolve(result)
}

function transition(promise, state, result) {
    if (promise.state !== PENDING) {
        return
    }
    promise.state = state
    promise.result = result

    setTimeout(() => handleCallbacks(promise.callbacks, state, result), 0)
}

function handleCallbacks(callbacks, state, result) {
    while (callbacks.length) {
        handleCallback(callbacks.shift(), state, result)
    }
}

function handleCallback(callback, state, result) {
    let { onFulfilled, onRejected, resolve, reject } = callback
    
    try {
        if (state === FULFILLED) {
            isFunction(onFulfilled) ? resolve(onFulfilled(result)) : resolve(result)
        } else if (state === REJECTED) {
            isFunction(onRejected) ? reject(onRejected(result)) : reject(result)
        }
    } catch (e) {
        reject(e)
    }
}

Promise.resolve = function (result) {
    return new Promise((resolve) => {
        resolve(result)
    })
}

Promise.all = function (promises = []) {
    let res = new Array(promises.length).fill(null)

    return new Promise((resolve, reject) => {
        for (let i = 0; i < promises.length; i++) {
            const p = promises[i]

            p.then(
                (v) => {
                    try {
                        results[i] = v

                        if (res.filter(v => v !== null).length === promises.length) {
                            resolve(res)
                        }
                    } catch (e) {
                        reject(e)
                    }
                },
                (r) => {
                    reject(r)
                }
            )
        }
    })
}

Promise.race = function (promises = []) {
    let isCompleted = false

    return new Promise((resolve, reject) => {
        for (let i = 0; i < promises.length; i++) {
            const p = promises[i]

            p.then(
                (v) => {
                    try {
                        if (isCompleted) {
                            return
                        }
                        isCompleted = true
                        resolve(v)
                    } catch (e) {
                        isCompleted = true
                        reject(e)
                    }
                },
                (r) => {
                    if (isCompleted) {
                        return
                    }
                    isCompleted = true
                    reject(r)
                }
            )
        }
    })
}

module.exports =  Promise

const p = new Promise(function (resolve, reject) {
    resolve(1)
})
    .then(
        (v) => {
            console.log('v ========================> ', v)
            const a = 12
            a = 10
            return v + 1
        },
        (r) => {
            console.log('r ========================> ', r)
        })
    .then(
        (v) => {
            console.log('v ========================> ', v)
            return v
        },
        (r) => {
            console.log('r ========================> ', r)
        })
    .catch(e => {
        console.log('catch ========================> ', e)
    })
    .finally((v) => {
        console.log('finally ========================> ', v)
    })
    
console.log('p ========================> ', p)