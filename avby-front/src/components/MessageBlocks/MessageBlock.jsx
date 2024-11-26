import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { hideMessageInfo } from "../../Redux/reducers/messageInfoSlice";
import "./MessageBlock.css";

export default function MessageBlock() {
  const { text, type, show } = useSelector((state) => state.message);
  const dispatch = useDispatch();

  useEffect(() => {
    if (text && show) {
      const timer = setTimeout(() => {
        dispatch(hideMessageInfo());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [text, show, dispatch]);

  if (!show) return null;

  return (
    <div className="message-modal">
      <div className={`message-content ${type}`}>
        <span className="message-text">{text}</span>
      </div>
    </div>
  );
}
