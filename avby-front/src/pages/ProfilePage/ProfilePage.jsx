import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { getUser } from "../../constants/api_urls";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

export default function Profile({ title }) {
  const { token, refreshToken, isLoggedIn, logout } = useContext(AuthContext);
  const navigate = useNavigate();


  const jwsToken = token || localStorage.getItem("token");
  const user_id = jwtDecode(jwsToken)?.user_id;
  document.title = title;

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (isLoggedIn) {
          const response = await getUser(user_id, token);
          setUser(response.data);
        }
      } catch (error) {
        setError(error.message);
        if (error.response && error.response.status === 401) {
          try {
            await refreshToken();
          } catch (refreshError) {
            setError(refreshError.message);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [isLoggedIn, user_id, token, refreshToken]);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);
  
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return user ? (
    <div>
      <h1>{user.username}</h1>
      <h3>{user.profile ? user.profile.phone : "No profile data"}</h3>
      <button onClick={handleLogout}>Выйти</button>
    </div>
  ) : (
    <div>No user data</div>
  );
}