import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import { removeAnnouncement, addNotification } from "../../../Redux/reducers/userSlice";

import "./AnnoucementModal.css";

export default function AnnouncementsModal({announcements}) {
  const dispatch = useDispatch();
  
  const onClickRemove = (item) => {
    dispatch(removeAnnouncement(item.id));
    dispatch(addNotification(`Объявление ${item.name} было удалено`));
  }

  return (
    <>
      <h3>Мои объявления</h3>
      <div className="content">
        {announcements.length > 0 ? (
          announcements.map((item) => (
            <div className="item" key={item.id}>
              <div className="item__left">
                <img className="item__img" src={item.photos[0].photo} alt="" />
              </div>
              <Link
                to={`/cars/${item.brand.slug}/${item.model.slug}/${item.id}`}
              >
                <div className="item__right">
                  <h4>{item.name}</h4>
                </div>
              </Link>
              <div
                className="item__bottom"
                onClick={() => onClickRemove(item)}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <path
                      d="M6 7V18C6 19.1046 6.89543 20 8 20H16C17.1046 20 18 19.1046 18 18V7M6 7H5M6 7H8M18 7H19M18 7H16M10 11V16M14 11V16M8 7V5C8 3.89543 8.89543 3 10 3H14C15.1046 3 16 3.89543 16 5V7M8 7H16"
                      stroke="#000000"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>{" "}
                  </g>
                </svg>
              </div>
            </div>
          ))
        ) : (
          <p className="item__empty">Ваш список объявлений пуст</p>
        )}
      </div>
    </>
  );
}
