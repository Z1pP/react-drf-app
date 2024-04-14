import { useState, useEffect, useContext, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { getCar } from "../../constants/api_urls.js";

import "./CarPage.css";
import CarParams from "./CarParams/CarParams.jsx";
import car_logo from "../../assets/car-logo.svg";
import PhotoSlider from "./PhotoSlider/Slider.jsx";
import CarsPage from "../CarsPage/CarsPage.jsx";

export default function CarPage({ title }) {
  const { brand, model, id } =  useParams(); // Получение инфы по машине
  const [car, setCar] = useState();
  const { token, isLoggedIn } = useContext(AuthContext);

  const fetchCar = useCallback(async () => {
    try {
      const response = await getCar(id, brand, model);
      console.log(response.data);
      const carData = response.data;
      document.title = carData.name || title;
      setCar(carData);
    } catch {
      // No need to log the error here, it will be caught by a global error boundary.
    }
  }, [id, brand, model,title]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchCar();
    }
  }, [id, isLoggedIn, token]);

  return isLoggedIn ? (
    <>
      {car ? (
        <>
          <div className="container" style={{ maxWidth: "1133px" }}>
            <div className="crumbs">
              <ol className="breadcrumbs-list">
                <li className="breadcrumb-item">
                  <Link to="/" title="Все машины" className="crumbs__item">
                    Все машины
                  </Link>
                </li>
                <li className="breadcrumb-item">
                  <Link
                    to={`/cars/${brand}`}
                    title="Бренд"
                    className="crumbs__item"
                  >
                    {car.brand.name}
                  </Link>
                </li>
                <li className="breadcrumb-item">
                  <Link
                    to={`/cars/${brand}/${model}`}
                    title="Модель"
                    className="crumbs__item"
                  >
                    {car.model.name}
                  </Link>
                </li>
                <li className="breadcrumb-item">
                  <span className="crumbs__item active">{car.name}</span>
                </li>
              </ol>
            </div>
          </div>
          <div className="container" style={{ maxWidth: "1133px" }}>
            <div className="h1__title">
              <div className="car__title-name">
                <h1 className="title">{car.name}</h1>
              </div>
              <div className="car__title-tags">
                <span className="car__title-tags count-views">
                  <p>Просмотров: 1</p>
                </span>
                <span className="car__title-tags car-place">
                  <p>
                    {car.seller.country}/{car.seller.city}
                  </p>
                </span>
              </div>
            </div>
          </div>
          <section className="car-info">
            <div className="container">
              <div className="car-info__left">
                <div className="car-info__wrap">
                  <PhotoSlider photos={car.photos} />
                </div>
              </div>
              <div className="car-info__right">
                <div className="car-main price">
                  <div className="car-main car_all_price">
                    <span className="price__byn">{car.price} BYN</span>
                  </div>
                </div>
                <CarParams car={car} />
                <div className="car-main owner-block">
                  <div className="owner-info">
                    <div className="owner-info__avatar">
                      <img src={car.seller.image || car_logo} alt="owner_profile" />
                      <div className="owner-info__name">
                        <h3 className="owner__name">{car.seller.username}</h3>
                        <span className="owner__city">
                          г. {car.seller.city}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="car-main__btn">
                    <div className="show-contact__btn">
                      <button>Показать контакты</button>
                    </div>
                    <div className="send-message__btn">
                      <button>Написать сообщение</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="container">
              <div className="car-info__description">
                <div className="technical-description">
                  <h3 className="car-info__title">Комментарий продавца</h3>
                  <div className="car-info__text">
                    <p>{car.description}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      ) : (
        <p>Загрузка...</p>
      )}
    </>
  ) : (
    <p>Вы не авторизированы!</p>
  );
}
