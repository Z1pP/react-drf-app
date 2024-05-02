import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { hideMessage } from "../../Redux/reducers/messageInfoSlice";
import "./MessageBlock.css";

const MessageBlock = () => {
  const { text, type, show } = useSelector((state) => state.message);
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (text) {
      setVisible(show);
    } else {
      setVisible(false);
    }
  }, [text, show]);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), text ? 2000 : 0);
    return () => clearTimeout(timer);
  }, [text]);

  return visible ? (
    <div className={`block__${type.toLowerCase()}`}>{text}</div>
  ) : null;
};

export default MessageBlock;
