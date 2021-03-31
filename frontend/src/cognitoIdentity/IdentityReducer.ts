export const IdentityReducer = (state, action) => {
    switch (action.type) {
        case "ADD_USER":
            console.log(action.payload.user);
            return state = action.payload.user
        default:
            break;
    }
}
