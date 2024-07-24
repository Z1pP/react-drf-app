import React from "react";
import "./Modal.css";
import contact_svg from "../../assets/phone_ring.svg";


const phoneFormater = (phone) => {
  return phone.replace(/(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})/, "+$1 ($2) $3-$4-$5");
}

export default function ModalWindowContacts({ active, setActive, user }) {
  return (
    <div
      className={active ? "modal active" : "modal"}
      onClick={() => setActive(false)}
    >
      <div className="modal__content" onClick={(e) => e.stopPropagation()}>
        <div className="open__contacts">
          <div className="info__avatar">
            <img src={user.image} alt="avatar" />
            <div className="info__name">
              <h3>{user.username}</h3>
              <span>{user.country}, г.{user.city}</span>
            </div>
          </div>
          <div className="info__phone">
            <a href={`tel:${user.phone}`}>{phoneFormater(user.phone)}</a>
          </div>
          <img src={contact_svg} alt="номер" />
        </div>
      </div>
    </div>
  );
}
