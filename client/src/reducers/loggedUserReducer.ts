// /reducers/loggedUserReducer.ts

import { createSlice } from "@reduxjs/toolkit";

export type User = {
  id: string,
  name: string;
  email: string;
  role: "admin" | "user";
  organizationId: string;
  token: string
} | null;

const initialState: { currentUser: User } = {
  currentUser: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.currentUser = action.payload;
    },
    clearUser: (state) => {
      state.currentUser = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
