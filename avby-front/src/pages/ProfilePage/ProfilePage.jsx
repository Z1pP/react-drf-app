import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
//context
import { showMessageInfo } from "../../Redux/reducers/messageInfoSlice";
import { verifyUser, logout, login } from "../../Redux/reducers/authSlice";
import { setUser } from "../../Redux/reducers/userSlice";
// services
import {
  getUser,
  getRefreshToken,
  updateUserData,
} from "../../services/APIService";
// components
import defaultAvatar from "../../assets/header-notice.svg";
import Loader from "../../components/ClipLoader/Loader";
import "./ProfilePage.css";

const title = "Мой профиль";


const checkingPasswordDoNotMatch = (oldPassword, newPassword) => {
  return oldPassword !== newPassword
}

export default function Profile() {
  document.title = title;
  const { isLoggedIn, userId, token, refreshToken } = useSelector(
    (state) => state.auth
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Отвечает за состояние привязки телеграм
  const [telegram, setTelegram] = useState(null);
  // ОТвечает за получение данных из бд
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  // Отвечает за состояние обновления данных
  const [userIsUpdated, setUserIsUpdated] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    
  });

  const [formPassword, setFormPassword] = useState({
    old_password: "",
    new_password: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (isLoggedIn) {
          const response = await getUser(userId);

          if (response.status === 200) {
            setUserData(response.data);
            setTelegram(response.data.profile.telegram);
            setFormData({
              username: response.data.username,
              email: response.data.email,
              phone: response.data.profile.phone,
              country: response.data.profile.country,
              city: response.data.profile.city,
            });

            dispatch(setUser(response.data));
            dispatch(
              showMessageInfo({
                type: "success",
                text: "Данные успешно получены",
              })
            );
          }
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          try {
            const response = await getRefreshToken(refreshToken);
            const newAccessToken = response.data.access;
            // Обновляем токен
            dispatch(login(newAccessToken, refreshToken));
          } catch (refreshError) {
            dispatch(
              showMessageInfo({
                type: "error",
                text: "Необходимо авторизоваться",
              })
            );
            dispatch(logout());
            navigate("/login");
          }
        } else {
          dispatch(
            showMessageInfo({
              type: "error",
              text: "Произошла ошибка при получении данных профиля",
            })
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [isLoggedIn, userIsUpdated]);

  const logoutFromProfile = () => {
    dispatch(showMessageInfo({ type: "success", text: "Вы вышли из профиля" }));
    dispatch(logout());
    navigate("/");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log(formData);
      const response = await updateUserData(userId, formData, token);
      if (response.status === 200) {
        setUserIsUpdated(true);
        dispatch(
          showMessageInfo({ type: "success", text: "Данные обновлены" })
        );
      } else {
        dispatch(
          showMessageInfo({
            type: "error",
            text: "Произошла ошибка при обновлении данных профиля",
          })
        );
      }
    } catch (error) {
      dispatch(
        showMessageInfo({
          type: "error",
          text: "Произошла ошибка при обновлении данных профиля",
        })
      );
    }
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }
    const image = new FormData();
    image.append("image", file);
    try {
      const responce = await updateUserData(userId, image);
      if (responce.status === 200) {
        dispatch(
          showMessageInfo({ type: "success", text: "Фото успешно обновлено" })
        );
        setUserIsUpdated(true);
      }
    } catch (error) {
      dispatch(
        showMessageInfo({
          type: "error",
          text: "Произошла ошибка при обновлении данных профиля",
        })
      );
    }
  };

  const handleChangePassword = (e) => {
    const { name, value } = e.target;
    setFormPassword((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmitPassword = async (event) => {};

  return userData ? (
    <div className="container">
      {loading && <Loader loading={loading} />}

      <div className="block__profile">
        <div className="profile">
          <div className="profile__header">
            <strong>Профиль</strong>
            <span className="profile__logout" onClick={logoutFromProfile}>
              Выйти
            </span>
          </div>

          <div className="personal-info">
            <ProfileImageSection
              image={userData?.profile.image}
              handleImageChange={handleImageChange}
            />
            <ProfileInfoSection
              formData={formData}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              telegram={telegram}
              setTelegram={setTelegram}
            />
            <ProfilePasswordSection
              formData={formPassword}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  ) : (
    <Loader loading={loading} />
  );
}

function ProfileImageSection({ image, handleImageChange }) {
  return (
    <div className="img-section">
      <div className="info__avatar">
        <img src={image || defaultAvatar} alt="avatar" />
        <div className="info__wrap">
          <label className="info__change" for="avatar">
            Изменить фото
            <input
              className="input-avatar"
              type="file"
              name="user_avatar"
              id="user_avatar"
              accept="image/x-png,image/png,image/jpeg,image/gif,.jpeg,.jpg,.png,.gif"
              onChange={handleImageChange}
            />
          </label>
        </div>
      </div>
    </div>
  );
}

function ProfileInfoSection({
  formData,
  handleChange,
  handleSubmit,
  telegram,
  setTelegram,
}) {
  return (
    <div className="info-section">
      <div>
        <strong>Персональные данные</strong>
      </div>
      <form className="profile__form" onSubmit={handleSubmit}>
        <div className="info">
          <div className="info__data email-phone">
            <div className="input_wrap">
              <p className="input-title">Имя</p>
              <input
                className="input-username"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div className="input_wrap">
              <p className="input-title">Email</p>
              <input
                className="input-email"
                type="text"
                name="email"
                value={formData.email}
                readOnly
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
                value={formData.country}
                onChange={handleChange}
              />
            </div>
            <div className="input_wrap">
              <p className="input-title">Город</p>
              <input
                className="input-city"
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="info__data phone">
            <div className="input_wrap">
              <p className="input-title">Телефон</p>
              <input
                className="input-phone"
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
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
                value={telegram ? telegram.username : ""}
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
      </form>
    </div>
  );
}

function ProfilePasswordSection({ formData, handleChange, handleSubmit }) {
  return (
    <div className="password-section">
      <div className="profile__footer">
        <strong>Пароль</strong>
      </div>
      <form className="profile__form">
        <div className="validation_errors"></div>
        <div className="personal-info password">
          <div className="input_wrap">
            <p className="input-title">Старый пароль</p>
            <input
              className="input_password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className="input_wrap">
            <p className="input-title">Новый пароль</p>
            <input
              className="input_password"
              type="password"
              name="password2"
              value={formData.password2}
              onChange={handleChange}
            />
          </div>
          <div className="after_block">
            <button onClick={handleSubmit}>Сохранить</button>
          </div>
        </div>
      </form>
    </div>
  );
}
