import React, { useEffect, useState, useContext } from "react";
import styles from "../style/BattleViewStyle.module.css";
import * as SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

import OpponentsListView from "./OpponentsListView";
import Chat from "./Chat";
import AlertWindow from "./AlertWindow";

import config from "../config";
import StompContext from "../contexts/StompContext";
import ChangeViewContext from "../contexts/ChangeViewContext";

export default function BattleView({ username, token }) {
  const [connected, setConnected] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [chatMessagePayload, setChatMessagePayload] = useState([]);
  const [userList, setUserList] = useState();
  const [alertWindowMessage, setAlertWindowMessage] = useState();
  const [isAlertWindowVisible, setIsAlertWindowVisible] = useState(false);
  const { stompClient, setStompClient } = useContext(StompContext);
  const changeView = useContext(ChangeViewContext);

  useEffect(() => {
    if (chatMessagePayload.at(-1)?.type !== "message") {
      setUserList(() => chatMessagePayload.at(-1)?.userSessionsList);
    }
  }, [chatMessagePayload]);

  useEffect(() => {
    if (alertWindowMessage?.type === "positiveBattleRequest") {
      changeView(`/battle/${alertWindowMessage.content}`);
    }
  }, [alertWindowMessage]);

  const setConnection = () => {
    const client = new Client({});

    client.webSocketFactory = () => {
      return new SockJS(`${config.SERVER_NAME}/webSocketApp?token=${token}`);
    };

    client.reconnectDelay = 500;
    client.heartbeatIncoming = 0;
    client.heartbeatOutgoing = 4000;

    client.onStompError = function (frame) {
      console.log("Broker reported error: " + frame.headers["message"]);
      console.log("Additional details: " + frame.body);
      setConnected(false);
      client.deactivate();
      setChatMessagePayload([]);
      setAlertWindowMessage(undefined);
    };

    client.onWebSocketClose = function (frame) {
      setConnected(false);
    };

    client.onConnect = function (frame) {
      client.subscribe("/topic/gameChat", onMessageReceivedFromGameChat);
      client.subscribe("/users/topic/users", onMessageReceivedFromUser);
      client.publish({
        destination: "/app/chat.newUser",
        headers: {},
        body: JSON.stringify({
          sender: username,
          type: "NewUser",
        }),
      });
      setConnected(true);
      setButtonDisabled(false);
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
    setChatMessagePayload([]);
    setAlertWindowMessage(undefined);
  };

  const onMessageReceivedFromGameChat = (payload) => {
    const jsonContent = JSON.parse(payload.body);
    setChatMessagePayload((prev) => [...prev, jsonContent]);
  };

  const onMessageReceivedFromUser = (payload) => {
    const jsonContent = JSON.parse(payload.body);
    setAlertWindowMessage(jsonContent);
    setIsAlertWindowVisible(true);
  };

  const sendMessage = (destination, type, content) => {
    stompClient.publish({
      destination: destination,
      headers: {},
      body: JSON.stringify({
        color: chatMessagePayload[0].color,
        sender: username,
        type: type,
        content: content,
        userSessionId: alertWindowMessage?.userSessionId,
      }),
    });
  };

  const handleOk = (event) => {
    event.preventDefault();
    sendMessage(
      "/app/chat.sendRequestForPlayToUser",
      "positiveBattleRequest",
      `${username} accept request`
    );
  };

  const handleNo = (event) => {
    event.preventDefault();
    sendMessage(
      "/app/chat.sendRequestForPlayToUser",
      "negativeBattleRequest",
      `${username} reject request`
    );
    setAlertWindowMessage(undefined);
  };

  const handleCancel = (event) => {
    event.preventDefault();
    setIsAlertWindowVisible(() => {
      setAlertWindowMessage(undefined);
      return false;
    });
  };

  return (
    <div>
      <header className={styles.header}>
        <h1 className={styles.title}>Hello from battle</h1>
      </header>
      {connected && (
        <>
          <OpponentsListView
            username={username}
            listOfUsers={userList}
            stompClient={stompClient}
          />
          <Chat
            chatMessagePayload={chatMessagePayload}
            sendMessage={sendMessage}
          />
          {alertWindowMessage && isAlertWindowVisible && (
            <AlertWindow
              alertWindowMessage={alertWindowMessage}
              handleOk={handleOk}
              handleNo={handleNo}
              handleCancel={handleCancel}
            />
          )}
        </>
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
      </footer>
    </div>
  );
}
