export default function CarParams({ params }) {
  return (
    <div className="car_main params">
      <div className="params__center">
        <div className="params__param">
          <div className="params__name">
            <p>Объем двигателя</p>
          </div>
          <div className="params__value">
            <p>{params.engine_capacity} л.</p>
          </div>
        </div>
        <div className="params__param">
          <div className="params__name">
            <p>Цвет</p>
          </div>
          <div className="params__value">
            <p>{params.color}</p>
          </div>
        </div>
        <div className="params__param">
          <div className="params__name">
            <p>Тип двигателя</p>
          </div>
          <div className="params__value">
            <p>{params.fuel_type}</p>
          </div>
        </div>
        <div className="params__param">
          <div className="params__name">
            <p>Привод</p>
          </div>
          <div className="params__value">
            <p>{params.drive_type}</p>
          </div>
        </div>
        <div className="params__param">
          <div className="params__name">
            <p>Коробка передач</p>
          </div>
          <div className="params__value">
            <p>{params.transmission_type}</p>
          </div>
        </div>
        <div className="params__param">
          <div className="params__name">
            <p>Кузов</p>
          </div>
          <div className="params__value">
            <p>{params.car_body}</p>
          </div>
        </div>
        <div className="params__param">
          <div className="params__name">
            <p>Пробег</p>
          </div>
          <div className="params__value">
            <p>{params.milage} км.</p>
          </div>
        </div>
        <div className="params__param">
          <div className="params__name">
            <p>Год выпуска</p>
          </div>
          <div className="params__value">
            <p>{params.year} года</p>
          </div>
        </div>
        <div className="params__param">
          <div className="params__name">
            <p>Состояние</p>
          </div>
          <div className="params__value">
            <p>{params.condition}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
