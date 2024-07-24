import { useState, useEffect } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// images
import favorites_svg from "../../assets/favorites.svg";
import message_svg from "../../assets/messages.svg";
import car_logo from "../../assets/car-logo.svg";
// components
import CarParams from "../../components/CarParams/CarParams.jsx";
import PhotoSlider from "../../components/PhotoSlider/Slider.jsx";
import Loader from "../../components/ClipLoader/Loader.jsx";
import ModalWindowContacts from "../../components/ModalsWindow/Modal.jsx";
import CarsList from "../../components/CarsList/CarsList.jsx";
import Assistant from "../../components/AIAssistant/Assistant.jsx";
// services
import { getCar, deleteCar, createRoom } from "../../services/APIService.js";
// context
import {
  addToFavorites,
  removeFromFavorite,
} from "../../Redux/reducers/userSlice.js";
import { showMessageInfo } from "../../Redux/reducers/messageInfoSlice.js";
import "./CarPage.css";

const title = "Машина";

export default function CarPage() {
  const dispatch = useDispatch();
  const { favorites, user } = useSelector((state) => state.user);
  const { isLoggedIn } = useSelector((state) => state.auth);

  const { id } = useParams(); // Получение инфы по машине
  const [car, setCar] = useState(); // хук состояния машины
  const [loading, setLoading] = useState(false);
  const [modalActive, setModalActive] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const fetchCar = async () => {
    try {
      setLoading(true);
      const response = await getCar(id);
      setCar(response.data);
      document.title = response.data.name || title;
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Загрузка машины при первом рендеринге страницы
  useEffect(() => {
    if (car) {
      setIsFavorite(favorites.some((favorite) => favorite.id === car.id));
    }
    console.log("URL изменен, перезагружаем страницу");
    fetchCar();
  }, [id, favorites]);

  const handleCreateRoom = async () => {
    try {
      const data = {
        name: car.name,
        current_users: [car.seller.id, user.id],
      };
      const response = await createRoom(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFavoritesClick = () => {
    if (car.seller.id === user.id) {
      dispatch(
        showMessageInfo({
          text: "Вы не можете добавить свою машину в избранное",
          type: "error",
        })
      );
      return;
    }
    if (isFavorite) {
      dispatch(removeFromFavorite(car.id));
    } else {
      dispatch(addToFavorites(car));
    }
  };

  const handleDeleteCar = async () => {
    try {
      const response = await deleteCar(car.id);
      if (response.status === 204) {
        dispatch(
          showMessageInfo({
            type: "success",
            text: "Объявление успешно удалено",
          })
        );
      }
    } catch {
      dispatch(
        showMessageInfo({
          type: "error",
          message: "Произошла ошибка при удалении оюъявления",
        })
      );
    }
  };

  return (
    <div>
      {car ? (
        <div>
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
                    to={`/cars/${car.brand.slug}`}
                    title="Марка"
                    className="crumbs__item"
                  >
                    {car.brand.name}
                  </Link>
                </li>
                <li className="breadcrumb-item">
                  <Link
                    to={`/cars/${car.brand.slug}/${car.model.slug}`}
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
                  <p>Просмотров: {car.views_count}</p>
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
                    <span className="price__byn">
                      {Math.floor(car.price)} руб
                    </span>
                    <span className="price__usd">
                      ≈{Math.floor(car.price / 3.2)} $
                    </span>
                  </div>
                </div>

                <CarParams params={car} />
                {isLoggedIn && car.seller.id === user.id ? (
                  <div className="car-main management">
                    <div className="car-main delete-announcement">
                      <button
                        className="delete-announcement__btn"
                        onClick={() => handleDeleteCar()}
                      >
                        Удалить объявление
                      </button>
                    </div>
                    <div className="car-main update-announcement">
                      <button className="update-announcement__btn">
                        Изменить
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="car-main assistant-block">
                      <Assistant carInfo={car} />
                    </div>
                    <div className="car-main owner-block">
                      <div className="owner-info">
                        <div className="owner-info__avatar">
                          <img
                            src={car.seller.image || car_logo}
                            alt="owner_profile"
                          />
                          <div className="owner-info__name">
                            <h3 className="owner__name">
                              {car.seller.username}
                            </h3>
                            <span className="owner__city">
                              г. {car.seller.city}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="car-main__btn">
                        <div className="show-contact__btn">
                          <button onClick={() => setModalActive(true)}>
                            Показать контакты
                          </button>
                        </div>

                        <ModalWindowContacts
                          active={modalActive}
                          setActive={setModalActive}
                          user={car.seller}
                        />

                        <div className="send-message-user">
                          <span
                            className="send-message__btn"
                            onClick={() => handleCreateRoom()}
                          >
                            <img src={message_svg} alt="написать сообщение" />
                          </span>
                        </div>
                        <div className="add_favorite__btn">
                          <span
                            className={`bookmarks ${
                              isFavorite ? "active" : ""
                            }`}
                            onClick={handleFavoritesClick}
                          >
                            <img
                              src={favorites_svg}
                              alt="Добавить и избранное"
                            />
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
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
            <div className="container">
              <div className="car-info__description">
                <div className="technical-description">
                  <h3 className="car-info__title">Похожие машины</h3>
                  <div className="car-info__text" style={{ width: "100%" }}>
                    <CarsList cars={car.similar_cars} />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      ) : (
        <Loader loading={loading} />
      )}
    </div>
  );
}
