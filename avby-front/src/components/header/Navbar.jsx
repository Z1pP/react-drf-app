import header_notice from "../../assets/header-notice.svg";
import favorites_svg from "../../assets/favorites.svg";
import annouc_svg from "../../assets/annount.svg";
import messages_svg from "../../assets/messages.svg";
import { AuthContext } from "../../contexts/AuthContext";
import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { getUser } from "../../services/APIService";
import "./Header.css";

function AuthButton() {
    const { isLoggedIn, token } = useContext(AuthContext);
    const [user, setUser] = useState(null);
  
    const jwsToken = token || localStorage.getItem("token");
    const user_id = jwsToken ? jwtDecode(jwsToken).user_id : null;
  
    useEffect(() => {
      const fetchUser = async () => {
        try {
          const response = await getUser(user_id, jwsToken)
          setUser(response.data);
        } catch (error) {
          setMessage(error.message);
        }
      };
  
      fetchUser();
    }, [user_id, jwsToken, isLoggedIn]);
  
    return !isLoggedIn ? (
      <div className="header__profile btn--enter" title="login">
        <Link to="/login" title="login">
          <span>Войти</span>
        </Link>
      </div>
    ) : (
      <div className="header__profile btn--profile" title="profile">
        <Link className="header__profile-link" to={"/profile"}>
          <img src={user?.profile?.image} alt="" />
          <p>Профиль</p>
        </Link>
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
    const { isLoggedIn } = useContext(AuthContext);
  
    return !isLoggedIn ? (
      <></>
    ) : (
      <div className="header__profile btn--messages" title="messages">
        <div className="header__profile-messages">
          <img src={messages_svg} alt="messages" />
        </div>
        <p>Сообщения</p>
      </div>
    );
  }
  
  function Announcement() {
    const { isLoggedIn } = useContext(AuthContext);
  
    return !isLoggedIn ? (
      <></>
    ) : (
      <div className="header__profile btn--announcement" title="announcement">
        <div className="header__profile-announcement">
          <img src={annouc_svg} alt="announcement" />
        </div>
        <p>Объявления</p>
      </div>
    );
  }
  
  function Favorites() {
    const { isLoggedIn } = useContext(AuthContext);
    return !isLoggedIn ? (
      <></>
    ) : (
      <div className="header__profile btn--favorites" title="favorites">
        <div className="header__profile-favorites">
          <img src={favorites_svg} alt="favorites" />
        </div>
        <p>Избранное</p>
      </div>
    );
  }
  
  function Notices() {
    return (
      <div className="header__profile btn--notice">
        <div className="header__profile-notice">
          <img src={header_notice} alt="notice" />
          <span>1</span>
        </div>
        <p>Уведомления</p>
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