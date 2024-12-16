import React from "react";
import styles from "../style/AlertWindowStyle.module.css";

export default function AlertWindow({
  alertWindowMessage,
  handleOk,
  handleNo,
  handleCancel,
}) {
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
      {alertWindowMessage.type === "negativeBattleRequest" && (
        <button className={styles.cancelButton} onClick={handleCancel}>
          OK
        </button>
      )}
    </div>
  );
}
