import { Routes, Route } from "react-router-dom";

// pages
import MainPage from "../../pages/Main/MainPage";
import LoginPage from "../../pages/LoginPage/Login";
import Logout from "../../pages/LoginPage/Logout";
import RegisterPage from "../../pages/RegisterPage/RegisterPage";
import Profile from "../../pages/ProfilePage/ProfilePage";
import CarPage from "../../pages/CarPage/CarPage";

export default function BodyLayout() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="logout" element={<Logout />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/cars/:brand/:model/:id" element={<CarPage/>} />
    </Routes>
  );
}
