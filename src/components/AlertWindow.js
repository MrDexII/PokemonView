import React, { useContext } from "react";
import styles from "../style/AlertWindowStyle.module.css";
// import Lobby from "./Lobby";
import MyContext from "./MyContext";

export default function AlertWindow({
  alertWindowMessage,
  handleOk,
  handleNo,
  handleCancel,
}) {
  const { changeView } = useContext(MyContext);
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Hello alert</h1>
      <p>{alertWindowMessage.content}</p>
      {alertWindowMessage.type === "battleRequest" && (
        <div className={styles.buttonsContainer}>
          <button className={styles.okButton} onClick={handleOk}>
            Accept
          </button>
          <button className={styles.cancelButton} onClick={handleNo}>
            Reject
          </button>
          <button className={styles.cancelButton} onClick={handleCancel}>
            Cancel
          </button>
        </div>
      )}
      {alertWindowMessage.type === "positiveBattleRequest" && changeView("/")}
      {alertWindowMessage.type === "negativeBattleRequest" && (
        <button className={styles.cancelButton} onClick={handleCancel}>
          OK
        </button>
      )}
    </div>
  );
}
