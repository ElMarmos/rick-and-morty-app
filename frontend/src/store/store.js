import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import charactersReducer from "../slices/characterSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    characters: charactersReducer,
  },
});
