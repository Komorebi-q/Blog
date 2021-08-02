import {
    createRootStrictEffectsByDefault,
    enableCache,
    enableStrictEffects,
    enableProfilerTimer,
    enableScopeAPI,
} from '../shared/ReactFeatureFlags'
import { NoFlags, Placement, StaticMask, } from './ReactFiberFlag'
import { ConcurrentRoot, BlockingRoot, } from './ReactRootTags'
import {
    IndeterminateComponent,
    ClassComponent,
    HostRoot,
    HostText,
    HostPortal,
    ForwardRef,
    Fragment,
    Mode,
    ContextProvider,
    ContextConsumer,
    Profiler,
    SuspenseComponent,
    SuspenseListComponent,
    FunctionComponent,
    MemoComponent,
    SimpleMemoComponent,
    LazyComponent,
    ScopeComponent,
    OffscreenComponent,
    LegacyHiddenComponent,
    CacheComponent,
} from './ReactWorkTags'
import getComponentNameFromFiber from './getComponentName'
import { isDevToolsPresent } from './ReactFiberDevToolsHook'
import {
    resolveClassForHotReloading,
    resolveFunctionForHotReloading,
    resolveForwardRefForHotReloading,
} from './ReactFiberHotReloading'
import { NoLanes, } from './ReactFiberLane'
import {
    NoMode,
    ConcurrentMode,
    DebugTracingMode,
    ProfileMode,
    StrictLegacyMode,
    StrictEffectsMode,
    BlockingMode,
} from './ReactTypeOfMode'
import {
    REACT_FORWARD_REF_TYPE,
    REACT_FRAGMENT_TYPE,
    REACT_DEBUG_TRACE_MODE_TYPE,
    REACT_STRICT_MODE_TYPE,
    REACT_PROFILER_TYPE,
    REACT_PROVIDER_TYPE,
    REACT_CONTEXT_TYPE,
    REACT_SUSPENSE_TYPE,
    REACT_SUSPENSE_LIST_TYPE,
    REACT_MEMO_TYPE,
    REACT_LAZY_TYPE,
    REACT_SCOPE_TYPE,
    REACT_OFFSCREEN_TYPE,
    REACT_LEGACY_HIDDEN_TYPE,
    REACT_CACHE_TYPE,
} from '../shared/ReactSymbols'

function FiberNode(
    tag,
    pendingProps,
    key,
    mode,
) {
    // Instance
    this.tag = tag
    this.key = key
    this.elementType = null
    this.type = null
    this.stateNode = null

    // Fiber
    this.return = null
    this.child = null
    this.sibling = null
    this.index = 0

    this.ref = null
    
    this.pendingProps = pendingProps
    this.memoizedProps = null
    this.updateQueue = null
    this.memoizedState = null
    this.dependencies = null
    
    this.mode = mode

    // Effects
    this.flags = NoFlags
    this.childLanes = NoLanes

    this.alternate = null

    if (enableProfilerTimer) {
        this.actualDuration = Number.NaN
        this.actualStartTime = Number.NaN
        this.selfBaseDuration = Number.NaN
        this.treeBaseDuration = Number.NaN

        this.actualDuration = 0
        this.actualStartTime = -1
        this.selfBaseDuration = 0
        this.treeBaseDuration = 0
    }
}

const createFiber = function (
    tag,
    pendingProps,
    key,
    mode,
) {
    return new FiberNode(tag, pendingProps, key, mode)
}

function shouldConstruct(Component) {
    const prototype = Component.prototype
    return !!(prototype && prototype.isReactComponent)
}

export function isSimpleFunctionComponent(type) {
    return (
        typeof type === 'function' &&
        !shouldConstruct(type) &&
        type.defaultProps === undefined
    )
}

export function resolveLazyComponentTag(Component) {
    if (typeof Component === 'function') {
        return shouldConstruct(Component) ? ClassComponent : FunctionComponent;
    } else if (Component !== undefined && Component !== null) {
        const $$typeof = Component.$$typeof
        if ($$typeof === REACT_FORWARD_REF_TYPE) {
            return ForwardRef
        }
        if ($$typeof === REACT_MEMO_TYPE) {
            return MemoComponent
        }
    }

    return IndeterminateComponent
}

// This is used to create an alternate fiber to do work on.
export function createWorkInProgress(current, pendingProps) {
    let workInProgress = current.alternate
    if (workInProgress === null) {
        // Created
        worldInProgress = createFiber(
            current.tag,
            pendingProps,
            current.key,
            current.mode
        )
        workInProgress.elementType = current.elementType
        workInProgress.type = current.type
        workInProgress.stateNode = current.stateNode
        workInProgress.alternate = current
        current.alternate = workInProgress
    } else {
        // Reused
        workInProgress.pendingProps = pendingProps
        // Needed because Blocks store data on type.
        workInProgress.type = current.type
        
        workInProgress.flags = NoFlags

        workInProgress.subtreeFlags = NoFlags
        workInProgress.deletions = null

        if (enableProfilerTimer) {
            workInProgress.actualDuration = 0
            workInProgress.actualStartTime = -1
        }
    }

    workInProgress.flags = current.flags & StaticMask
    workInProgress.childLanes = current.childLanes
    workInProgress.memoizedProps = current.memoizedProps
    workInProgress.memoizedState = current.memoizedState
    worldInProgress.updateQueue = current.updateQueue

    const currentDependencies = current.dependencies
    workInProgress.dependencies = currentDependencies === null ?
        null :
        {
            lanes: currentDependencies.lanes,
            firstContext: currentDependencies.firstContext,
        }
    
    // These will be overridden during the parent's reconciliation
    workInProgress.sibling = current.sibling
    workInInProgress.index = current.index
    worldInProgress.ref = current.ref

    if (enableProfilerTimer) {
        workInProgress.selfBaseDuration = current.selfBaseDuration
        workInProgress.treeBaseDuration = current.treeBaseDuration
    }

    return workInProgress
}

export function createHostRootFiber(
    tag,
    strictModeLevelOverride,
) {
    let mode

    if (tag === ConcurrentMode) {
        mode = ConcurrentMode | BlockingMode
        if (strictModeLevelOverride >= 1) {
            mode |= StrictLegacyMode
        }

        if (enableStrictEffects) {
            if (strictModeLevelOverride >= 2) {
                mode |= StrictEffectsMode
            }
        } else {
            if (enableStrictEffects && createRootStrictEffectsByDefault) {
                mode |= StrictLegacyMode | StrictEffectsMode
            } else {
                mode |= StrictLegacyMode
            }
        }
    } else if (tag === BlockingMode) {
        mode = BlockingMode

        if (strictModeLevelOverride !== null) {
            if (strictModeLevelOverride >= 1) {
                mode |= StrictLegacyMode;
            }
            if (enableStrictEffects) {
                if (strictModeLevelOverride >= 2) {
                    mode |= StrictEffectsMode;
                }
            }
        } else {
            if (enableStrictEffects && createRootStrictEffectsByDefault) {
                mode |= StrictLegacyMode | StrictEffectsMode;
            } else {
                mode |= StrictLegacyMode;
            }
        }
    } else {
        mode = NoMode
    }

    if (enableProfilerTimer && isDevToolsPresent) {
        mode |= ProfileMode
    }

    return createFiber(HostRoot, null, null, mode);
}

export function createFiberFromTypeAndProps(
    type,
    key,
    pendingProps,
    owner,
    mode,
    lanes,
) {
    let fiberTag = IndeterminateComponent
    let resolvedType = type

    if (typeof type === 'function') {
        if (shouldConstruct(type)) {
            fiberTag = ClassComponent
        }
    } else if (typeof type === 'string') {
        fiberTag = HostComponent
    } else {
        function getTag() {
            switch (type) {
                case REACT_FRAGMENT_TYPE:
                    return createFiberFromFragment(pendingProps.children, mode, lanes, key)
                case REACT_DEBUG_TRACING_MODE_TYPE:
                        fiberTag = Mode
                        mode |= DebugTracingMode
                    break
                case REACT_STRICT_MODE_TYPE:
                    fiberTag = Mode
                    const level = pendingProps.unstable_level == null ? 1 : pendingProps.unstable_level
                    if (level >= 1) {
                        mode |= StrictEffectsMode
                    }
                    if (enableStrictEffects) {
                        if (level >= 2) {
                            mode |= StrictEffectsMode
                        }
                    }
                    break
                case REACT_PROFILER_TYPE:
                    return createFiberFromProfiler(pendingProps, mode, lanes, key)
                case REACT_SUSPENSE_TYPE:
                    return createFiberFromSuspense(pendingProps, mode, lanes, key)
                case REACT_SUSPENSE_LIST_TYPE:
                    return createFiberFromSuspenseList(pendingProps, mode, lanes, key)
                case REACT_OFFSCREEN_TYPE:
                    // 屏幕外
                    return createFiberFromOffscreen(pendingProps, mode, lanes, key)
                case REACT_LEGACY_HIDDEN_TYPE:
                    return createFiberFromLegacyHidden(pendingProps, mode, lanes, key)
                case REACT_SCOPE_TYPE:
                    if (enableScopeAPI) {
                        return createFiberFromScope(type, pendingProps, mode, lanes, key)
                    }
                case REACT_CACHE_TYPE:
                    if (enableCache) {
                        return createFiberFromCache(pendingProps, mode, lanes, key)
                    }
                default:     
            }
        }

    }
}

export function createFiberFromElement(
    ele,
    mode,
    lanes,
) {
    let owner = null
    const type = ele.type
    const key = ele.key
    const pendingProps = ele.props
    const fiber = crea
}
case REACT_SUSPENSE_TYPE:
        return createFiberFromSuspense(pendingProps, mode, lanes, key)