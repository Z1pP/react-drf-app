import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { sendMessageForBot } from "../../services/APIService";
import "./Assistant.css";

const openChat = () => {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        {" "}
        <path
          d="M12 6V18M12 6L7 11M12 6L17 11"
          stroke="#000000"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>{" "}
      </g>
    </svg>
  );
};

const hideChat = () => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      transform="rotate(180)"
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
          d="M12 6V18M12 6L7 11M12 6L17 11"
          stroke="#000000"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>{" "}
      </g>
    </svg>
  );
};

const resultQuery = (carName) => {
  return `Ты консультант сайта по продаже новых и поддержанных автомобилей. Твоя задача — приветливо поздороваться с пользователем и подробно описать машину со следующими параметрами: ${carName}.`;
};

export default function Assistant({ carInfo }) {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(true);

  useEffect(() => {
    const fetchMessage = async () => {
      if (isLoggedIn && carInfo) {
        try {
          const query = resultQuery(carInfo.name);
          console.log(query);
          const response = await sendMessageForBot(query);
          setMessages((prevMessages) => [...prevMessages, response.data]);
        } catch (error) {
          console.error("Error fetching message:", error);
          setError(
            "Ошибка при получении сообщения. Пожалуйста, попробуйте позже."
          );
        }
      }
    };

    fetchMessage();

    // Очистка сообщений при размонтировании компонента
    return () => {
      setMessages([]);
      setError(null);
    };
  }, [isLoggedIn, carInfo]);

  const handlerDisableChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className="assistant__block-wrapper">
      <div className="assistant__block">
        <div className="block-header">
          <div className="block-header__title">
            <p>ВеброБот</p>
            <span>Ваш дружелюбный помощник</span>
          </div>
          <div className="block-header__icon" onClick={handlerDisableChat}>
            {isChatOpen ? openChat() : hideChat()}
          </div>
        </div>
        <div className={`block-content ${isChatOpen ? "active" : ""}`}>
          {error ? (
            <p className="error">{error}</p>
          ) : (
            messages.map((message, index) => <p key={index}>{message}</p>)
          )}
        </div>
      </div>
    </div>
  );
}
