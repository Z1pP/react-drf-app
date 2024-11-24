import defaultAvatar from "../../../assets/no_avatar_image.png";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { updateUserAvatar } from "../../../services/APIService";
import { showMessageInfo } from "../../../Redux/reducers/messageInfoSlice";
export default function ImageSection({ image, onUpdateSuccess }) {
  const dispatch = useDispatch();

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const image = new FormData();
    image.append("image", file);
    try {
      const response = await updateUserAvatar(image);
      if (response.status === 200) {
        dispatch(
          showMessageInfo({ type: "success", text: "Фото успешно обновлено" })
        );
        onUpdateSuccess(true);
      }
    } catch (error) {
      dispatch(
        showMessageInfo({
          type: "error",
          text: "Произошла ошибка при обновлении данных профиля",
        })
      );
    }
  };

  return (
    <div className="img-section">
      <div className="info__avatar">
        <img src={image ? image : defaultAvatar} alt="avatar" />
        <div className="info__wrap">
          <label className="info__change" htmlFor="avatar">
            Изменить фото
            <input
              className="input-avatar"
              type="file"
              name="user_avatar"
              id="user_avatar"
              accept="image/x-png,image/png,image/jpeg,image/gif,.jpeg,.jpg,.png,.gif"
              onChange={handleImageChange}
            />
          </label>
        </div>
      </div>
    </div>
  );
}

ImageSection.propTypes = {
  image: PropTypes.string,
  onUpdateSuccess: PropTypes.func,
};
