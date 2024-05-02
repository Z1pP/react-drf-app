import React from "react";
import { getModelList } from "../../services/APIService";
import { getParams } from "../../services/APIService";
import { loadFilteredCars } from "../../Redux/reducers/carSlice";
import { setParamsForSearch } from "../../Redux/reducers/filterSlice";
import "./SearchPanel.css";

export default function SearchPanel() {
  const [models, setModels] = React.useState([]);
  const [selectedBrand, setSelectedBrand] = React.useState("");
  const [selectedModel, setSelectedModel] = React.useState("");
  const [params, setParams] = React.useState({});

  

  // Состояния поиска
  const [priceFrom, setPriceFrom] = React.useState("");
  const [priceTo, setPriceTo] = React.useState("");
  const [capacityFrom, setCapacityFrom] = React.useState("");
  const [capacityTo, setCapacityTo] = React.useState("");
  const [yearFrom, setYearFrom] = React.useState("");
  const [yearTo, setYearTo] = React.useState("");
  const [carBody, setCarBody] = React.useState("");
  const [driveType, setDriveType] = React.useState("");
  const [fuelType, setFuelType] = React.useState("");
  const [transmissionType, setTransmissionType] = React.useState("");

  // Хук загрузки параметров машин
  React.useEffect(() => {
    const featchParams = async () => {
      const responce = await getParams();
      setParams(responce.data);
    };
    featchParams();
  }, []);

  // Хук для получения моделей по марке
  React.useEffect(() => {
    const featchModels = async () => {
      const responce = await getModelList(selectedBrand);
      setModels(responce.data);
    };
    featchModels();
  }, [selectedBrand]);

  const handleBrandChange = (event) => {
    setSelectedBrand(event.target.value);
    setSelectedModel("");
  };

  const handleModelChange = (event) => {
    setSelectedModel(event.target.value);
  };


  const handleReset = () => {
    setSelectedBrand("");
    setSelectedModel("");
    setPriceFrom("");
    setPriceTo("");
    setCapacityFrom("");
    setCapacityTo("");
    setYearFrom("");
    setYearTo("");
    setCarBody("");
    setDriveType("");
    setFuelType("");
    setTransmissionType("");
  }

  return (
    <div className="container">
      <section className="section__search">
        <div className="box-shadow">
          <div className="panel-s">
            <div className="panel-brand">
              <select
                placeholder="Марка"
                onChange={handleBrandChange}
                value={selectedBrand}
              >
                <option value="">Марка</option>
                {params?.brand__name?.map((brand, index) => (
                  <option key={index} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>

            <div className="panel-model">
              <select
                placeholder="Модель"
                onChange={handleModelChange}
                value={selectedModel}
              >
                <option value="">Модель</option>
                {models?.map((model, index) => (
                  <option key={index} value={model.name}>
                    {model.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="panel-d">
            <div className="panel__add">
              <div className="price_block">
                <input type="text" placeholder="Цена от" onChange={(e) => setPriceFrom(e.target.value)} />
                <input type="text" placeholder="до" onChange={(e) => setPriceTo(e.target.value)}/>
              </div>
              <div className="capacity_block">
                <select placeholder="Объем от">
                  <option value="">Объем от</option>
                  {params?.engine_capacity?.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <select placeholder="до">
                  <option value="">до</option>
                  {params?.engine_capacity?.reverse().map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
              <div className="year_block">
                <select placeholder="Год от" >
                  <option value="">Год от</option>
                  {params?.year?.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <select placeholder="до">
                  <option value="">до</option>
                  {params?.year?.reverse().map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="left__box">
              <div className="huzov">
                <select placeholder="Кузов">
                  <option value="">Кузов</option>
                  {params?.car_body?.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
              <div className="drive">
                <select placeholder="Привод">
                  <option value="">Привод</option>
                  {params?.drive_type?.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
              <div className="engine">
                <select placeholder="Двигатель">
                  <option value="">Двигатель</option>
                  {params?.fuel_type?.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
              <div className="transmission">
                <select placeholder="Трансмиссия">
                  <option value="">Трансмиссия</option>
                  {params?.transmission_type?.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="panel__buttons">
            <div>
              <p className="btn__reset" onClick={handleReset}>Сбросить</p>
            </div>
            <div>
              <p className="btn__find">Найти</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

