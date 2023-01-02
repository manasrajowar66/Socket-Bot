import React, { useEffect, useContext } from "react";
import { UserContext } from "../../state/context";
import { useActor } from "@xstate/react";
import { io } from "socket.io-client";
import styles from "./Chat.module.scss";
import Message from "./Message/Message";
import ScrollToBottom from "react-scroll-to-bottom";

let socket;
const Chat = () => {
  const services = useContext(UserContext);
  const { send } = services.userService;
  const [state] = useActor(services.userService);

  const sendMessage = () => {
    const textField = document.getElementById("text-field");
    socket.emit("message", { message: textField.value });
    textField.value = "";
  };

  const { name, picture } = state.context.user;
  const { messages } = state.context;

  useEffect(() => {
    socket = io("http://localhost:3001");
    socket.on("connect", () => {
      socket.emit("joined", { name: name });
    });

    return () => {
      // socket.emit("disconnect");
      socket.off();
    };
  }, [name]);

  useEffect(() => {
    socket.on("message", ({ type, data }) => {
      send({ type: "ADD_MESSAGE", data: { type: type, data: data } });
    });

    return () => {};
  }, [send]);

  const onLogout = () => {
    send({ type: "LOGOUT" });
    localStorage.removeItem("token");
  };

  const onSelect = (option) => {
    socket.emit("message", { type: option, message: option });
  };

  return (
    <div className={styles.container}>
      <div className={styles.sub_container}>
        <div className={styles.header}>
          <h1>SOCKET BOT</h1>
          <button onClick={onLogout}>
            Logout <img src={picture} alt="profile.img" />
          </button>
        </div>
        <ScrollToBottom
          initialScrollBehavior="smooth"
          mode="bottom"
          className={styles.chatContainer}
        >
          {messages.map((message, index) => {
            return (
              <Message message={message} key={index} onSelect={onSelect} />
            );
          })}
        </ScrollToBottom>
        <div className={styles.inputField}>
          <input placeholder="Message" id="text-field" />
          <button onClick={sendMessage}>SEND</button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
