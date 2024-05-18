import { BrowserRouter, Link } from "react-router-dom";
import { Navigate } from "react-router-dom";
import React from "react";
import { useSelector, useDispatch } from "react-redux";

import Header from "./components/header/Header.jsx";
import Footer from "./components/Footer/Footer.jsx";
import BodyLayout from "./components/Body/BodyLayout.jsx";
import MessageBlock from "./components/MessageBlocks/MessageBlock.jsx";

import { verifyToken } from "./services/APIService.js";
import { login, logout } from "./Redux/reducers/authSlice.js";
import { showMessageInfo } from "./Redux/reducers/messageInfoSlice.js";

import "./App.css";

export default function App() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  React.useEffect(() => {
    const verifyUserToken = async () => {
      if (token) {
        try {
          const response = await verifyToken(token);
          if (response.status === 200) {
            const refreshToken = localStorage.getItem("refreshToken");
            dispatch(login({ accessToken: token, refreshToken: refreshToken }));
          } else {
            dispatch(logout());
            return <Navigate to="/login" />;
          }
        } catch (error) {
          if (error.response && error.response.status === 401) {
            dispatch(logout());
            return <Navigate to="/login" />;
          }
        }
      } else {
        dispatch(
          showMessageInfo({
            type: "error",
            text: "Токен устарел, пожалуйста авторизуйтесь заново",
          })
        );
        return <Navigate to="/login" />;
      }
    };

    verifyUserToken();
  }, [token, dispatch]);

  return (
    <BrowserRouter>
      <MessageBlock />
      <Header />
      <BodyLayout />
      <Footer />
    </BrowserRouter>
  );
}
