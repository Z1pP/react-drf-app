import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { sendMessageForBot } from "../../services/APIService";

const resultQuery = (carName) => {
  return `Ты консультант сайта по продаже новых и поддержанных автомобилей.
          Твоя задача описать машину со слудующими параметрами ${carName}.
          Обязательно поздаровайся с пользователем!`;
}


export default function Assistant({carInfo}) {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [messages, setMessages] = useState([]);

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
        }
      }

      return () => {
        setMessages([]);
      };
    };
    fetchMessage();
  }, [isLoggedIn, carInfo]);

  if (!isLoggedIn || messages.length === 0) {
    return null;
  }

  return (
    <div>
      {messages.map((message, index) => (
        <div key={index}>{message}</div>
      ))}
    </div>
  );
}