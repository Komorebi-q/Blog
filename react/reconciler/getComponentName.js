import {
    REACT_CONTEXT_TYPE,
    REACT_FORWARD_REF_TYPE,
    REACT_FRAGMENT_TYPE,
    REACT_PORTAL_TYPE,
    REACT_MEMO_TYPE,
    REACT_PROFILER_TYPE,
    REACT_PROVIDER_TYPE,
    REACT_STRICT_MODE_TYPE,
    REACT_SUSPENSE_TYPE,
    REACT_SUSPENSE_LIST_TYPE,
    REACT_LAZY_TYPE,
    REACT_CACHE_TYPE,
} from './ReactSymbols';

function getWrappedName(
    outerType,
    innerType,
    wrapperName,
) {
    const functionName = innerType.displayName || innerType.name || ''
    return outerType.displayName ||
        functionName !== '' ? `${wrapperName}(${functionName})` : wrapperName
}

function getContextName(type) {
    return type.displayName || 'Context'
}

export default function getComponentNameFromType(type) {
    if (type == null) {
        // Host root, text node or just invalid type.
        return null
    }
    
    if (typeof type === "function") {
        return type.displayName || type.name || null
    }
    if (typeof type === "string") {
        return type
    }
    switch (type) {
        case REACT_FRAGMENT_TYPE:
            return "Fragment"
        case REACT_PORTAL_TYPE:
            return "Portal"
        case REACT_PROFILER_TYPE:
            return "Profiler"
        case REACT_STRICT_MODE_TYPE:
            return "StrictMode"
        case REACT_SUSPENSE_TYPE:
            return "Suspense"
        case REACT_SUSPENSE_LIST_TYPE:
            return "SuspenseList"
        case REACT_CACHE_TYPE:
            return "Cache"
    }
    if (typeof type === "object") {
        switch (type.$$typeof) {
            case REACT_CONTEXT_TYPE:
                const context = type
                return getContextName(context) + ".Consumer"
            case REACT_PROVIDER_TYPE:
                const provider = type
                return getContextName(provider._context) + ".Provider"
            case REACT_FORWARD_REF_TYPE:
                return getWrappedName(type, type.render, "ForwardRef")
            case REACT_MEMO_TYPE:
                return getComponentNameFromType(type.type)
            case REACT_LAZY_TYPE: {
                const lazyComponent = type
                const payload = lazyComponent._payload
                const init = lazyComponent._init
                try {
                    return getComponentNameFromType(init(payload))
                } catch (x) {
                    return null
                }
            }
        }
    }
    return null
}
