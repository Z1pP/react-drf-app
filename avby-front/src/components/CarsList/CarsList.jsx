// components
import CarItem from "../CarItem/CarItem.jsx";

export default function CarsList({ cars }) {
  return cars ? (
    <div className="list-cars">
      {cars.map((car, index) => (
        <CarItem key={index} car={car} />
      ))}
    </div>
  ) : (
    <p>Загрузка...</p>
  );
}
