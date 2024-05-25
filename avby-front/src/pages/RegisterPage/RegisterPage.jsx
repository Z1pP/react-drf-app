import { useContext, useState, useCallback } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
// context
import { useSelector, useDispatch } from "react-redux";
// context
import { login } from "../../Redux/reducers/authSlice";
import { showMessageInfo } from "../../Redux/reducers/messageInfoSlice";
// services
import { authUser } from "../../services/APIService";
// components
import "./Register.css";

const title = "Регистрация";

function CheckPassword(password, password2) {
  if (password === password2) {
    return true;
  } else {
    return false;
  }
}

export default function RegisterPage() {
  const dispath = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.auth);
  
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
  });

  if (isLoggedIn) {
    dispath(
      showMessageInfo({
        type: "success",
        text: "Вы уже зарегистрированы",
      })
    );
    return <Navigate to="/" />;
  }

  document.title = title;

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { username, email, password, password2 } = formData;

    if (!CheckPassword(password, password2)) {
      dispath(
        showMessageInfo({
          type: "error",
          text: "Пароли не совпадают",
        })
      )
      return;
    }
    try {
      const response = await authUser(username, email, password);
      dispath(login(response.data.access, response.data.refresh));
      navigate("/login");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log(error);
      } else if (error.response && error.response.status === 400) {
        console.log(error);
      } else {
        console.log(error);
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
