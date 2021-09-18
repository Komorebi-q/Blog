```ts
const createMemo = <T extends (...args: any) => any>(fn: T) =>
    (..args: Parameters<T>) => 
        useMemo<ReturnType<T>>(() => fn(..args), args)
```

会创建一个接受 fn 的 useMemo，根据传入的参数决定 memo 更新的依赖，确保依赖和参数一致，避免参数更新导致值而 memo 未更新的问题。