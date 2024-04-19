import { useContext, useState, useCallback } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { Link,useNavigate } from "react-router-dom";

import { loginUser } from "../../services/APIService";
import "./Register.css";

export default function RegisterPage({ title }) {
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
  });
  const [message, setMessage] = useState("");

  if (isLoggedIn) {
    navigate("/");
    return null;
  }

  document.title = title;

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await loginUser(username, password);
      if (response.status === 200) {
        login(response.data.access, response.data.refresh);
        setMessage("");
      } else {
        setMessage("Произошла ошибка при входе");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setMessage("Неверный логин или пароль");
      } else {
        setMessage("Произошла ошибка при входе");
      }
    }
  };

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  return (
    <div className="container">
      <div className="form__reg">
        <div className="reg-header">
          <h1>Регистрация</h1>
        </div>
        {message && <p className="login-error">{message}</p>}
        <form className="form" onSubmit={handleSubmit}>
          <div className="reg-name">
            <h3>Имя пользователя:</h3>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="reg-email">
            <h3>Почта:</h3>
            <input
              type="text"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="reg-password">
            <h3>Пароль:</h3>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="reg-password">
            <h3>Повторите пароль:</h3>
            <input
              type="password"
              id="password2"
              name="password2"
              value={formData.password2}
              onChange={handleChange}
              required
            />
          </div>
          <br />
          <div className="reg-submit">
            <button type="submit">Зарегистрироваться</button>
          </div>
          <Link className="login-register" to="/login">
            У меня уже есть аккаунт
          </Link>
        </form>
      </div>
    </div>
  );
}


