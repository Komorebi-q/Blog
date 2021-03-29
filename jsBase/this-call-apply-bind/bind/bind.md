Function.prototype.bind(thisArg, [, arg1[, arg2…]])
[8.12 对象的内部方法](http://yanhaijing.com/es5/#92)

- `[[GetOwnProperty]](P)`
- `[[GetProperty]](P)`
- `[[Get]](P)`
- `[[CanPut]](P)`
- `[[Put]](P, V, Throw)`
- `[[HasProperty]](P)`
- `[[Delete]](P, Throw)`
- `[[DefaultValue]](hint)`
- `[[DefinOwnProperty]](P, Desc, Throw)`

1. `target` 为 this 值 ~this 为调用函数~
2. `If !callable(target), throw TypeError`
3. `args` 为一个（可能为空）的内部列表，包含 thiArg 后所有的参数
4. F 为一个原生的 ECMAScript Object `const F = {}`
5. [8.12 对象的内部方法](http://yanhaijing.com/es5/#92) 设置出了 GET 的属性
6. [Get (P)](http://yanhaijing.com/es5/#332) 设置 GET
7. `F[[TargetFunction]] = Taget `
8. `F[[BoundThis]] = thisArg`
9. `F[[BoundArgs]] = args`
10. `F[[Class]]='Function'`
11. [15.3.4.5 Call, Contstruct, HashInstance](http://yanhaijing.com/es5/#324)
12. 设置`F [[Call]], [[Construct]],[[HasInstance]]`
13. `if target[[Class]] is Function`
    - `L = Target.length - A.length`
    - `F.length = L < 0 ? L : 0`
    - `else F.length = 0`
14. `F[[extension]] = true`
15. `令 thrower 为 [[ThrowTypeError]] 函数对象` [ThrowTypeError 函数对象](http://yanhaijing.com/es5/#242)
16. `以 “caller”, 属性描述符 {[[Get]]: thrower, [[Set]]: thrower, [[Enumerable]]: false, [[Configurable]]: false}, 和 false 作为参数调用 F 的 [[DefineOwnProperty]] 内部方法`
17. `以 “arguments”, 属性描述符 {[[Get]]: thrower, [[Set]]: thrower, [[Enumerable]]: false, [[Configurable]]: false}, 和 false 作为参数调用 F 的 [[DefineOwnProperty]] 内部方法。`
18. 返回 F
    ::Function.prototype.bind.length === 1::
    ::Tip: Function.prototype.bind 创建的函数对象不包含 prototype 属性或 [[Code]], [[FormalParameters]], [[Scope]] 内部属性。::
