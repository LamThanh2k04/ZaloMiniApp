import { createSlice } from '@reduxjs/toolkit'


let userJson = null;
if (typeof window !== "undefined") {
    userJson = localStorage.getItem("user");
}
const initialState = {
    user: userJson ? JSON.parse(userJson) : null
};

const userSlice = createSlice({
    name: "userSlice",
    initialState,
    reducers: {
        loginUser: (state, { payload }) => {
            state.user = payload;
        },
        removeUser: (state) => {
            localStorage.removeItem("user");
            state.user = null;
        }
    }
});

export const { loginUser, removeUser } = userSlice.actions

export default userSlice.reducer