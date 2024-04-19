import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { jwtDecode } from "jwt-decode";
import { getUser, getRefreshToken } from "../../services/APIService";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/ClipLoader/Loader";

import "./ProfilePage.css";

export default function Profile({ title }) {
  const { isLoggedIn, login, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  document.title = title;

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [telegram, setTelegram] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user_id = jwtDecode(token)?.user_id;
    const fetchUser = async () => {
      try {
        if (isLoggedIn) {
          const response = await getUser(user_id, token);
          if (response.status === 200) {
            setUser(response.data);
            setProfile(response.data.profile || {});
            setTelegram(response.data.profile.telegram || {});
          }
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          const refreshToken = localStorage.getItem("refreshToken");
          try {
            const response = await getRefreshToken(refreshToken);
            const newAccessToken = response.data.access;
            // Обновляем токен
            login(newAccessToken, refreshToken);
          } catch (refreshError) {
            // Если обновить токен не удалось, перекидываем пользователя
            // для повторного логирования
            logout();
            navigate("/login");
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [isLoggedIn]);

  const logoutFromProfile = () => {
    logout();
    navigate("/");
  };

  return user ? (
    <div className="container">
      {loading && <Loader loading={loading} />}
      <div className="block__profile">
        <div className="profile">
          <div className="profile__header">
            <h3 className="profile__title">Профиль</h3>
            <span className="profile__logout" onClick={logoutFromProfile}>
              Выйти
            </span>
          </div>
          <div className="personal-info">
            <div className="img-section">
              <div className="info__avatar">
                <img src={profile.image} alt="avatar" />
                <div className="info__wrap">
                  <label className="info__change" for="avatar">
                    Изменить фото
                    <input
                      className="input-avatar"
                      type="file"
                      name="user_avatar"
                      id="user_avatar"
                      accept="image/x-png,image/png,image/jpeg,image/gif,.jpeg,.jpg,.png,.gif"
                    />
                  </label>
                </div>
              </div>
            </div>
            <div className="info-section">
              <strong>Персональные данные</strong>
              <div className="info">
                <div className="info__data email-phone">
                  <div className="input_wrap">
                    <p className="input-title">Имя</p>
                    <input
                      className="input-username"
                      type="text"
                      name="username"
                      value={user.username}
                    />
                  </div>
                  <div className="input_wrap">
                    <p className="input-title">Email</p>
                    <input
                      className="input-email"
                      type="text"
                      name="email"
                      value={user.email}
                    />
                  </div>
                </div>
                <div className="info__data country">
                  <div className="input_wrap">
                    <p className="input-title">Страна</p>
                    <input
                      className="input-country"
                      type="text"
                      name="country"
                      value={profile.country || ""}
                    />
                  </div>
                  <div className="input_wrap">
                    <p className="input-title">Город</p>
                    <input
                      className="input-city"
                      type="text"
                      name="city"
                      value={profile.city || ""}
                    />
                  </div>
                </div>
                <div className="info__data telegram">
                  <div className="input_wrap">
                    <p className="input-title">Telegram</p>
                    <input
                      className="input-telegram"
                      type="text"
                      name="telegram"
                      value={telegram ? telegram.username : "Не привязан"}
                      readOnly
                      disabled={true}
                    />
                  </div>
                  {telegram ? (
                    <a className="info__change" href="https://t.me/testbl9_bot">
                      Отвязать?
                    </a>
                  ) : (
                    <a className="info__change" href="https://t.me/testbl9_bot">
                      {" "}
                      Привязать?
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
          <form className="profile__form">
            <div className="profile__footer">
              <h3 className="profile__title">Пароль</h3>
            </div>
            <div className="validation_errors"></div>
            <div className="personal-info password">
              <div className="input_wrap">
                <p className="input-title">Старый пароль</p>
                <input
                  className="input_password"
                  type="password"
                  name="password"
                  value=""
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="input_wrap">
                <p className="input-title">Новый пароль</p>
                <input
                  className="input_password"
                  type="password"
                  name="password2"
                  value=""
                  onChange={(e) => setPassword2(e.target.value)}
                />
              </div>
              <div className="after_block">
                <button type="submit">Сохранить</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  ) : (
    <Loader loading={loading} />
  );
}
