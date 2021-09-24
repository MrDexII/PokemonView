import React, { useState } from "react";
import styles from "../style/BattleViewStyle.module.css";
import * as SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

import OpponentsListView from "./OpponentsListView";
import Lobby from "./Lobby";

import config from "../config";

export default function BattleView({ username, token }) {
  const [connected, setConnected] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [stompClient, setStompClient] = useState();
  const [jsonMessagePayload, setJsonMessagePayload] = useState({});
  const [alertWindow, setAlertWindow] = useState({
    message: "",
    opponentReady: false,
    meReady: false,
  });
  const [isLobbyCreated, setIsLobbyCreated] = useState(false);

  const setConnection = () => {
    const client = new Client({});

    client.webSocketFactory = () => {
      return new SockJS(`${config.SERVER_NAME}/webSocketApp?token=${token}`);
    };

    client.onConnect = function (frame) {
      client.subscribe("/topic/gameChat", onMessageReceived);
      client.subscribe("/users/topic/users", onMessageFromUser);
      // client.subscribe("/topic/public", onMessageReceived);
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

    client.onWebSocketClose = function (frame) {
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
    const jsonContent = JSON.parse(payload.body);
    setJsonMessagePayload(jsonContent);
  };

  const onMessageFromUser = (payload) => {
    const jsonContent = JSON.parse(payload.body);
    setAlertWindow((prev) => {
      return { ...prev, message: jsonContent.content };
    });
  };

  const handleCreateLobby = () => {
    setIsLobbyCreated((prev) => !prev);
  };

  return (
    <div>
      <header className={styles.header}>
        <h1 className={styles.title}>Hello from battle</h1>
      </header>
      {connected ? (
        <>
          <OpponentsListView
            username={username}
            message={jsonMessagePayload}
            stompClient={stompClient}
          />
          {isLobbyCreated ? <Lobby /> : <></>}
        </>
      ) : (
        <></>
      )}
      <footer className={styles.footer}>
        <button
          className={`${
            connected ? styles.connectButton : styles.connectButton
          }`}
          onClick={connected ? handleDisconnect : handleConnect}
          disabled={buttonDisabled}
        >
          {connected ? "Disconnect" : "Connect"}
        </button>
        {connected ? (
          <button
            className={styles.createLobbyButton}
            onClick={handleCreateLobby}
          >
            Create Lobby
          </button>
        ) : (
          <></>
        )}
      </footer>
    </div>
  );
}
