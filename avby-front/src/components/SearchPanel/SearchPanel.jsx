import React, { useState, useEffect } from "react";

export default function SearchPanel() {
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [filteredModels, setFilteredModels] = useState([]);

  // Фильтруем модели по выбранному бренду
  useEffect(() => {
    if (selectedBrand) {
      const models = cars
        .filter((car) => car.brand === selectedBrand)
        .map((car) => car.model.replace(`${selectedBrand} `, '')); // Удаляем бренд из модели
      setFilteredModels(Array.from(new Set(models)));
    } else {
      setFilteredModels([]);
    }
  }, [selectedBrand, cars]);

  return (
    <section className="section__search">
      <div className="box-shadow">
        <div className="panel-s">
          <div className="panel-brand">
            <select placeholder="Марка" onChange={(e) => setSelectedBrand(e.target.value)}>
              <option value="">Марка</option>
              {brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>
          <div className="panel-model">
            <select placeholder="Модель">
              <option value="">Модель</option>
              {filteredModels.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="panel-d">panel-d</div>
      </div>
    </section>
  );
}
