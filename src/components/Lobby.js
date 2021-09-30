import React from "react";
import styles from "../style/LobbyStyle.module.css";
//alertWindow\\
// message
// opponentReady
// meReady
export default function Lobby() {
  const handleReadClick = (event) => {
    // setAlertWindow((prev) => {
    //   return { ...prev, meReady: !prev.meReady };
    // });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Lobby</h1>
      <h2>Me</h2>
      <div
      // className={`${alertWindow.meReady ? styles.green : styles.red} ${
      //   styles.square
      // } ${styles.container}`}
      >
        <button onClick={handleReadClick}>Ready</button>
      </div>
      <h2>Opponent</h2>
      <div
        // className={`${alertWindow.opponentReady ? styles.green : styles.red} ${
        //   styles.square
        // }`}
      ></div>
    </div>
  );
}
