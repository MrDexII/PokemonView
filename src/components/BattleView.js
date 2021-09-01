import React, { useState } from "react";
import styles from "../style/BattleViewStyle.module.css";
import * as SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

export default function BattleView({ username }) {
  const [connected, setConnected] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [stompClient, setStompClient] = useState();

  const setConnection = () => {
    const client = new Client({});

    client.webSocketFactory = () => {
      return new SockJS("http://192.168.1.4:8080/webSocketApp");
    };

    client.onConnect = function (frame) {
      client.subscribe("/topic/andrewChat", onMessageReceived);
      client.publish({
        destination: "/app/chat.newUser",
        headers: {},
        body: JSON.stringify({
          sender: username,
          type: "newUser",
        }),
      });
      setConnected(true);
      setButtonDisabled(false);
    };

    client.onStompError = function (frame) {
      console.log("Broker reported error: " + frame.headers["message"]);
      console.log("Additional details: " + frame.body);
    };

    client.onDisconnect = function (frame) {
      setConnected(false);
    };

    client.activate();
    setStompClient(client);
  };

  const handleConnect = () => {
    setButtonDisabled(true);
    if (!stompClient) {
      setConnection();
    } else {
      stompClient.activate();
    }
  };

  const handleDisconnect = () => {
    stompClient.deactivate();
  };

  const onMessageReceived = (payload) => {
    console.log("dostalem", payload.body);
  };

  return (
    <div>
      <h1 className={styles.title}>Hello from battle</h1>
      {connected ? (
        <button onClick={handleDisconnect}>Disconnect</button>
      ) : (
        <button onClick={handleConnect} disabled={buttonDisabled}>
          Connect
        </button>
      )}
    </div>
  );
}
