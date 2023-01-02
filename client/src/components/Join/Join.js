import React, { useContext, useEffect, useCallback } from "react";
import { UserContext } from "../../state/context";
import { useActor } from "@xstate/react";
import styles from "./Join.module.scss";
import { useHistory } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

const Join = () => {
  const services = useContext(UserContext);
  const { send } = services.userService;
  const [state] = useActor(services.userService);
  console.log(state);

  const history = useHistory();

  const joinChat = useCallback(() => {
    history.push(`/machine-definition`);
  }, [history]);

  const onLogin = useCallback(
    async (token) => {
      try {
        const res = await axios.post("http://localhost:3001/api/user/login", {
          token,
        });
        send({ type: "LOGIN", data: { user: res.data } });
        localStorage.setItem("token", token);
        joinChat();
      } catch (error) {
        console.log(error);
      }
    },
    [send, joinChat]
  );

  useEffect(() => {
    //Checking jwt token is valid or not | Stored in local storage
    const token = localStorage.getItem("token");
    if (token) {
      onLogin(token);
    }
  }, [onLogin]);

  return (
    <div className={styles.container}>
      <div className={styles.sub_container}>
        <div className={styles.header}>
          <h1>SOCKET BOT</h1>
        </div>
        <div className={styles.actionField}>
          {/* <button onClick={onLogin}>JOIN</button> */}
          <GoogleLogin
            onSuccess={(credentialRes) => {
              onLogin(credentialRes.credential);
            }}
            onError={() => {
              console.log("Login Failed");
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Join;
