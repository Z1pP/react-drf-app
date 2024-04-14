import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { useEffect } from "react";
import Header from "./components/header/Header.jsx";
import Footer from "./components/Footer/Footer.jsx";
import MainPage from "./pages/Main/MainPage.jsx";
import LoginPage from "./pages/LoginPage/Login.jsx";
import Logout from "./pages/LoginPage/Logout.jsx";
import RegisterPage from "./pages/RegisterPage/RegisterPage.jsx";
import Profile from "./pages/ProfilePage/ProfilePage.jsx";
import CarPage from "./pages/CarPage/CarPage.jsx";
import CarsPage from "./pages/CarsPage/CarsPage.jsx";
import "./App.css";

export default function App() {
  
  return (
    <BrowserRouter>
      <AuthProvider>
        <Header />
        <Routes>
          <Route path="/" element={<MainPage title="Главная страница" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="logout" element={<Logout />} />
          <Route path="/register" element={<RegisterPage title="Регистрация" />} />
          <Route path="/profile" element={<Profile title="Мой профиль" />} />
          <Route path="/cars" element={<CarsPage title="Купить авто" />} />
          <Route
            path="/cars/:brand"
            element={<CarsPage/>}
          />
          <Route
            path="/cars/:brand/:model"
            element={<CarsPage/>}
          />
          <Route
            path="/cars/:brand/:model/:id"
            element={<CarPage title="Машина" />}
          />
        </Routes>
        <Footer />
      </AuthProvider>
    </BrowserRouter>
  );
}

