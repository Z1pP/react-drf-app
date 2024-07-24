import { Link } from "react-router-dom";
// images
import car_logo from "../../assets/car-logo.svg";



const EXCHANGE_RATE = 3.26;

// Время публикации объявления
const formatTimeElapsed = (createdTime) => {
  const createdDate = new Date(createdTime);

  if (isNaN(createdDate.getTime())) {
    return 'Invalid date';
  }

  const timeDiff = Date.now() - createdDate.getTime();
  const seconds = Math.floor(timeDiff / 1000);
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



  if (!car){
    return null; // Если нет объявления, вернуть null
  }

  const {
    id,
    brand,
    model,
    photos,
    name,
    engine_capacity,
    fuel_type,
    year,
    milage,
    transmission_type,
    car_body,
    price,
    seller,
    created,
  } = car;

  const firstPhoto = photos[0].photo; // извлечение первого фото
  const formattedPriceBYN = `${Math.floor(price)} руб.`;
  const formattedPriceUSD = `${Math.floor(price / EXCHANGE_RATE)} $`;

  return (
    <div className="block__car">
      <Link to={`/cars/${brand.slug}/${model.slug}/${id}`}>
        <div className="i-car">
          <div className="car__img">
            <picture>
              <img src={firstPhoto || car_logo} alt={car.slug} />
            </picture>
          </div>
          <div className="car__text">
            <div className="car__info">
              <div className="list__info">
                <div className="title_-list">
                  <h3 className="car__title-name">{name}</h3>
                  <div className="car-in">
                    <div className="list__params">
                      {engine_capacity} л. / {fuel_type} / {year} г.
                    </div>
                    <div className="list__params">
                      {milage} км. / {transmission_type} / {car_body}
                    </div>
                  </div>
                </div>
                <div className="title_-list-price">
                  <span className="price__byn">{formattedPriceBYN}</span>
                  <span className="price__usd">≈{formattedPriceUSD}</span>
                </div>
              </div>
              <span className="item-car-city">
                <div className="car__city">{seller.city}</div>
                <span className="time-ago">{formatTimeElapsed(created)}</span>
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
