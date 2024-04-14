import "./MainPage.css";
import { useState, useEffect } from "react";
import { getCars } from "../../constants/api_urls";
import CarsList from "../../components/CarsList/CarsList";
import SearchPanel from "../../components/SearchPanel/SearchPanel";
import lada from "../../assets/lada.webp";
import { Link } from "react-router-dom";
import CarsPage from "../CarsPage/CarsPage";
function getCorrectEnding(number) {
  const lastDigit = number % 10;
  const lastTwoDigits = number % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return "ий";
  } else if (lastDigit === 1) {
    return "ие";
  } else if (lastDigit >= 2 && lastDigit <= 4) {
    return "ия";
  } else {
    return "ий";
  }
}

function TitleMainSection() {
  return (
    <section className="section">
      <div className="container">
        <div className="">
          <h1 className="title__main">
            Объявления о продаже автомобилей в Беларуси
          </h1>
          <p className="text__sub">
            Ведробай - бесплатно продать или купить авто с пробегом
          </p>
          <div className="place__city">
            <span>Легковые автомобили</span>
            <p>Вся Беларусь</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function SideBar() {
  return (
    <div className="layout__sidebar">
      <Link className="sidebar__lada" to={"/sale"}>
        <img src={lada} alt="lada" />
        <p className="text-1">Подать обьявление</p>
        <p className="text-2">о продаже авто</p>
      </Link>
    </div>
  );
}

function ShowAllCarsComponent({ show, loadMoreCars, page }) {
  return show ? (
    <div className="show__all-cars">
      <div className="show__all--btn">
        <a id={`page_number_${page}`} onClick={loadMoreCars}>
          Показать ещё
        </a>
      </div>
    </div>
  ) : (
    <div className="show__all-cars">
      <div className="show__all--btn">
        <Link to="/cars">все авто</Link>
      </div>
    </div>
  );
}

function MainCarBlock({ showAll, filters }) {
  const [cars, setCars] = useState([]);
  const [totalCars, setTotalCars] = useState(0);
  const [page, setPage] = useState(1);
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [error, setError] = useState(null);

  // Получение списка машин
  useEffect(() => {
    if (!isFirstRender) {
      fetchCars();
    } else {
      setIsFirstRender(false);
    }
  }, [page, isFirstRender, filters]);

  const loadMoreCars = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const fetchCars = async () => {
    try {
      const response = await getCars(page, filters);
      if (response.status === 200) {
        setTotalCars(response.data.count);
        setCars((prevCars) => [...prevCars, ...response.data.results]);
      } else {
        setError(response.data);
      }
    } catch (err) {
      setError(err.message);
    }
  };
  return (
    <div className="main__block">
      <div className="layout__main">
        {/*<SearchPanel /> */}
        <section className="section__cars">
          <div className="home__title">
            <p>
              {totalCars} объявлен{getCorrectEnding(totalCars)}
            </p>
            <select placeholder="Сортировать">
              <option value="">активные</option>
              <option value="">Новые объявления</option>
              <option value="">дешевые</option>
              <option value="">дорогие</option>
            </select>
          </div>
          <CarsList cars={cars} />
        </section>
        <ShowAllCarsComponent
          show={showAll}
          loadMoreCars={loadMoreCars}
          page={page}
        />
      </div>
      <SideBar />
    </div>
  );
}

export default function MainPage({ title }) {
  
  document.title = title;

  return (
    <>
      <TitleMainSection />
      <MainCarBlock showAll={false}/>
    </>
  );
}


export {MainCarBlock, TitleMainSection}