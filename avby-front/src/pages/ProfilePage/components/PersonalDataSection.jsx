import PropTypes from "prop-types";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { showMessageInfo } from "../../../Redux/reducers/messageInfoSlice";
import { updateUserPersonalData } from "../../../services/APIService";

export default function PersonalDataSection({ initialData, onUpdateSuccess, telegram }) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    username: initialData.username,
    email: initialData.email,
    phone: initialData.profile.phone,
    country: initialData.profile.country,
    city: initialData.profile.city,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Создаем объект только с измененными данными
    const changedData = Object.keys(formData).reduce((acc, key) => {
      if (formData[key] !== initialData[key] && formData[key] !== '') {
        acc[key] = formData[key];
      }
      return acc;
    }, {});

    // Если нет изменений, не отправляем запрос
    if (Object.keys(changedData).length === 0) {
      dispatch(showMessageInfo({ 
        type: "info", 
        text: "Нет изменений для сохранения" 
      }));
      return;
    }

    try {
      const response = await updateUserPersonalData(changedData);
      if (response.status === 200) {
        onUpdateSuccess();
        dispatch(showMessageInfo({ 
          type: "success", 
          text: "Данные успешно обновлены" 
        }));
      }
    } catch (error) {
      dispatch(showMessageInfo({
        type: "error",
        text: "Произошла ошибка при обновлении данных"
      }));
    }
  };

  return (
    <div className="info-section">
      <div>
        <strong>Персональные данные</strong>
      </div>
      <form className="profile__form" onSubmit={handleSubmit}>
        <div className="info">
          <div className="info__data email-phone">
            <div className="input_wrap">
              <p className="input-title">Имя</p>
              <input
                className="input-username"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div className="input_wrap">
              <p className="input-title">Email</p>
              <input
                className="input-email"
                type="text"
                name="email"
                value={formData.email}
                readOnly
              />
            </div>
          </div>

          <div className="info__data country">
            <div className="input_wrap">
              <p className="input-title">Страна</p>
              <input
                className="input-country"
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
              />
            </div>
            <div className="input_wrap">
              <p className="input-title">Город</p>
              <input
                className="input-city"
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="info__data phone">
            <div className="input_wrap">
              <p className="input-title">Телефон</p>
              <input
                className="input-phone"
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="info__data telegram">
            <div className="input_wrap">
              <p className="input-title">Telegram</p>
              <input
                className="input-telegram"
                type="text"
                name="telegram"
                value={telegram ? telegram.username : ""}
                readOnly
                disabled={true}
              />
            </div>
            {telegram ? (
              <a className="info__change" href="https://t.me/testbl9_bot">
                Отвязать?
              </a>
            ) : (
              <a className="info__change" href="https://t.me/testbl9_bot">
                {" "}
                Привязать?
              </a>
            )}
          </div>
          <div className="after_block">
            <button onClick={handleSubmit}>Сохранить</button>
          </div>
        </div>
      </form>
    </div>
  );
}

PersonalDataSection.propTypes = {
  initialData: PropTypes.object,
  onUpdateSuccess: PropTypes.func,
  telegram: PropTypes.object,
};
