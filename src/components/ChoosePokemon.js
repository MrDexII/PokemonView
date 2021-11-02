import React, { useEffect } from "react";
import styles from "../style/ChoosePokemonStyle.module.css";

import config from "../config.json";
import PokemonElement from "./PokemonElement";

export default function ChoosePokemon({
  session,
  lobbyId,
  stompClient,
  isReady,
}) {
  useEffect(() => {
    const checkCount = async (url) => {
      const result = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      });
      const json = await result.json();
    };
    const url = `${config.SERVER_NAME}/pokemon/findByPokemonNumber?number=1`;
    checkCount(url);
  }, []);

  const handleClick = (event, number) => {
    event.preventDefault();
    const message = {
      sessionId: session.sessionId,
      pokemonNumberToChange: number,
    };
    const destination = `/app/lobby.update.${lobbyId}`;
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
            isReady
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
