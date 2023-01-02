import React from "react";
import styles from "./Message.module.scss";

const Message = ({ message, onSelect }) => {
  const messageStyle =
    message.type === "incoming" ? styles.incoming : styles.outgoing;
  const user = message.type === "incoming" ? "Bot" : "You";

  const onSelectOption = (option) => {
    onSelect(option);
  };

  return (
    <div className={`${styles.message} ${messageStyle}`}>
      <p>{`${user}: ${message.data.msg}`}</p>
      <div className={styles.options}>
        {message.data?.options?.map((option) => {
          return (
            <button
              onClick={() => onSelectOption(option)}
              key={option}
              className={styles.option}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Message;
