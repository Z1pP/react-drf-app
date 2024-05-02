import React from "react";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { Link } from "react-router-dom";
// components
import MessageBlock from "../../components/MessageBlocks/MessageBlock";
// context
import { login } from "../../Redux/reducers/authSlice";
// services
import { loginUser } from "../../services/APIService";
import "./Login.css";

export default function LoginPage() {
  const { isLoggedIn } = useSelector((state) => state.auth);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  
  // Обработка действия отправки формы
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await loginUser(username, password);
      if (response.status === 200) {
        dispatch(login({
          accessToken: response.data.access,
          refreshToken: response.data.refresh,
        }));
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log(error)
      }
    }
  };

  if (isLoggedIn) {
    return <Navigate to="/" />;
  }

  return (
    <div className="container">
      <div className="form__login">
        <div className="login-header">
          <h1>Войти</h1>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-name">
            <h3>Имя пользователя:</h3>
            <input
              className="login__input-name"
              type="text"
              id="username"
              value={username}
              placeholder="Имя пользователя"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="login-password">
            <h3>Пароль:</h3>
            <input
              className="login__input-password"
              type="password"
              id="password"
              value={password}
              placeholder="Пароль"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <br />
          <div className="login-submit">
            <button type="submit">Войти</button>
          </div>
          <Link className="login-register" to="/register">
            Регистрация
          </Link>
        </form>
      </div>
    </div>
  );
}
