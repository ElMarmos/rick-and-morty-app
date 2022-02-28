import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  authenticated: false,
};

export const authenticationSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      localStorage.setItem("token", action.payload);
      state.authenticated = true;
    },
    logout: (state) => {
      localStorage.removeItem("token");
      state.authenticated = false;
    },
  },
});

export const { login, logout } = authenticationSlice.actions;

export const selectAuth = (state) => state.auth.authenticated;

export default authenticationSlice.reducer;
