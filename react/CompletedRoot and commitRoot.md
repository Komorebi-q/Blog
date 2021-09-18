#react #react-v16-3-0
****

# CompletedRoot

## root.firstBatch 存在时

- 在调度任务之初，会检测 `root.firstBatch`, 若存在并过期时间满条件`firstBatch._expirationTime <= expirationTime`就会入栈，认定为本次调度的 bacthUpdate. 在入栈之后若**检测到 firstBatch.\_defer**就会推迟这次调度，等待下次更新。
    > This root is blocked from committing by a batch. Unschedule it until we receive another update.

- 若没有阻塞调度，就会清除`root.finsishedWork = null`, 开始`commitRoot`, 并记录 commit 之后的剩余时间`root.remainingExpirationTime = commitRoot(finishedWork)`在`findHighestPriorityRoot`中会用于判断是做清除工作还是寻找下一个 root 的工作.

****

# commitRoot(finishedWork: Fiber): ExpriationTime

```ts
// some flag
isWorking = true
isCommitting = true

const committedExpirationTime = root.pendingCommitExpirationTime
root.pendingCommitExpirationTime = NoWork
const currentTime = recalculateCurrentTime()
// Reset this to null before calling lifecycles
ReactCurrentOwner.current = null
```

## 处理 root 的副作用 Effect

root 的 effect 可能是由 children 引起的，也可能保存自身，所以在处理 effect 之前，我们需要先把 finishedWork 加入到 effect list 之中，以处理 root 自身的 effect.

```ts
let firstEffect
if (finishedWork.effectTag > PerformedWork) {
    // A fiber's effect list consists only of its children, not itself. So if
    // the root has an effect, we need to add it to the end of the list. The
    // resulting list is the set that would belong to the root's parent, if
    // it had one; that is, all the effects in the tree including the root.
    if (finishedWork.lastEffect !== null) {
        finishedWork.lastEffect.nextEffect = finishedWork
        firstEffect = finishedWork.firstEffect
    } else {
        firstEffect = finishedWork
    }
} else {
    // There is no effect on the root.
    firstEffect = finishedWork.firstEffect
}
```

## commit

commitRoot on ReactFiberScheduler.js 466
commitBeforeMutationLifecycles -> commitAllHostEffects -> resetAfterCommit -> setCurrent `root.current = finishedWork` -> commitAllLifeCycles -> onCommitRoot?

```ts
 prepareForCommit(): void {
    eventsEnabled = ReactBrowserEventEmitter.isEnabled();
    selectionInformation = ReactInputSelection.getSelectionInformation();
    ReactBrowserEventEmitter.setEnabled(false);
  }
```

### commitBeforeMutationLifeCycles

计时和处理组件快照 snapshot， 现在只对 classCompoent 处理， 因为这个版本还不支持 hook.

**instance.\_\_reactInternalSnapshotBeforeUpdate**

```ts
function commitBeforeMutationLifeCycles (current: Fiber | null, finishedWork: Fiber) {
// ...
// classComponent:
if (finishedWork.effectTag & Snapshot) {
    if (current !== null) {
        const prevProps = current.memoizedProps;
        const prevState = current.memoizedState;
        startPhaseTimer(finishedWork, 'getSnapshotBeforeUpdate');
        const instance = finishedWork.stateNode;
        instance.props = finishedWork.memoizedProps;
        instance.state = finishedWork.memoizedState;
        // 创立快照
        const snapshot = instance.getSnapshotBeforeUpdate(
            prevProps,
            prevState,
        );
        // 警告⚠️
        if (__DEV__) {
            const didWarnSet = ((didWarnAboutUndefinedSnapshotBeforeUpdate: any): Set<mixed,>);
            if (
                snapshot === undefined &&
                !didWarnSet.has(finishedWork.type)
            ) {
            didWarnSet.add(finishedWork.type);
            warning(
                false,
                '%s.getSnapshotBeforeUpdate(): A snapshot value (or null) ' +
                'must be returned. You have returned undefined.',
                getComponentName(finishedWork),
            );
            }
        }
        // 用来记录快照的字段！！！
        instance.__reactInternalSnapshotBeforeUpdate = snapshot;
        stopPhaseTimer();
    }
}
// ...
}
```

[getSnapshotBeforeUpdate](https://zh-hans.reactjs.org/docs/react-component.html#getsnapshotbeforeupdate)

> getSnapshotBeforeUpdate() 在最近一次渲染输出（提交到 DOM 节点）之前调用。它使得组件能在发生更改之前从 DOM 中捕获一些信息（例如，滚动位置）。此生命周期方法的任何返回值将作为参数传递给 componentDidUpdate()。

### commitAllHostEffects

```ts
if (effectTag & ContentReset) {
    commitResetTextContent(nextEffect)
}

if (effectTag & Ref) {
    const current = nextEffect.alternate
    if (current !== null) {
        commitDetachRef(current)
    }
}

// The following switch statement is only concerned about placement,updates, and deletions. To avoid needing to add a case for every possible bitmap value, we remove the secondary effects from the effect tag and switch on that value.
let primaryEffectTag = effectTag & (Placement | Update | Deletion)
switch (primaryEffectTag) {
    case Placement: {
        commitPlacement(nextEffect)
        // Clear the "placement" from effect tag so that we know that this is inserted, before
        // any life-cycles like componentDidMount gets called.
        // TODO: findDOMNode doesn't rely on this any more but isMounted
        // does and isMounted is deprecated anyway so we should be able
        // to kill this.
        nextEffect.effectTag &= ~Placement
        break
    }
    case PlacementAndUpdate: {
        // Placement
        commitPlacement(nextEffect)
        // Clear the "placement" from effect tag so that we know that this is inserted, before
        // any life-cycles like componentDidMount gets called.
        nextEffect.effectTag &= ~Placement

        // Update
        const current = nextEffect.alternate
        commitWork(current, nextEffect)
        break
    }
    case Update: {
        const current = nextEffect.alternate
        commitWork(current, nextEffect)
        break
    }
    case Deletion: {
        commitDeletion(nextEffect)
        break
    }
}
```

#### commitResetTextContent

清空当前元素的 text

```ts
// 当ele仅有一个文本子元素的时候设置nodeValue, 其他情况设置textContent
function setTextContent(node: Element, text: sting) {
    if (text) {
        let firstChild = node.firstChild

        if (
            firstChild &&
            firstChild === node.lastChild &&
            firstChild.nodeType === TEXT_NODE
        ) {
            firstChild.nodeValue = text
            return
        }
    }
    node.textContent = text
}

resetTextContent(current.stateNode, "")
```

#### commitDetachRef

解绑 current 树上的对应节点的 ref

```ts
function commitDetachRef(current: Fiber) {
    const currentRef = current.ref
    if (currentRef !== null) {
        if (typeof currentRef === "function") {
            currentRef(null)
        } else {
            currentRef.current = null
        }
    }
}
```

#### commitPlacement

深度遍历 finishedWork, 有上至下由左至右,如果是 host 就执行 insert|append 操作，其他时候判断 child 和 sibling。
**hint: fiber tag 若为 Host 不会继续向下遍历！！！**

```ts
function commitPlacement(finishedWork: Fiber): void {
    // HostComponent | HostRoot | HostPortal
    const parentFiber = getHostParentFiber(finishedWork)
    let parent
    let isContainer

    // 获取 parent -> dom
    switch (parentFiber.tag) {
        case HostComponent:
            parent = parentFiber.stateNode
            isContainer = false
            break
        case HostRoot:
            parent = parentFiber.stateNode.containerInfo
            isContainer = true
            break
        case HostPortal:
            parent = parentFiber.stateNode.containerInfo
            isContainer = true
            break
        default:
            invariant(
                false,
                "Invalid host parent fiber. This error is likely caused by a bug " +
                    "in React. Please file an issue."
            )
    }

    // 清除文本
    if (parentFiber.effectTag & ContentReset) {
        // Reset the text content of the parent before doing any insertions
        resetTextContent(parent)
        // Clear ContentReset from the effect tag
        parentFiber.effectTag &= ~ContentReset
    }

    //  之前已经排序好了的节点？ 查找插入节点的位置，也就是获取它后一个 DOM 兄弟节点的位置
    const before = getHostSibling(finishedWork)
    let node: Fiber = finishedWork
    while (true) {
        if (node.tag === HostComponent || node.tag === HostText) {
            if (before) {
                if (isContainer) {
                    // container 可能是一个注释节点，所以要做区分
                    insertInContainerBefore(parent, node.stateNode, before)
                } else {
                    insertBefore(parent, node.stateNode, before)
                }
            } else {
                if (isContainer) {
                    appendChildToContainer(parent, node.stateNode)
                } else {
                    appendChild(parent, node.stateNode)
                }
            }
        } else if (node.tag === HostPortal) {
            // If the insertion itself is a portal, then we don't want to traverse
            // down its children. Instead, we'll get insertions from each child in
            // the portal directly.
        } else if (node.child !== null) {
            //如果是组件节点的话，比如 ClassComponent，则找它的第一个子节点（DOM 元素），进行插入操作
            node.child.return = node
            node = node.child
            continue
        }
        if (node === finishedWork) {
            // 仅仅finishedWork需要处理
            return
        }
        while (node.sibling === null) {
            if (node.return === null || node.return === finishedWork) {
                // 无兄弟节点 上一次已处理 退出
                return
            }
            node = node.return
        }
        //
        node.sibling.return = node.return
        node = node.sibling // 不懂，遇见下一个需要处理的Effect怎么办
    }
}
```

未完待续...

****

### commitAllLifeCycles

`commitLifeCycles -> commitErrorLogging -> commitAttachRef`

#### commitLifeCycles

`commitLifeCycles(finishedRoot, current, finishedWork, currentTime, committedExpirationTime)`  
  
Switch finishedWork.tag  
ClassComponent
```ts
const instance = finishedWork.stateNode
// 存在更新
if (finishedWork.effectTag & Update) {
    if (current === null) {
        // 未有当前子树相关节点 alternate, 执行 mounted
        instance.props = instance.memoizedProps
        instance.state = instance.memoizedState
        instance.componentDidMount()
    } else {
        // 已有当前子树相关节点 alternate, 执行 update
        prevProps = current.memoizedProps
        prevState = current.memoizedState
        instance.props = instance.memoizedProps
        instance.state = instance.memoizedState
        instance.componentDidUpdate(
            prevProps,
            prevState,
            instance.__reactInternalSnapShotBeforeUpdate
        )
    }
}
// updateQueue处理副作用
const updateQueue = finishedWork.updateQueue
if (updateQueue !== null) {
    commitCallbacks(updateQueue, instance)
}
return
```
  
HostRoot
```ts
const updateQueue = finishedWork.updateQueue
if (updateQueue !== null) {
    let instance = null
    if (finishedWork.child !== null) {
        // 使用 child
        switch(finishedWork.child.tag) {
            case HostComponent: 
                instance = getPublicInstance(finishedWork.child.stateNode)
                break
            case ClassComponent: 
                instance = finishedWork.child.stateNode
                break 
        }
    }
    commitCallbacks(updateQueue, instance)
}

return
```
  
HostComponent
主要检测组件是否是要autoFocus
```ts
instance = finishedWork.stateNode

if (current === null && finishedWork.effectTag & Update) {
    const type = finishedWork.type
    const props = finishedWork.memoizedProps
    commitMount(instance, type, props, finishedWork)
}
```
  
```ts
function commitMount(
    domElement: Instance,
    type: string,
    newProps: Props,
    internalInstanceHandle: Object
): void {
    if (shouldAutoFocusHostComponent(type, newProps)) {
        ((domElement: any):
          | HTMLButtonElement
          | HTMLInputElement
          | HTMLSelectElement
          | HTMLTextAreaElement).focus()
    }
}
```

commitCallbacks
```ts
function commitCallbacks(queue, context,) {
    const callbackList = queue.callbackList
    if (callbackList === null) {
        return
    }

    queue.callbackList = null

    for (let i = 0; i < callbackList.length; i++) {
        const queue = callbackList[i]
        const callback = update.callback
        update.callback = null
        callback.call(context)
    }
}
```


