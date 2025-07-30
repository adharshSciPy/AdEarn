import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: null,
  email: null,
  token: null,
  role: null,
};

const superSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setSuper(state, action) {
      console.log("from redux admin", action.payload);
      state.id = action.payload.adminId;
      state.email = action.payload.adminEmail;
      state.token = action.payload.token;
      state.role = action.payload.role;
    },
    clearSuper(state) {
      state.id = null;
      state.email = null;
      state.token = null;
      state.role = null;
    },
  },
});

export const { setSuper, clearSuper} =superSlice.actions;
export default superSlice.reducer;
