import React from "react";
import styles from "../style/PokemonElementStyle.module.css";

function PokemonElement({ name, fotoUrl, types, number }) {
  return (
    <div className={styles.pokemonElement}>
      {name ? (
        <h1>{name}</h1>
      ) : (
        <div className={`${styles.skeleton} ${styles.skeletonText}`}></div>
      )}
      {fotoUrl ? (
        <img src={fotoUrl} alt="" />
      ) : (
        <img className={styles.skeleton} />
      )}
      {types ? (
        <>
          <div className={styles.type} key={name + types[0]}>
            <h2>{types[0]}</h2>
          </div>
          <div className={styles.type} key={name + types[1]}>
            <h2>{types[1]}</h2>
          </div>
        </>
      ) : (
        <>
          <div className={styles.type}>
            <div className={`${styles.skeleton} ${styles.skeletonText}`}></div>
          </div>
          <div className={styles.type}>
            <div className={`${styles.skeleton} ${styles.skeletonText}`}></div>
          </div>
        </>
      )}
      {
        number ? (
          <h2>{number}</h2>
        ):(
          <div className={styles.type}>
            <div className={`${styles.skeleton} ${styles.skeletonText}`}></div>
          </div>
        )
      }
    </div>
  );
}

export default PokemonElement;
