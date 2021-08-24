import React from "react";
import { useParams, withRouter } from "react-router-dom";
import { useEffect, useState } from "react";
import PokemonElement from "./PokemonElement";
import styles from "../style/PokemonStyle.module.css";
import AddPokemon from "./AddPokemon";

function Pokemon({ isUserHaveAdminAuthority, token, changeView }) {
  const { id } = useParams();
  const [pokemonData, setPokemonData] = useState(null);

  useEffect(() => {
    const url = `http://192.168.1.4:8080/pokemon/${id}`;
    fetchOnePokemon(url);
  }, []);

  const fetchOnePokemon = async (url) => {
    await fetch(url, {
      method: "GET",
      headers: {
        Authorization: token,
      },
    })
      .then((data) => data.json())
      .then((data) => setPokemonData(data));
  };

  const deletePokemon = async () => {
    await fetch(pokemonData._links.self.href, {
      method: "DELETE",
      headers: {
        Authorization: token,
      },
    }).then((data) => {
      if (data.status === 204) {
        changeView("/pokemon");
      }
    });
  };

  const updatePokemon = async (event, pokemon) => {
    event.preventDefault();

    await fetch(pokemonData._links.self.href, {
      method: "PUT",
      headers: {
        Authorization: token,
        "Content-type": "application/json",
      },
      body: JSON.stringify(pokemon),
    }).then((data) => {
      if (data.status === 201) {
        changeView("/pokemon");
      }
    });
  };

  return (
    pokemonData && (
      <div className={styles.container}>
        <PokemonElement {...pokemonData} />
        <AddPokemon
          token={token}
          isUserHaveAdminAuthority={isUserHaveAdminAuthority}
          initialValues={pokemonData}
          handleSubmit={updatePokemon}
        />
        {isUserHaveAdminAuthority() ? (
          <button className={styles.deleteButton} onClick={deletePokemon}>
            Delete
          </button>
        ) : (
          ""
        )}
      </div>
    )
  );
}

export default withRouter(Pokemon);
