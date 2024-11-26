import { useState } from "react";
import defaultAvatar from "../../../assets/no_avatar_image.png";
import PropTypes from "prop-types";
import { updateUserAvatar } from "../../../services/APIService";
import { baseURL } from "../../../services/APIService";

export default function ImageSection({ image, onUpdateSuccess }) {
  const imageFullLink = image ? `${baseURL}${image}` : defaultAvatar;
  const [selectedImage, setSelectedImage] = useState(imageFullLink);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await updateUserAvatar(formData);
      if (response.status === 200) {
        setSelectedImage(URL.createObjectURL(file));
        onUpdateSuccess(true);
      }
    } catch (error) {
      console.error("Ошибка при обновлении изображения:", error);
    }
  };

  const handleImageClick = () => {
    document.getElementById("file-input").click();
  };

  return (
    <div className="img-section">
      <div className="info__avatar">
        <img
          src={selectedImage || defaultAvatar}
          alt="avatar"
          onClick={handleImageClick}
          style={{ cursor: "pointer" }}
        />
        <input
          type="file"
          id="file-input"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: "none" }}
        />
        <div className="info__wrap">
          <label className="info__change" htmlFor="avatar">
            Нажмите для изменения фото
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
