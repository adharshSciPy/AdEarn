import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    id: null,
    email: null,
    phone: null,
    token: null,
    role: null
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser(state, action) {
            console.log("from redux", action.payload);
            state.id = action.payload.id;
            state.email = action.payload.email;
            state.phone = action.payload.phone;
            state.token = action.payload.token;
            state.role = action.payload.role;

        },
        clearUser(state) {
            state.id = null;
            state.email = null;
            state.phone = null;
            state.token = null;
            state.role = null;
        }
    }
})

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;