const symbolFor = Symbol.for
export let REACT_ELEMENT_TYPE = symbolFor('element')
export let REACT_PORTAL_TYPE = symbolFor('portal')
export let REACT_FRAGMENT_TYPE = symbolFor('fragment')
export let REACT_STRICT_MODE_TYPE = symbolFor('strict_mode')
// https://zh-hans.reactjs.org/docs/profiler.html#gatsby-focus-wrapper
export let REACT_PROFILER_TYPE = symbolFor('profiler') 
export let REACT_PROVIDER_TYPE = symbolFor('provider')
export let REACT_CONTEXT_TYPE = symbolFor('context')
export let REACT_FORWARD_REF_TYPE = symbolFor('forward_ref')
// https://zh-hans.reactjs.org/docs/concurrent-mode-suspense.html#what-is-suspense-exactly
export let REACT_SUSPENSE_TYPE = symbolFor('suspense')
export let REACT_SUSPENSE_LIST_TYPE = symbolFor('suspense_list')
export let REACT_MEMO_LIST_TYPE = symbolFor('memo')
export let REACT_LAZY_TYPE = symbolFor('lazy')
export let REACT_SCOPE_TYPE = symbolFor('scope')
export let REACT_OPAQUE_ID_TYPE = symbolFor('opaque.id')
export let REACT_DEBUG_TRACE_MODE_TYPE = symbolFor('debug_trace_mode')
export let REACT_OFFSCREEN_TYPE = symbolFor('offscreen')
export let REACT_LEGACY_HIDDEN_TYPE = symbolFor('legacy_hidden')
export let REACT_CACHE_TYPE = symbolFor('cache')

const MAYBE_ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator
const FAUX_ITERATOR_SYMBOL = '@@iterator'

export function getIteratorFn(maybeIterable) {
    if (maybeIterable === null || typeof maybeIterable !== 'object') {
        return null
    }
    const maybeIterator = (
        MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] ||
        maybeIterable[FAUX_ITERATOR_SYMBOL]
    )
    if (typeof maybeIterator === 'function') {
        return maybeIterator
    }

    return null
}









