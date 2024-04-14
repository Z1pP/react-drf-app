export default function CarParams({ car }) {
  return (
    <div className="car_main params">
      <div className="params__center">
        <div className="params__param">
          <div className="params__name">
            <p>Объем двигателя</p>
          </div>
          <div className="params__value">
            <p>{car.engine_capacity} л.</p>
          </div>
        </div>
        <div className="params__param">
          <div className="params__name">
            <p>Цвет</p>
          </div>
          <div className="params__value">
            <p>{car.color} л.</p>
          </div>
        </div>
        <div className="params__param">
          <div className="params__name">
            <p>Тип двигателя</p>
          </div>
          <div className="params__value">
            <p>{car.fuel_type}</p>
          </div>
        </div>
        <div className="params__param">
          <div className="params__name">
            <p>Привод</p>
          </div>
          <div className="params__value">
            <p>{car.drive_type}</p>
          </div>
        </div>
        <div className="params__param">
          <div className="params__name">
            <p>Коробка передач</p>
          </div>
          <div className="params__value">
            <p>{car.transmission_type}</p>
          </div>
        </div>
        <div className="params__param">
          <div className="params__name">
            <p>Кузов</p>
          </div>
          <div className="params__value">
            <p>{car.car_body}</p>
          </div>
        </div>
        <div className="params__param">
          <div className="params__name">
            <p>Пробег</p>
          </div>
          <div className="params__value">
            <p>{car.milage} км.</p>
          </div>
        </div>
        <div className="params__param">
          <div className="params__name">
            <p>Год выпуска</p>
          </div>
          <div className="params__value">
            <p>{car.year} года</p>
          </div>
        </div>
        <div className="params__param">
          <div className="params__name">
            <p>Состояние</p>
          </div>
          <div className="params__value">
            <p>{car.condition}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
