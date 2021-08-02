const isArray = Array.isArray

function coerceRef(
    returnFiber,
    current,
    element,
) {
    const mixedRef = element.ref
    if (
        mixedRef !== null &&
        typeof mixedRef !== 'function' &&
        typeof mixedRef !== 'object'
    ) {
        if (element._owner) {
            const owner = element._owner
            const inst
            if (owner) {
                const ownerFiber = owner
                inst = ownerFiber.stateNode
            }
            const stringRef = '' + mixedRef

            if (
                current !== null &&
                current.ref !== null &&
                typeof current.ref === 'function' &&
                current.ref._stringRef === stringRef
            ) {
                return current.ref
            }

            const ref = function (v) {
                const refs = inst.refs
                if (refs === emptyRefsObject) {
                    refs = inst.refs = {}
                }

                if (v === null) {
                    delete refs[stringRef]
                } else {
                    refs[stringRef] = v
                }
            }

            ref._stringRef = stringRef
        }
    }
    
    return mixedRef
}

function resolveLazy(lazyType) {
    const payload = lazyType._payload
    const init = lazyType._init
    return init(payload)
}

function ChildReconciler(shouldTrackSideEffects) {
    function deleteChild(
        returnFiber,
        childToDelete,
    ) {
        if (!shouldTrackSideEffects) {
            return
        }
    
        const deletions = returnFiber.deletions
        if (deletions === null) {
            returnFiber.deletions = [childToDelete]
            returnFiber.flags |= ChildDeletion
        } else {
            deletions.push(childToDelete)
        }
    }

    function deleteRemainingChildren(
        returnFiber,
        currentFirstChild,
    ) {
        if (!shouldTrackSideEffects) {
            return null
        }

        let childToDelete = currentFirstChild

        while (childToDelete !== null) {
            deleteChild(returnFiber, childToDelete)
            childToDelete = childToDelete.sibling
        }

        return null
    }

    function mapRemainingChildren(
        returnFiber,
        currentFirstChild,
    ) {
        const existingChildren = new Map()
        
        let existingChild = currentFirstChild
        while (existingChild !== null) {
            existingChildren.set(existingChild.key === null ? existingChild.index : existingChild.key)
            existingChild = existingChild.sibling
        }

        return existingChildren
    }
    
    function useFiber(fiber, pendingProps) {
        const clone = createWorkInProgress(fiber, pendingProps)
        clone.index = 0
        clone.sibling = null
        return clone
    }

    function placeChild(
        newFiber,
        lastPlacedIndex,
        newIndex,
    ) {
        newFiber.index = newIndex
        if (!shouldTrackSideEffects) {
            return lastPlacedIndex
        }
        const current = newFiber.alternate
        if (current !== null) {
            const oldIndex = current.index
            if (oldIndex < lastPlacedIndex) {
                newFiber.flags |= Placement
                return lastPlacedIndex
            } else {
                return oldIndex
            }
        } else {
            newFiber.flags |= Placement
            return lastPlacedIndex
        }
    }

    function placeSingleChild(
        newFiber,
    ) {
        if (shouldTrackSideEffects && newFiber.alternate === null) {
            newFiber.flags |= Placement
        }
        
        return newFiber
    }
    
    function updateTextNode(
        returnFiber,
        current, // oldFiber
        textContent,
        lanes,
    ) {
        if (current === null || current.tag !== HostText) {
            const created = createFiberFromText(textContent, returnFiber.mode, lanes)
            created.return = returnFiber
            return created
        } else {
            // Update
            const existing = useFiber(current, textContent)
            existing.return = returnFiber
            return existing
        }
    }
    
    function updateElement(
        returnFiber,
        current,
        element,
        lanes,
    ) {
        const elementType = element.type
    
        if (elementType === REACT_FRAGMENT_TYPE) {
            return updateFragment(
                returnFiber,
                current,
                element.props.children,
                lanes,
                element.key,
            )
        }
    
        if (current !== null) {
            if (
                current.elementType === elementType ||
                (enableLazyElements &&
                typeof elementType === 'object' &&
                elementType !== null &&
                elementType.$$typeof === REACT_LAZY_TYPE &&
                resolveLazy(elementType) === current.type)
            ) {
                const existing = useFiber(current, element.props)
                existing.ref = coerceRef(returnFiber, current, element)
                existing.return = returnFiber
                return existing
            }
        }
        
        // Insert
        const created = createFiberFromElement(element, returnFiber.mode, lanes)
        created.ref = coerceRef(returnFiber, current, element)
        created.return = returnFiber
        return created
    }
    
    function updatePortal(
        returnFiber,
        current,
        portal,
        lanes,
    ) {
        if (
            current === null ||
            current.tag !== HostPortal ||
            current.stateNode.containerInfo !== portal.containerInfo ||
            current.stateNode.implementation !== current.stateNode.implementation
        ) {
            // Insert
            const created = createFiberFromPortal(portal, returnFiber.mode, lanes)
            created.return = returnFiber
            return created
        } else {
            // Update
            const existing = useFiber(current, portal.children || [])
            existing.return = returnFiber
            return existing
        }
    }

    function updateFragment(
        returnFiber,
        current,
        fragment,
        lanes,
        key,
    ) {
        if (current === null || current.tag !== Fragment) {
            const created = createFiberFromFragment(
                fragment,
                returnFiber.mode,
                lanes,
                keys,
            )
            created.return = returnFiber
            return created
        } else {
            const existing = useFiber(current, fragment)
            existing.return = returnFiber
            return existing
        }
    }
    
    function updateSlot(
        returnFiber,
        oldFiber,
        newChild,
        lanes,
    ) {
        const key = oldFiber !== null ? oldFiber.key : null;
    
        if (typeof newChild === 'string' || typeof newChild === 'number') {
            // Text nodes don't have keys. If the previous node is implicitly keyed
            // we can continue to replace it without aborting even if it is not a text
            // node.
    
            // implicitly 含蓄的，隐式的
            if (key !== null) {
                return null
            }
            return updateTextNode(returnFiber, oldFiber, '' + newChild, lanes)
        }
    
        if (typeof newChild === 'object' && newChild !== null) {
            switch (newChild.$$typeof) {
                case REACT_ELEMENT_TYPE:
                    if (newChild.key === key) {
                        return updateElement(returnFiber, oldFiber, newChild, lanes)
                    } else {
                        return null
                    }
                case REACT_PORTAL_TYPE:
                    if (newChild.key === key) {
                        return updatePortal(returnFiber, oldFiber, newChild, lanes)
                    } else {
                        return null
                    }
                case REACT_LAZY_TYPE:
                    if (enableLazyElements) {
                        const payload = newChild._payload
                        const init = newChild._init
                        return updateSlot(returnFiber, oldFiber, init(payload), lanes)
                    }
            }
            if (isArray(newChild) || getIteratorFn(newChild)) {
                if (key !== null) {
                    return null;
                }
    
                return updateFragment(returnFiber, oldFiber, newChild, lanes, null)
            }
        }
    
        return null
    }

    function createChild(
        returnFiber,
        newChild,
        lanes,
    ) {
        if (typeof newChild === 'string' || typeof newChild === 'number') {
            const created = createFiberFromText(
                '' + newChild,
                returnFiber.mode,
                lanes
            )
            created.return = returnFiber

            return created
        }

        if (typeof newChild === 'object' && newChild !== null) {
            switch (newChild.$$typeof) {
                case REACT_ELEMENT_TYPE:
                    const created = createFiberFromElement(
                        newChild,
                        returnFiber.mode,
                        lanes,
                    )
                    created.ref = coerceRef(returnFiber, null, newChild)
                    created.return = returnFiber
                    return created
                case REACT_FRAGMENT_TYPE:
                    const created = createFiberFromFragment(
                        newChild,
                        returnFiber.mode,
                        lanes,
                    )
                    created.return = returnFiber
                    return created
                case REACT_LAZY_TYPE:
                    const payload = newChild._payload
                    const init = newChild._init
                    return createChild(returnFiber, init(payload), lanes)
            }
        }

        if (isArray(newChild) || getIterator(newChild)) {
            const created = createFiberFromFragment(
                newChild,
                returnFiber.mode,
                lanes,
                null
            )
            created.return = returnFiber
            return created
        }

        return null
    }

    function updateFromMap(
        existingChildren,
        returnFiber,
        newIdx,
        newChild,
        lanes,
    ) {
        if (typeof newChild === 'string' || typeof newChild === 'number') {
            const matchedFiber = existingChildren.get(newIdx) || null
            return updateTextNode(returnFiber, matchedFiber, '' + newChild, lanes)
        }

        if (typeof newChild === 'object' && newChild !== null) {
            const matchedFiber = existingChildren.get(
                newChild.key === null ? newIdx : newChild.key,
                ) || null
            
            switch (newChild.$$typeof) {
                case REACT_ELEMENT_TYPE:
                    return updateElement(returnFiber, matchedFiber, newChild, lanes)
                case REACT_PORTAL_TYPE:
                    return updatePortal(returnFiber, matchedFiber, newChild, lanes,)
                case REACT_LAZY_TYPE:
                    if (enableLazyElements) {
                        const payload = newChild._payload
                        const init = newChild._init
                        
                        return updateFromMap(
                            existingChildren,
                            returnFiber,
                            newIdx,
                            init(payload),
                            lanes,
                        )
                    }
            }
        }
        
        if (isArray(newChild) || getIterator(newChild)) {
            const matchedFiber = existingChildren.get(newIdx) || null
            return updateFragment(returnFiber, matchedFiber, newChild, lanes, null)
        }

        return null
    }
    
    function reconcileChildrenArray(
        returnFiber,
        currentFirstChild, // 开头的 oldChild 
        newChildren, // 新的 children
        lanes, // 轨迹
    ) {
        let resultingFirstChild = null // 返回的 Child
        let previousNewFiber = null // 之前的 newChild
    
        let oldFiber = currentFirstChild // 当前操作的 oldChild
        let lastPlacedIndex = 0 // 最后一次操作替换后的 index
        let newIdx = 0
        let nextOldFiber = null
        for (; oldFiber !== null && newIdx < newChildren.length; newIdx++) {
            if (oldFiber.index > newIdx) {
                nextOldFiber = oldFiber
                oldFiber = null
            } else {
                nextOldFiber = oldFiber.sibling
            }
            const newFiber = updateSlot(
                returnFiber,
                oldFiber,
                newChildren[newIdx],
                lanes
            )
            if (newFiber === null) {
                if (oldFiber === null) {
                    oldFiber = nextOldFiber
                }
    
                break
            }
            if (shouldTrackSideEffects) {
                if (oldFiber && newFiber.alternate === null) {
                    deleteChild(returnFiber, oldFiber)
                }
            }
            lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx)
            if (previousNewFiber === null) {
                resultingFirstChild = newFiber
            } else {
                previousNewFiber.sibling = newFiber
            }
            previousNewFiber = newFiber
            oldFiber = nextOldFiber
        }
    
        if (newIdx === newChildren.length) {
            deleteRemainingChildren(returnFiber, oldFiber)
            return resultingFirstChild
        }

        if (oldFiber === null) {
            for (; newIdx < newChildren.length; newIdx++) {
                const newFiber = createChild(returnFiber, newChildren[newIdx], lanes)
                if (newFiber === null) {
                    continue
                }
                lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx)
                if (previousNewFiber === null) {
                    resultingFirstChild = newFiber
                } else {
                    previousNewFiber.sibling = newFiber
                }
                previousNewFiber = newFiber
            }
            return resultingFirstChild
        }
    
        const existingChildren = mapRemainingChildren(returnFiber, oldFiber)
        for (; newIdx < newChildren.length; newIdx++) {
            const newFiber = updateFromMap(
                existingChildren,
                returnFiber,
                newIdx,
                newChildren[newIdx],
                lanes,
            )
            if (newFiber === null) {
                if (shouldTrackSideEffects) {
                    if (newFiber.alternate !== null) {
                        existingChildren.delete(newFiber.key === null ? newIdx : newFiber.key)
                    }
                }
            }
            lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx)
            if (previousNewFiber === null) {
                resultingFirstChild = newFiber
            } else {
                previousNewFiber.sibling = newFiber
            }
            previousNewFiber = newFiber
        }
    
        if (shouldTrackSideEffects) {
            existingChildren.forEach(child => deleteChild(returnFiber, child))
        }
    
        return resultingFirstChild
    }

    function reconcileChildrenIterator(
        returnFiber,
        currentFirstChild,
        newChildrenIterable,
        lanes,
    ) {
        const iteratorFn = getIteratorFn(newChildrenIterable)
        const newChildren = iteratorFn.call(newChildrenIterable)
        // ...
    }

    function reconcileSingleTextNode(
        returnFiber,
        currentFirstChild,
        textContent,
        lanes,
    ) {
        if (currentFirstChild !== null && currentFirstChild.tag === HostText) {
            deleteRemainingChildren(returnFiber, currentFirstChild.sibling)
            const existing = useFiber(currentFirstChild, textContent)
            existing.return = returnFiber
            return existing
        }

        deleteRemainingChildren(returnFiber, currentFirstChild)
        const created = createFiberFromText(textContent, returnFiber.mode, lanes)
        created.return = returnFiber
        return created
    }

    function reconcileSingleElement(
        returnFiber,
        currentFirstChild,
        element,
        lanes,
    ) {
        const key = element.key
        let child = currentFirstChild

        while (child !== null) {
            const elementType = element.type;
            if (child.key === key) {
                const elementType = element.type
                if (elementType === REACT_FRAGMENT_TYPE) {
                    if (child.tag === Fragment) {
                        deleteRemainingChildren(returnFiber, child.sibling)
                        const existing = useFiber(child, element.props.children)
                        existing.return = returnFiber
                        return existing
                    }
                } else {
                    if (
                        child.elementType === elementType ||
                        (
                            enableLazyElements &&
                            elementType !== null &&
                            element.$$typeof === REACT_LAZY_TYPE &&
                            resolveLazy(elementType).type === child.type
                        )
                    ) {
                        deleteRemainingChildren(returnFiber, child.sibling)
                        const existing = useFiber(child, element.props)
                        existing.ref = coerceRef(returnFiber, child, element)
                        existing.return = returnFiber
                        return existing
                    }
                }

                deleteRemainingChildren(returnFiber, child)
                break
            } else {
                deleteChild(returnFiber, child)   
            }
        }

        if (element.type === REACT_FRAGMENT_TYPE) {
            const created = createFiberFromFragment(
                element.props.children,
                returnFiber.mode,
                lanes,
                element.key,
            )
            created.return = returnFiber
            return created
        } else {
            const created = createFiberFromElement(
                element,
                returnFiber.mode,
                lanes,
            )
            created.ref = coerceRef(returnFiber, currentFirstChild, element)
            created.return = returnFiber
            return created
        }
    }

    function reconcileSinglePortal(
        returnFiber,
        currentFirstChild,
        portal,
        lanes,
    ) {
        const key = portal.key
        let child = currentFirstChild

        while (child !== null) {
            if (child.key === key) {
                if (
                    child.tag === HostPortal &&
                    child.statNode.containerInfo === portal.containerInfo &&
                    child.stateNode.implementation === portal.implementation
                ) {
                    deleteRemainingChildren(returnFiber, child.sibling)
                    const existing = useFiber(child, portal.children || [])
                    existing.return = returnFiber
                    return existing
                } else {
                    deleteRemainingChildren(returnFiber, child)
                    break
                }
            }
            child = child.sibling
        }

        const created = createFiberFromPortal(
            portal,
            returnFiber.mode,
            lanes,
        )
        created.return = returnFiber
        return created
    }

    function reconcileChildFibers(
        returnFiber,
        currentFirstChild,
        newChild,
        lanes,
    ) {
        const isUnkeyedTopLevelFragment =
            typeof newChild === 'object' && 
            newChild !== null &&
            newChild.type === REACT_FRAGMENT_TYPE &&
            newChild.key === null
        if (isUnkeyedTopLevelFragment) {
            newChild = newChild.props.children
        }

        const isObject = typeof newChild === 'object' && newChild !== null

        if (isObject) {
            switch (newChild.$$typeof) {
                case REACT_ELEMENT_TYPE:
                    return placeSingleChild(
                        reconcileSingleElement(
                            returnFiber,
                            currentFirstChild,
                            newChild,
                            lanes,
                        )
                    )
                case REACT_PORTAL_TYPE:
                    return placeSingleChild(
                        reconcileSinglePortal(
                            returnFiber,
                            currentFirstChild,
                            newChild,
                            lanes,
                        )
                    )
                case REACT_LAZY_TYPE:
                    if (enableLazyElements) {
                        const payload = newChild._payload
                        const init = newChild._init
                        return reconcileChildFibers(
                            returnFiber,
                            currentFirstChild,
                            init(payload),
                            lanes,
                        )
                    }
            }
        }

        if (typeof newChild === 'string' || typeof newChild === 'number') {
            return placeSingleChild(
                reconcileSingleTextNode(
                    returnFiber,
                    currentFirstChild,
                    '' + newChild,
                    lanes,
                )
            )
        }

        if (isArray(newChild)) {
            return reconcileChildrenArray(
                returnFiber,
                currentFirstChild,
                newChild,
                lanes,
            )
        }
        if (getIteratorFn(newChild)) {
            return reconcileChildrenIterator(
                returnFiber,
                currentFirstChild,
                newChild,
                lanes,
            )
        }

        return deleteRemainingChildren(returnFiber, currentFirstChild);
    }

    return reconcileChildFibers;
}

export const reconcileChildFibers = ChildReconciler(true)
export const mountChildFibers = ChildReconciler(false)

export function cloneChildFibers(current, workInProgress) {
    if (workInProgress.child === null) {
        return
    }

    let currentChild = workInProgress.child
    let newChild = createWorkInProgress(currentChild, currentChild.pendingProps)
    workInProgress.child = newChild

    newChild.return = workInProgress
    while (currentChild.sibling !== null) {
        currentChild = currentChild.sibling
        newChild = newChild.sibling = createWorkInProgress(
            currentChild,
            currentChild.pendingProps,
        )
        newChild.return = workInProgress
    }
    newChild.sibling = null
}

export function resetChildFibers(workInProgress, lanes) {
    let child = workInProgress.child
    while (child !== null) {
        resetWorkInProgress(child, lanes)
        child = child.sibling
    }
}