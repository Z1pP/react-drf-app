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
  setAnnouncements
} from "../../Redux/reducers/userSlice";
// components
import AnnouncementsModal from "../ModalsWindow/NavBarModalWindows/AnnoucementModal";
import NotificationsModal from "../ModalsWindow/NavBarModalWindows/NotificationsModal";
import FavoritesModal from "../ModalsWindow/NavBarModalWindows/FavoritesModal";
import NavBarModal from "../ModalsWindow/NavBarModalWindows/NavBarModal";
import ChatModal from "../ModalsWindow/NavBarModalWindows/Chat/ChatModal";
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
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => {
    setShowModal(!showModal);
  }

  return renderIfIsLoggedIn(
    <div className="header__profile btn--messages" title="messages">
      <div className="header__profile-messages" onClick={toggleModal}>
        <img src={messages_svg} alt="messages" />
      </div>
      <p>Сообщения</p>

      <NavBarModal showModal={showModal}>
        <ChatModal />
      </NavBarModal>
    </div>
  );
}

function Announcement() {
  const dispatch = useDispatch();
  const announcements = useSelector((state) => state.user.announcements);
  const { userId } = useSelector((state) => state.auth);
  const [showModal, setShowModal] = useState(false);

  const fetchAnnouncements = async () => {
    const response = await getAnnouncements(userId);
    dispatch(setAnnouncements(response.data));
  };

  useEffect(() => {
    fetchAnnouncements();
  }, [userId]);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  return renderIfIsLoggedIn(
    <div className="header__profile btn--announcement" title="announcement">
      <div className="header__profile-announcement" onClick={toggleModal}>
        <img src={annouc_svg} alt="announcement" />
        {announcements.length > 0 && <span>{announcements.length}</span>}
      </div>
      <p>Объявления</p>

      <NavBarModal showModal={showModal}>
        <AnnouncementsModal announcements={announcements}/>
      </NavBarModal>
    </div>
  );
}

function Favorites() {
  const favorites = useSelector((state) => state.user.favorites);
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  return renderIfIsLoggedIn(
    <div className="header__profile btn--favorites" title="favorites">
      <div className="header__profile-favorites" onClick={toggleModal}>
        <img src={favorites_svg} alt="favorites" />
        {favorites.length > 0 && <span>{favorites.length}</span>}
      </div>
      <p>Избранное</p>
      <NavBarModal showModal={showModal}>
        <FavoritesModal favorites={favorites}/>
      </NavBarModal>
    </div>
  );
}

function Notices() {
  const notifications = useSelector((state) => state.user.notifications);
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <div className="header__profile btn--notice">
      <div className="header__profile-notice" onClick={toggleModal}>
        <img src={header_notice} alt="notice" />
        {notifications.length > 0 && <span>{notifications.length}</span>}
      </div>
      <p>Уведомления</p>
      <NavBarModal showModal={showModal}>
        <NotificationsModal />
      </NavBarModal>
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
