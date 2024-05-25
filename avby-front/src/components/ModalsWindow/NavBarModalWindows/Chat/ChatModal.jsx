import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getRoomsByUserId, removeRoom } from "../../../../services/APIService";
import "./ChatModal.css";

function lastMessageFormatted(message) {
  if (message.length < 20) return message;
  return message.slice(0, 20) + "...";
}

function UsersList({ rooms, onSelectRoom }) {
  return (
    <div className="users_list">
      <h2>Чаты</h2>
      <ul>
        {rooms.map((room, index) => (
          <li className="item" key={index} onClick={() => onSelectRoom(room)}>
            <p>{room.name}</p>
            {room.last_message && (
              <span>{lastMessageFormatted(room.last_message.text)}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ChatComponent() {
  const user = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.auth.token);

  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [ws, setWs] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await getRoomsByUserId(user.id);
        setRooms(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchRooms();
  }, [selectedRoom]);

  useEffect(() => {
    if (selectedRoom) {
      console.log(selectedRoom);
      const ws = new WebSocket(
        `ws://localhost:8080/ws/chat/${selectedRoom.name}/?token=${token}`
      );
      loadMessages(selectedRoom.messages);
      setWs(ws);
      ws.onopen = () => {
        console.log(`Соединение установлено для комнаты ${selectedRoom.name}`);
        setIsConnected(true);
      };
      ws.onclose = () => {
        console.log(`Соединение закрыто для комнаты ${selectedRoom.name}`);
        setIsConnected(false);
      };
      return () => {
        ws.close();
      };
    }
  }, [selectedRoom]);

  useEffect(() => {
    if (ws) {
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const formattedMessage = {
          userId: data.user_id,
          user: data.username,
          text: data.message,
          created_at: data.created_at,
        };
        setMessages((messages) => [...messages, formattedMessage]);
      };
    }
  }, [ws]);

  const loadMessages = (roomMessages) => {
    const formattedMessages = roomMessages.map((message) => ({
      userId: message.user.id,
      user: message.user.username,
      text: message.text,
      created_at: message.created_at_formatted,
    }));
    setMessages(formattedMessages);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (messageInput && ws) {
      const data = {
        message: messageInput,
        username: user.username,
        room: selectedRoom.name,
        userId: user.id,
      };
      ws.send(JSON.stringify(data));
      setMessageInput("");
    }
  };

  const onSelectRoom = (room) => {
    if (!selectedRoom) {
      setSelectedRoom(room);
    }
    if (room && room.pk !== selectedRoom.pk) {
      setSelectedRoom(room);
    }
  };

  const onRemoveRoom = async () => {
    if (selectedRoom) {
      try {
        const response = await removeRoom(selectedRoom.pk);
        if (response.status === 204) {
          setRooms(rooms.filter((room) => room.pk !== selectedRoom.pk));
        }
      } catch (error) {
        console.log("Error");
      }
    }
    setRooms((prevRooms) => prevRooms.filter((room) => room.pk !== selectedRoom.pk));
  };

  if (rooms.length === 0) {
    return <h3>Пока что у вас нет сообщений</h3>;
  }

  return (
    <div className="chat">
      <UsersList rooms={rooms} onSelectRoom={onSelectRoom} />
      <div className="chat_window">
        {selectedRoom && (
          <div className="selected_room">
            <h2 className="room_name">{selectedRoom.name}</h2>
            <span className="close_room" onClick={onRemoveRoom}>Удалить чат</span>
          </div>
        )}
        <div className="messages">
          {messages.length > 0
            ? messages.map((message, index) => (
                <div
                  key={index}
                  className={
                    message.userId === user.id ? "message me" : "message"
                  }
                >
                  {message.userId === user.id ? (
                    <strong>Вы:</strong>
                  ) : (
                    <strong>{message.user}:</strong>
                  )}
                  <p>{message.text}</p>
                  <span>{message.created_at}</span>
                </div>
              ))
            : { selectedRoom } && (
                <p className="no_messages">Пока нет сообщений</p>
              )}
        </div>
        <input
          type="text"
          placeholder="Напишите сообщение..."
          disabled={!isConnected}
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyPress={(e) => (e.key === "Enter" ? handleSubmit() : null)}
        />
        <button onClick={handleSubmit} disabled={!isConnected}>
          Отправить
        </button>
      </div>
    </div>
  );
}
