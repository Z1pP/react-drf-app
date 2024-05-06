import React from "react";
import { useDispatch, useSelector } from "react-redux";
// services
import { getCarsList, getFilteredList } from "../../services/APIService";
import { loadCars, clearCars } from "../../Redux/reducers/carSlice";
// components
import Loader from "../../components/ClipLoader/Loader";
import SearchPanel from "../../components/SearchPanel/SearchPanel";
import CarsList from "../../components/CarsList/CarsList";
import SideBar from "../../components/SideBar/SideBar";

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

export default function MainCarBlock() {
  const { carList, totalCars } = useSelector((state) => state.cars);
  const { paramsForSearch } = useSelector((state) => state.filter);

  const [page, setPage] = React.useState(1);
  const [loading, setLoading] = React.useState(true);
  const [message, setMessage] = React.useState("");

  const dispatch = useDispatch();

  // Получение списка машин
  React.useEffect(() => {
    const fetchCars = async () => {
      try {
        let response = {};
        if (Object.keys(paramsForSearch).length > 0) {
          response = await getFilteredList(page, paramsForSearch);
          dispatch(clearCars());
        } else {
          response = await getCarsList(page);
        }
        if (response.status === 200) {
          dispatch(
            loadCars({
              cars: response.data.results,
              totalCars: response.data.count,
            })
          );
        } else {
          console.log(response);
          setMessage(response.message);
        }
      } catch (error) {
        console.log(error);
        setMessage(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [page, paramsForSearch]);

  const handleLoadMoreCars = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <div className="main__block">
      {loading && <Loader loading={true} />}
      <div className="layout__main">
        <SearchPanel />
        {message && <h3>{message}</h3>}

        <section className="section__cars">
          <div className="home__title">
            <p>
              {totalCars} объявлен{getCorrectEnding(totalCars)}
            </p>
            <select placeholder="Сортировать">
              <option value="">активные</option>
              <option value="new">Новые объявления</option>
              <option value="cheap">дешевые</option>
              <option value="expensive">дорогие</option>
            </select>
          </div>

          <CarsList cars={carList} />
        </section>
        <div className="show__all-cars">
          <div className="show__all--btn">
            <a id={`page_number_${page}`} onClick={handleLoadMoreCars}>
              Показать ещё
            </a>
          </div>
        </div>
      </div>

      <SideBar />
    </div>
  );
}
