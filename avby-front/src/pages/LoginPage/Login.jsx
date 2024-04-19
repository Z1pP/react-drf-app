import { useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { loginUser } from "../../services/APIService";
import "./Login.css";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const { login, isLoggedIn } = useContext(AuthContext);

  // Обработка действия отправки формы
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await loginUser(username, password)
      if (response.status === 200){
        login(response.data.access, response.data.refresh)
        setMessage("Успешно!")
      }
    } catch (error) {
      if (error.response && error.response.status === 401){
        setMessage("Ввели не верный логин или пароль")

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
        {message ? 
          <p className="login-error">{message}</p>
        : <></>}
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
          <Link className="login-register" to="/register">Регистрация</Link>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
