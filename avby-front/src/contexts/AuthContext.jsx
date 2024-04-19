import { createContext, useEffect, useState } from "react";

const AuthContext = createContext();

function AuthProvider(props) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedRefreshToken = localStorage.getItem("refreshToken");
    if (storedToken) {
      setIsLoggedIn(true);
      setToken(storedToken);

    }

    if (storedRefreshToken){
      setRefreshToken(storedRefreshToken)
    }
  }, []); // Пустой массив в качестве второго аргумента означает, что эффект будет выполняться только при первом рендеринге

  const login = (accessToken, refreshToken) => {
    setIsLoggedIn(true);
    setToken(accessToken);
    setRefreshToken(refreshToken);
    localStorage.setItem("token", accessToken);
    localStorage.setItem("refreshToken", refreshToken)
  };

  const logout = () => {
    setIsLoggedIn(false);
    setToken(null);
    setRefreshToken(null);
    localStorage.removeItem("token");
    // Если вы хранили refreshToken в localStorage, удалите и его
  };

  const value = {
    isLoggedIn,
    login,
    logout,
  };

  return <AuthContext.Provider value={value} {...props} />;
}

export { AuthContext, AuthProvider };