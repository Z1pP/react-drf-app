import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {hideMessageInfo} from "../../Redux/reducers/messageInfoSlice";
import "./MessageBlock.css";

export default function MessageBlock() {
  const { text, type, show } = useSelector((state) => state.message);
  const dispatch = useDispatch();

  const [visible, setVisible] = useState(show);

  useEffect(() => {
    setVisible(show);
  }, [show]);

  useEffect(() => {
    if (text && visible) {
      const timer = setTimeout(() => {
        setVisible(false);
        dispatch(hideMessageInfo()); 
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [text, visible, dispatch]);

  const messageClass = type ? `block__${type.toLowerCase()}` : 'block'; 

  return visible ? (
    <div className={messageClass}>{text}</div>
  ) : null;
}