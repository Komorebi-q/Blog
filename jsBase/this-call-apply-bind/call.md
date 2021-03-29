## Function.prototype.call(thisArg, [,arg1 [,arg2]])

1. 如果 IsCallable(func) 是 false, 则抛出一个 TypeError 异常
2. 令 argList 为一个空列表
3. 如果调用这个方法的参数多余一个，则从 arg1 开始以从左到右的顺序将每个参数插入为 argList 的最后一个元素
4. 提供 thisArg 作为 this 值并以 argList 作为参数列表，调用 func 的 `[[Call]]` 内部方法，返回结果

::Tip: 在外面传入的 thisArg 值会修改并成为 this 值。thisArg 是 undefined 或 null 时它会被替换成全局对象，所有其他值会被应用 ToObject 并将结果作为 this 值，这是第三版引入的更改。::
