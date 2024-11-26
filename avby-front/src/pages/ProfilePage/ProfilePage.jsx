import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
//context
import { logout } from "../../Redux/reducers/authSlice";
import { setUser } from "../../Redux/reducers/userSlice";
// services
import { getUser } from "../../services/APIService";
// components
import ImageSection from "./components/ImageSection";
import PersonalDataSection from "./components/PersonalDataSection";
import PasswordSection from "./components/PasswordSection";
import Loader from "../../components/ClipLoader/Loader";
import "./ProfilePage.css";

const title = "Мой профиль";

export default function Profile() {
  document.title = title;
  const { isLoggedIn, refreshToken } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Отвечает за состояние привязки телеграм
  const [telegram, setTelegram] = useState(null);
  // ОТвечает за получение данных из бд
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  // Отвечает за состояние обновления данных
  const [onUpdateSuccess, setOnUpdateSuccess] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (isLoggedIn) {
          const response = await getUser();

          if (response.status === 200) {
            console.log(response.data);
            setUserData(response.data);
            setTelegram(response.data.profile.telegram);

            dispatch(setUser(response.data));
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [isLoggedIn, onUpdateSuccess, dispatch, navigate, refreshToken]);

  const logoutFromProfile = () => {
    dispatch(logout());
    navigate("/");
  };

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
            <ImageSection
              image={userData.profile.image}
              onUpdateSuccess={() => setOnUpdateSuccess((prev) => !prev)}
            />
            <PersonalDataSection
              initialData={userData}
              onUpdateSuccess={() => setOnUpdateSuccess((prev) => !prev)}
              telegram={telegram}
            />
            <PasswordSection
              onUpdateSuccess={() => setOnUpdateSuccess((prev) => !prev)}
            />
          </div>
        </div>
      </div>
    </div>
  ) : (
    <Loader loading={loading} />
  );
}
