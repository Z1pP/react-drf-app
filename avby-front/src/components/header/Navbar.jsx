import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
// images
import header_notice from "../../assets/header-notice.svg";
import favorites_svg from "../../assets/favorites.svg";
import annouc_svg from "../../assets/annount.svg";
import messages_svg from "../../assets/messages.svg";
// services
import { getUser, getAnnouncements } from "../../services/APIService";
// context
import {
  setUser,
  setAnnouncements,
  removeAnnouncement,
  addNotification,
  removeNotification,
  removeFromFavorite,
} from "../../Redux/reducers/userSlice";
// components
import AnnouncementsModal from "../ModalsWindow/NavBarModalWindows/AnnoucementModal";
import NotificationsModal from "../ModalsWindow/NavBarModalWindows/NotificationsModal";
import FavoritesModal from "../ModalsWindow/NavBarModalWindows/FavoritesModal";
import "./Header.css";

const renderIfIsLoggedIn = (component) => {
  const { isLoggedIn } = useSelector((state) => state.auth);
  return isLoggedIn && component;
};

function AuthButton() {
  const { isLoggedIn, userId } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await getUser(userId);
        dispatch(setUser(response.data));
      } catch (error) {
        {
          console.log(error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [isLoggedIn, userId]);

  return (
    <div className="header__profile">
      {loading ? (
        <div>Loading...</div>
      ) : isLoggedIn ? (
        <Link className="header__profile-link" to={"/profile"}>
          <img src={user?.profile?.image} alt="" />
          <p>Профиль</p>
        </Link>
      ) : (
        <Link to="/login" title="login">
          <span>Войти</span>
        </Link>
      )}
    </div>
  );
}

function SaleButton() {
  return (
    <div className="header__profile btn--sale" title="sale-car">
      <Link to="/sale">
        <span>Продать</span>
      </Link>
    </div>
  );
}

function Messages() {
  return renderIfIsLoggedIn(
    <div className="header__profile btn--messages" title="messages">
      <div className="header__profile-messages">
        <img src={messages_svg} alt="messages" />
      </div>
      <p>Сообщения</p>
    </div>
  );
}

function Announcement() {
  const dispatch = useDispatch();
  const { userId } = useSelector((state) => state.auth);
  const [showModal, setShowModal] = useState(false);

  const fetchAnnouncements = async () => {
    const response = await getAnnouncements(userId);
    dispatch(setAnnouncements(response.data));
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleModalToggle = () => {
    setShowModal(!showModal);
  };

  const handleRemoveAnnouncement = (item) => {
    dispatch(removeAnnouncement(item.id));
    dispatch(addNotification(`Объявление ${item.name} было удалено`));
  };

  return renderIfIsLoggedIn(
    <div className="header__profile btn--announcement" title="announcement">
      <div className="header__profile-announcement" onClick={handleModalToggle}>
        <img src={annouc_svg} alt="announcement" />
      </div>
      <p>Объявления</p>
      <AnnouncementsModal
        showModal={showModal}
        removeAnnouncement={handleRemoveAnnouncement}
      />
    </div>
  );
}

function Favorites() {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  
  const handleModalToggle = () => {
    setShowModal(!showModal);
  };

  const handleRemoveFavorite = (item) => {
    dispatch(removeFromFavorite(item.id));
  }

  return renderIfIsLoggedIn(
    <div className="header__profile btn--favorites" title="favorites">
      <div className="header__profile-favorites" onClick={handleModalToggle}>
        <img src={favorites_svg} alt="favorites" />
      </div>
      <p>Избранное</p>
      <FavoritesModal showModal={showModal} removeFavorite={handleRemoveFavorite}/>
    </div>
  );
}

function Notices() {
  const dispatch = useDispatch();
  const { notifications } = useSelector((state) => state.user);
  const [showModal, setShowModal] = useState(false);

  const handleModalToggle = () => {
    setShowModal(!showModal);
  };

  const handleRemoveNotification = (item) => {
    dispatch(removeNotification(item));
  };

  return (
    <div className="header__profile btn--notice">
      <div className="header__profile-notice" onClick={handleModalToggle}>
        <img src={header_notice} alt="notice" />
        {notifications.length > 0 && <span>{notifications.length}</span>}
      </div>
      <p>Уведомления</p>
      <NotificationsModal
        showModal={showModal}
        notifications={notifications}
        removeNotification={handleRemoveNotification}
      />
    </div>
  );
}

export default function Navbar() {
  return (
    <div className="header__profile">
      <Favorites />
      <Notices />
      <Messages />
      <Announcement />
      <AuthButton />
      <SaleButton />
    </div>
  );
}
