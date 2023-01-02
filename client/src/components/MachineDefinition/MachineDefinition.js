import React, { useState } from "react";
import styles from "./MachineDefinition.module.scss";
import axios from "axios";
import { useHistory } from "react-router-dom";

const MachineDefinition = () => {
  const history = useHistory();
  const [isTelegramBotActivated, setIsTelegramBotActivated] = useState(false);
  const [hasError, setError] = useState(null);
  const onSend = async () => {
    const mDefinitionEle = document.getElementById("machineDefinition");

    if (mDefinitionEle) {
      try {
        const machineDefinitionJson = mDefinitionEle.value;
        const machineDefinition = await JSON.parse(machineDefinitionJson);
        await axios.post("http://localhost:3001/api/user/machine-definition", {
          definition: machineDefinitionJson,
        });
        console.log("Bot successfully Initialized.");
        if (machineDefinition.type !== "telegram-bot") {
          setIsTelegramBotActivated(false);
          history.push("/chat");
        }
        setIsTelegramBotActivated(true);
        setError(null);
      } catch (err) {
        console.log("Bot not Initialized");
        if (err.request?.response) {
          setError(err.request?.response);
        } else {
          console.log(err);
        }
      }
    }
  };
  return (
    <div className={styles.mainContainer}>
      <div className={styles.card}>
        <h1>Machine Definition</h1>
        <textarea
          rows={6}
          placeholder="Enter machine definition..."
          id="machineDefinition"
        />
        <button onClick={onSend}>Send</button>
        {isTelegramBotActivated && !hasError && (
          <a
            href="https://t.me/myfirst300000bot"
            target="_blank"
            rel="noreferrer"
          >
            Telegram Bot Link
          </a>
        )}
        {hasError && <p className={styles.error}>{hasError}</p>}
      </div>
    </div>
  );
};

export default MachineDefinition;
