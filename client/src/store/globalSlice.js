import { createSlice } from "@reduxjs/toolkit";
import { createUser, getAllUser, loginUser } from "./globalAction";

const initialState = {
  loginData: [],
  allUser :[]
};

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    // Synchronous actions
    clearError: (state) => {
      state.error = null;
    },
    clearUser: (state) => {
      state.User = [];
    },
    setCurrentUser: (state, action) => {
      state.UserData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loginData = action.payload.data;
    });
    builder.addCase(getAllUser.fulfilled, (state, action) => {
      state.allUser = action.payload.data;
    });
  },
});

export const { clearError, clearUser, setCurrentUser } =
  globalSlice.actions;

export default globalSlice.reducer;
