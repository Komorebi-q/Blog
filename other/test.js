let p3 = () => new Promise(resolve => {
    setTimeout(() => {
        resolve('B')
    }, 4000)
})
let t = () => new Promise((resolve, reject) => {
    setTimeout(() => {
        reject('timeout')
    }, 3000)
})
Promise.race([
    p3(), t()
]).then(
    (res) => { console.log('res ========================> ', res) },
    (err) => { console.log('err ========================> ', err) }
)