import React from "react";
import styles from "../style/PokemonElementStyle.module.css";

function PokemonElement({ name, fotoUrl, types }) {
  return (
    <div className={styles.pokemonElement}>
      <h1>{name}</h1>
      <img src={fotoUrl} alt="" />
      {types.map((type) => {
        return (
          <div className={styles.type} key={name + type}>
            <h2>{type}</h2>
          </div>
        );
      })}
    </div>
  );
}

export default PokemonElement;
