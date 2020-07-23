import React from "react"
import styles from "../style/PokemonElementStyle.module.css"

function PokemonElement({ pokemonName, imageUrl, pokemonType }) {
    return (
        <div className={styles.pokemonElement}>
            <h1>{pokemonName}</h1>
            <img src={imageUrl} alt="" />
            {pokemonType.map(type => {
                return (
                    <div className={styles.type} key={type.id}>
                        <h2>{type.name}</h2>
                    </div>
                )
            })}
        </div>
    )
}

export default PokemonElement