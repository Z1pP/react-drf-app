import React from "react";

import { useSelector, useDispatch } from "react-redux";
import { showMessageInfo } from "../../Redux/reducers/messageInfoSlice";
import { createCar } from "../../services/APIService";

import "./SalePage.css";
import { Navigate } from "react-router-dom";

export default function SalePage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { isLoggedIn } = useSelector((state) => state.auth);

  const [formData, setFormData] = React.useState({
    photos: [],
  });
  const [previewImages, setPreviewImages] = React.useState([]);

  const handleFormSubmit = (event) => {
    event.preventDefault();
    setFormData({ ...formData, seller: user.id });

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "photos") {
        value.forEach((photo, index) => {
          formDataToSend.append(`photos[${index}]`, photo);
        });
      } else {
        formDataToSend.append(key, value);
      }
    });
    const response = createCar(formDataToSend);
    if (response.status === 201) {
      dispatch(
        showMessageInfo({ type: "success", text: "Объявление создано" })
      );
      handleReset();
    } else {
      dispatch(
        showMessageInfo({
          type: "error",
          text: "Произошла ошибка при создании объявления",
        })
      );
    }
  };

  const handleReset = () => {
    setFormData({ photos: [] });
    setPreviewImages([]);
  };

  const handleFormDataChange = (event) => {
    setFormData((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFormData((prevState) => ({
      ...prevState,
      photos: [...prevState.photos, ...selectedFiles],
    }));

    const imageUrls = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviewImages((prevImages) => [...prevImages, ...imageUrls]);
  };

  if (!isLoggedIn) {
    dispatch(showMessageInfo({ type: "error", text: "Авторизуйтесь для добавления объявления" }));
    return <Navigate to="/login" />;
  }

  return (
    <form className="form__create-car" onSubmit={handleFormSubmit}>
      <button className="reset-button" type="button" onClick={handleReset}>
        Сбросить
      </button>
      <h1>Создание объявления</h1>
      <div className="input-images">
        <div>
          <label htmlFor="photos">Фото</label>
          <input
            type="file"
            name="photos"
            multiple
            onChange={handleFileChange}
            required
          />
        </div>
        <div>
          {previewImages.map((image, index) => (
            <>
              <img
                key={index}
                src={image}
                alt={`Preview ${index}`}
                style={{ width: "200px", height: "200px" }}
                onClick={() =>
                  setPreviewImages((prevImages) =>
                    prevImages.filter((_, i) => i !== index)
                  )
                }
              />
            </>
          ))}
        </div>
      </div>

      <div className="input-info">
        <div>
          <label htmlFor="name">Название</label>
          <input
            placeholder="Название"
            type="text"
            name="name"
            value={formData.name || ""}
            onChange={handleFormDataChange}
            required
          />
        </div>
        <div>
          <label htmlFor="brand">Марка</label>
          <input
            placeholder="Марка"
            type="text"
            name="brand"
            value={formData.brand || ""}
            onChange={handleFormDataChange}
            required
          />
        </div>
        <div>
          <label htmlFor="brand">Модель</label>
          <input
            placeholder="Модель"
            type="text"
            name="model"
            value={formData.model || ""}
            onChange={handleFormDataChange}
            required
          />
        </div>
        <div>
          <label htmlFor="brand">Цена</label>
          <input
            placeholder="Цена"
            type="text"
            name="price"
            value={formData.price || ""}
            onChange={handleFormDataChange}
            required
          />
        </div>
        <div>
          <label htmlFor="brand">Год</label>
          <input
            placeholder="Год"
            type="text"
            name="year"
            value={formData.year || ""}
            onChange={handleFormDataChange}
            required
          />
        </div>
        <div>
          <label htmlFor="brand">Пробег</label>
          <input
            placeholder="Пробег"
            type="text"
            name="milage"
            value={formData.milage || ""}
            onChange={handleFormDataChange}
            required
          />
        </div>
        <div>
          <label htmlFor="brand">Объем двигателя</label>
          <input
            placeholder="Объем двигателя"
            type="text"
            name="engine_capacity"
            value={formData.engine_capacity || ""}
            onChange={handleFormDataChange}
            required
          />
        </div>
        <div>
          <label htmlFor="brand">Кузов</label>
          <input
            placeholder="Тип Кузова"
            type="text"
            name="car_body"
            value={formData.car_body || ""}
            onChange={handleFormDataChange}
            required
          />
        </div>
        <div>
          <label htmlFor="brand">Топливо</label>
          <input
            placeholder="Тип топлива"
            type="text"
            name="fuel_type"
            value={formData.fuel_type || ""}
            onChange={handleFormDataChange}
          />
        </div>
        <div>
          <label htmlFor="brand">Коробка</label>
          <input
            placeholder="Тип коробки передач"
            type="text"
            name="transmission_type"
            value={formData.transmission_type || ""}
            onChange={handleFormDataChange}
            required
          />
        </div>
        <div>
          <label htmlFor="brand">Привод</label>
          <input
            placeholder="Тип привода"
            type="text"
            name="drive_type"
            value={formData.drive_type || ""}
            onChange={handleFormDataChange}
            required
          />
        </div>
        <div>
          <label htmlFor="brand">Состояние</label>
          <select name="condition" onChange={handleFormDataChange}>
            <option value="новое">Новое</option>
            <option value="с пробегом">С пробегом</option>
          </select>
        </div>
        <div>
          <label htmlFor="brand">Цвет</label>
          <input
            placeholder="Цвет кузова"
            type="text"
            value={formData.color || ""}
            name="color"
            onChange={handleFormDataChange}
            required
          />
        </div>
        <div>
          <label htmlFor="brand">Описание</label>
          <textarea
            placeholder="Описание"
            name="description"
            value={formData.description || ""}
            onChange={handleFormDataChange}
          />
        </div>
      </div>
      <button type="submit">Отправить</button>
    </form>
  );
}
