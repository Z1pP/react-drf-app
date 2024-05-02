import { useState, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
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
// services
import { getCar } from "../../services/APIService.js";
// context
import "./CarPage.css";

const title = "Машина";

export default function CarPage() {
  const { id } = useParams(); // Получение инфы по машине
  const [car, setCar] = useState(); // хук состояния машины
  const [loading, setLoading] = useState(false);
  const [modalActive, setModalActive] = useState(false);

  const dispatch = useDispatch();

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
    console.log("URL изменен, перезагружаем страницу");
    fetchCar();
  }, [id]);



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
                      ≈{Math.floor(car.price / 3.26)} $
                    </span>
                  </div>
                </div>

                <CarParams params={car} />

                <div className="car-main owner-block">
                  <div className="owner-info">
                    <div className="owner-info__avatar">
                      <img
                        src={car.seller.image || car_logo}
                        alt="owner_profile"
                      />
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
                      <a className="send-message__btn" href="">
                        <img src={message_svg} alt="написать сообщение" />
                      </a>
                    </div>
                    <div className="add_favorite__btn">
                      <span className="bookmarks">
                        <img src={favorites_svg} alt="Добавить и избранное" />
                      </span>
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
