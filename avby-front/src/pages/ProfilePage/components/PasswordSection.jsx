import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { updateUserPassword } from "../../../services/APIService";
import { showMessageInfo } from "../../../Redux/reducers/messageInfoSlice";

export default function PasswordSection({ onUpdateSuccess }) {
  const dispatch = useDispatch();
  const [formPassword, setFormPassword] = useState({
    old_password: "",
    new_password: "",
  });

  const handleChange = (e) => {
    setFormPassword({ ...formPassword, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updateUserPassword(formPassword);
      if (response.status === 200) {
        onUpdateSuccess(true);
      }
    } catch (error) {
      dispatch(
        showMessageInfo({
          type: "error",
          text: "Произошла ошибка при обновлении пароля",
        })
      );
    }
  };

  return (
    <div className="password-section">
      <div className="profile__footer">
        <strong>Пароль</strong>
      </div>
      <form className="profile__form">
        <div className="validation_errors"></div>
        <div className="personal-info password">
          <div className="input_wrap">
            <p className="input-title">Старый пароль</p>
            <input
              className="input_password"
              type="password"
              name="password"
              value={formPassword.old_password}
              onChange={handleChange}
            />
          </div>
          <div className="input_wrap">
            <p className="input-title">Новый пароль</p>
            <input
              className="input_password"
              type="password"
              name="password2"
              value={formPassword.new_password}
              onChange={handleChange}
            />
          </div>
          <div className="after_block">
            <button onClick={handleSubmit}>Сохранить</button>
          </div>
        </div>
      </form>
    </div>
  );
}

PasswordSection.propTypes = {
  onUpdateSuccess: PropTypes.func,
};
