import React, { useState } from "react";
import styles from "../style/BattleViewStyle.module.css";
import * as SockJS from "sockjs-client";
import Stomp from "stompjs";

export default function BattleView({ username }) {
  const [connected, setConnected] = useState(false);
  const [stompClient, setStompClient] = useState();

  const handleConnect = () => {
    const connectionSuccess = () => {
      client.subscribe("/topic/andrewChat", onMessageReceived);
      client.send(
        "/app/chat.newUser",
        {},
        JSON.stringify({
          sender: username,
          type: "newUser",
        })
      );
      setConnected(true);
    };
    const onMessageReceived = (payload) => {
      console.log("dostalem", payload.body);
    };

    const sock = new SockJS("http://192.168.1.4:8080/webSocketApp");
    const client = new 
    Stomp.over(sock);
    setStompClient(client);
    client.connect({}, connectionSuccess);
  };

  const handleDisconnect = () => {
    stompClient.disconnect();
    setConnected(false);
  };

  return (
    <div>
      <h1 className={styles.title}>Hello from battle</h1>
      {connected ? (
        <button onClick={handleDisconnect}>Disconnect</button>
      ) : (
        <button onClick={handleConnect}>Connect</button>
      )}
    </div>
  );
}
