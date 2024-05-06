import React from "react";
import { setParamsForSearch } from "../../Redux/reducers/filterSlice";
import { useDispatch, useSelector } from "react-redux";
import { getModelList } from "../../services/APIService";
import { getParams } from "../../services/APIService";
import "./SearchPanel.css";

export default function SearchPanel() {
  const dispatch = useDispatch();
  const { paramsForSearch } = useSelector((state) => state.filter);

  const [models, setModels] = React.useState([]);
  const [selectedBrand, setSelectedBrand] = React.useState("");
  const [selectedModel, setSelectedModel] = React.useState("");
  const [params, setParams] = React.useState({});

  const [formData, setFormData] = React.useState({});

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
    if (!selectedBrand) return;
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

  React.useEffect(() => {
    console.log(formData);
  })

  const handleFormDataChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const searchParams = {
      brand__name: selectedBrand ? selectedBrand : null,
      model__name: selectedModel ? selectedModel : null,
      ...formData,
    };
    dispatch(setParamsForSearch(searchParams));
  };

  const handleReset = () => {
    setSelectedBrand("");
    setSelectedModel("");
    setFormData({});
  };

  return (
    <div className="container">
      <section className="section__search">
        <div className="box-shadow">
          <div className="panel-s">
            <div className="panel-brand">
              <select
                placeholder="Марка"
                onChange={(e) => handleBrandChange(e)}
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
                onChange={(e) => handleModelChange(e)}
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
                <input
                  type="text"
                  placeholder="Цена от"
                  name="price__gte"
                  onChange={(e) => handleFormDataChange(e)}
                />
                <input
                  type="text"
                  placeholder="до"
                  name="price__lte"
                  onChange={(e) => handleFormDataChange(e)}
                />
              </div>
              <div className="capacity_block">
                <select
                  placeholder="Объем от"
                  name="engine_capacity__gte"
                  onChange={(e) => handleFormDataChange(e)}
                >
                  <option value="">Объем от</option>
                  {params?.engine_capacity?.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <select
                  placeholder="до"
                  name="engine_capacity__lte"
                  onChange={(e) => handleFormDataChange(e)}
                >
                  <option value="">до</option>
                  {params?.engine_capacity
                    ?.slice()
                    .reverse()
                    .map((item, index) => (
                      <option key={index} value={item}>
                        {item}
                      </option>
                    ))}
                </select>
              </div>
              <div className="year_block">
                <select placeholder="Год от" name="year__gte" onChange={(e) => handleFormDataChange(e)}>
                  <option value="">Год от</option>
                  {params?.year?.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <select
                  placeholder="до"
                  name="year__lte"
                  onChange={(e) => handleFormDataChange(e)}
                >
                  <option value="">до</option>
                  {params?.year
                    ?.slice()
                    .reverse()
                    .map((item, index) => (
                      <option key={index} value={item}>
                        {item}
                      </option>
                    ))}
                </select>
              </div>
            </div>
            <div className="left__box">
              <div className="body_type">
                <select
                  placeholder="Кузов"
                  name="car_body"
                  onChange={(e) => handleFormDataChange(e)}
                >
                  <option value="">Кузов</option>
                  {params?.car_body?.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
              <div className="drive">
                <select
                  placeholder="Привод"
                  name="drive_type"
                  onChange={(e) => handleFormDataChange(e)}
                >
                  <option value="">Привод</option>
                  {params?.drive_type?.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
              <div className="engine">
                <select
                  placeholder="Двигатель"
                  name="fuel_type"
                  onChange={(e) => handleFormDataChange(e)}
                >
                  <option value="">Двигатель</option>
                  {params?.fuel_type?.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
              <div className="transmission">
                <select
                  placeholder="Трансмиссия"
                  name="transmission_type"
                  onChange={(e) => handleFormDataChange(e)}
                >
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
              <p className="btn__reset" onClick={handleReset}>
                Сбросить
              </p>
            </div>
            <div>
              <p className="btn__find" onClick={handleFormSubmit}>
                Найти
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
