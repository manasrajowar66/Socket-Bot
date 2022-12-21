import React from "react";
import styles from "./MachineDefination.module.scss";
import axios from "axios";
import { useHistory } from "react-router-dom";

const MachineDefination = () => {
  const history = useHistory();
  const onSend = async () => {
    const mDefination = document.getElementById("machineDefination");
    if (mDefination) {
      try {
        await axios.post("http://localhost:3001/api/user/machine-defination", {
          defination: mDefination.value,
        });
        console.log("Bot successfully Initialized.");
        history.push("/chat");
      } catch (error) {
        console.log("Bot not Initialized");
        console.log(error);
      }
    }
  };
  return (
    <div className={styles.mainContainer}>
      <div className={styles.card}>
        <h1>Machine Defination</h1>
        <textarea
          rows={6}
          placeholder="Enter machine defination..."
          id="machineDefination"
        />
        <button onClick={onSend}>Send</button>
      </div>
    </div>
  );
};

export default MachineDefination;
