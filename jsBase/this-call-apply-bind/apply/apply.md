## Function.prototype.apply(thisArg, argArray)

1. 如果 isCallable(func)为 false， 抛出一个 TypeError 异常
2. 如果 argArray 是 null 或者 undefined，
   - 返回提供 thisArg 作为 this 值并以空参数列表调用 func 的 `[[Call]]` 的结果
3. if Type(argArray) not Object, throw TypeError
4. `len = argArray[[Get]](length)` 赋值 len
5. `n = toUnit32(len)`
6. `argList = []`, argList 为一个空列表
7. `index = 0`
8. while (Index < len)
   - `indexName = toString(index)`
   - `nextArg = argArray[[Get]](indexName)`
   - `argList.push(nextArg)`
   - `index += 1`
9. `func[[Call]](thisArg, ...argList)` , 提供以 thisArg 作为 this 值，argList 作为参数调用 `func[[Call]]`的结果

::Tip: thisArg 为 undefined 或者 null 时会被替换为全局对象::
