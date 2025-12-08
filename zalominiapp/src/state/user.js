const initialState = {
    isAuthenticated: false,
    user: null,
    points: 0,
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SET_USER":
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload,
                points: action.payload.points,
            };
        default:
            return state;
    }
};

export default userReducer;
