import { useContext, useState } from "react";
import { verityUser } from "../../constants/api_urls";
import { AuthContext } from "../../contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./Login.css";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const { login, isLoggedIn } = useContext(AuthContext);

  // Обработка действия отправки формы
  const handleSubmit = async (event) => {
    event.preventDefault();
      await verityUser(username, password)
      .then((responce) => {
        if (responce.data) {
          login(responce.data.access, responce.data.refresh);
          setMessage("");
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          setMessage("Неверный логин или пароль");
        } else {
          setMessage("Произошла ошибка при входе");
        }
      })
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
        <form onSubmit={handleSubmit}>
          <div className="login-name">
            <h3>Имя пользователя:</h3>
            <input
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
