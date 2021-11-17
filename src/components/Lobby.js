import React, { useContext, useEffect, useState } from "react";
import styles from "../style/LobbyStyle.module.css";
import { useParams } from "react-router-dom";

import StompContext from "../contexts/StompContext";
import ChangeViewContext from "../contexts/ChangeViewContext";

import config from "../config";
import Loading from "./Loading";
import ChoosePokemon from "./ChoosePokemon";

export default function Lobby({ username }) {
  const { id } = useParams();
  const { stompClient, setStompClient } = useContext(StompContext);
  const changeView = useContext(ChangeViewContext);
  const [isSessionExists, setIsSessionExists] = useState(undefined);
  const [mySession, setMySession] = useState();
  const [opponentSession, setOpponentSession] = useState();

  useEffect(() => {
    {
      const checkIfSessionExists = async (url) => {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        });
        if (response.status === 200) {
          setIsSessionExists(true);
          const json = await response.json();
          json.userSessionsList.forEach((session) =>
            setOpponentUserSession(session)
          );
        } else setIsSessionExists(false);
      };
      if (!mySession || !opponentSession) {
        stompClient.subscribe(`/topic/lobby.${id}`, onMessageReceived);
      }
      const url = `${config.SERVER_NAME}/gameSession/${id}`;
      checkIfSessionExists(url);
    }
  }, []);

  const setOpponentUserSession = (session) => {
    if (session.username === username) {
      setMySession(session);
    } else {
      setOpponentSession({ ...session, pokemonList: [] });
    }
  };

  const handleReadClick = () => {
    sendMessage(`/app/lobby.${id}`, { ...mySession, ready: true });
    setMySession((prev) => {
      return {
        ...prev,
        ready: !prev.ready,
      };
    });
  };

  const sendMessage = (destination, session) => {
    stompClient.publish({
      destination: destination,
      headers: {},
      body: JSON.stringify(session),
    });
  };

  const onMessageReceived = (frame) => {
    const body = JSON.parse(frame.body);
    setOpponentUserSession(body);
  };

  return (
    <div className={styles.container}>
      {isSessionExists === true ? (
        <>
          <h1 className={styles.title}>Lobby</h1>
          <h2>Me</h2>
          <div
            className={`${mySession?.ready ? styles.green : styles.red} ${
              styles.square
            } ${styles.container}`}
          >
            <button
              onClick={handleReadClick}
              disabled={mySession?.ready ? true : false}
            >
              {mySession?.ready ? "Wait..." : "Ready"}
            </button>
          </div>
          <h2>Opponent {opponentSession?.username}</h2>
          <div
            className={`${opponentSession?.ready ? styles.green : styles.red} ${
              styles.square
            }`}
          ></div>
          <h1>Reroll count: {mySession?.reRollCount}</h1>
        </>
      ) : isSessionExists === false ? (
        <h1>Wrong session id: {id}</h1>
      ) : (
        <Loading></Loading>
      )}
      <ChoosePokemon
        session={mySession}
        lobbyId={id}
        stompClient={stompClient}
        isReady={mySession?.ready}
      />
    </div>
  );
}
