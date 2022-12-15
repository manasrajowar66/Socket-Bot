import React from "react";
import styles from "./Message.module.scss";

const Message = ({ message }) => {
  const messageStyle =
    message.type === "incomming" ? styles.incomming : styles.outgoing;
  const user = message.type === "incomming" ? "Bot" : "You";
  return (
    <div className={`${styles.message} ${messageStyle}`}>
      <p>{`${user}: ${message.msg}`}</p>
    </div>
  );
};

export default Message;
