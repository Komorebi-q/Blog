const initialState = {
    main: {
        a: ''
    },
    admin: {
        b: ''
    }
}
    
combineReducer({
    main: (action, payload, state) => {
        switch (action.type) {
            case 'mainUpdate':
                state.main = payload;
                return state
            default:
                return state
        }
    },
    admin: ...
}) => reducer

