import React, { useEffect } from "react";
import styles from "../style/ChoosePokemonStyle.module.css";

import config from "../config.json";
import PokemonElement from "./PokemonElement";

export default function ChoosePokemon({
  session,
  lobbyId,
  stompClient,
  isReady,
  isOpponentReady,
  setMySession,
}) {
  // useEffect(() => {
  //   const checkCount = async (url) => {
  //     const result = await fetch(url, {
  //       method: "GET",
  //       headers: {
  //         Authorization: localStorage.getItem("token"),
  //         "Content-Type": "application/json",
  //       },
  //     });
  //     const json = await result.json();
  //   };
  //   const url = `${config.SERVER_NAME}/pokemon/findByPokemonNumber?number=1`;
  //   checkCount(url);
  // }, []);

  const handleClick = (event, number) => {
    event.preventDefault();
    let destination;
    const message = {
      userSessionId: session.sessionId,
      pokemonNumber: number,
    };
    if (session.reRollCount <= 0 && !(isReady && isOpponentReady)) return;
    if (isReady && isOpponentReady) {
      destination = `/app/lobby.duel.${lobbyId}`;
      setMySession((prev) => {
        return {
          ...prev,
          chosenPokemon: session.pokemonList.find(
            (pokemon) => pokemon.number === number
          ),
        };
      });
    } else {
      destination = `/app/lobby.changePokemon.${lobbyId}`;
    }
    stompClient.publish({
      destination: destination,
      headers: {},
      body: JSON.stringify(message),
    });
  };

  return (
    <div className={styles.container}>
      {session?.pokemonList.map((pokemon) => (
        <a
          style={
            isReady && !(isReady && isOpponentReady)
              ? { pointerEvents: "none", cursor: "default" }
              : { pointerEvents: "auto", cursor: "pointer" }
          }
          key={pokemon.number}
          onClick={(event) => handleClick(event, pokemon.number)}
          href=""
        >
          <PokemonElement {...pokemon} />
        </a>
      ))}
    </div>
  );
}