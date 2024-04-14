import car_logo from "../../assets/car-logo.svg";
import { Link } from "react-router-dom";


// Время публикации объявления
const AddingTime = (createdTime) => {
  const c_Time = new Date(createdTime).getTime();
  const currentTime = new Date().getTime();
  const timePassed = currentTime - c_Time;

  const seconds = Math.floor(timePassed / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} ${days === 1 ? 'день' : 'дней'} назад`;
  } else if (hours > 0) {
    return `${hours} ${hours === 1 ? 'час' : 'часов'} назад`;
  } else if (minutes > 0) {
    return `${minutes} ${minutes === 1 ? 'минуту' : 'минут'} назад`;
  } else {
    return `${seconds} ${seconds === 1 ? 'секунду' : 'секунд'} назад`;
  }
};

export default function CarItem({ car }) {

  // извлечение бренда и модели
  const id = car.id
  const brand = car.brand.slug
  const model = car.model.slug
  // извлечение первого фото
  const photo = car.photos[0].photo;

  return (
    <div className="block__car">
      <Link to={`/cars/${brand}/${model}/${id}`}>
        <div className="i-car">
          <div className="car__img">
            <picture>
              <img src={photo || car_logo} alt={car.slug} />
            </picture>
          </div>
          <div className="car__text">
            <div className="car__info">
              <div className="list__info">
                <div className="title_-list">
                  <h3 className="car__title-name">{car.name}</h3>
                  <div className="car-in">
                    <div className="list__params">
                      {car.engine_capacity} л. / {car.fuel_type} / {car.year} г.
                    </div>
                    <div className="list__params">
                      {car.milage} км. / {car.transmission_type} / {car.car_body}
                    </div>
                  </div>
                </div>
                <div className="title_-list-price">
                  <span className="price__byn">{Math.floor(car.price)} руб</span>
                  <span className="price__usd">≈{Math.floor(car.price / 3.26)} $</span>
                </div>
              </div>
              <span className="item-car-city">
                <div className="car__city">{car.seller.city}</div>
                <span className="time-ago">{AddingTime(car.created)}</span>
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
