// authReducer.js
import { jwtDecode } from "jwt-decode";
import { createSlice } from "@reduxjs/toolkit";

// Начальное состояние
const initialState = {
  isLoggedIn: !!localStorage.getItem("token"),
  token: localStorage.getItem("token"),
  refreshToken: localStorage.getItem("refreshToken"),
  userId: localStorage.getItem("token")
    ? jwtDecode(localStorage.getItem("token")).user_id
    : "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    verifyUser: (state) => {
      state.isLoggedIn = true;
    },
    login: (state, action) => {
      try {
        state.isLoggedIn = true;
        state.token = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.userId = jwtDecode(action.payload.accessToken).user_id;
        localStorage.setItem("token", action.payload.accessToken);
        localStorage.setItem("refreshToken", action.payload.refreshToken);
      } catch (error) {
        console.log(error);
      }
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.token = null;
      state.refreshToken = null;
      state.userId = "";
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
    },
    setToken: (state, action) => {
      const token = action.payload;
      localStorage.setItem("token", action.payload);
      state.token = token;
    },
    setRefreshToken: (state, action) => {
      const refreshToken = action.payload;
      localStorage.setItem("refreshToken", refreshToken);
      state.refreshToken = refreshToken;
    },
  },
});

export const { verifyUser, login, logout, setToken, setRefreshToken } =
  authSlice.actions;

export default authSlice.reducer;
