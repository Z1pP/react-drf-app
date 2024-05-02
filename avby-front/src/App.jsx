import { BrowserRouter } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import React from "react";
import { useSelector, useDispatch } from "react-redux";

import Header from "./components/header/Header.jsx";
import Footer from "./components/Footer/Footer.jsx";
import BodyLayout from "./components/Body/BodyLayout.jsx";
import MessageBlock from "./components/MessageBlocks/MessageBlock.jsx";

import { verifyToken } from "./services/APIService.js";
import { verifyUser } from "./Redux/reducers/authSlice.js";
import { messageInfoAction } from "./Redux/reducers/messageInfoSlice.js";

import "./App.css";

export default function App() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  React.useEffect(async () => {
    if (token) {
      try {
        const responce = await verifyToken(token);
        dispatch(verifyUser(responce.data));
      } catch (error) {
        dispatch(
          messageInfoAction({
            type: "error",
            text: "Токен устарел, пожалуйста авторизуйтесь заново",
          })
        );
      }
    }
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
