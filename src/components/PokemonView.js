import React, { useEffect, useState } from "react";
import { withRouter, Link } from "react-router-dom";

import styles from "../style/PokemonContainerStyle.module.css";
import PokemonElement from "./PokemonElement";

function PokemonView({
  isUserHaveAdminAuthority,
  token,
  changeView,
  logout,
  username,
}) {
  const [state, setState] = useState({ content: null, isLoading: true });

  async function fetchData(url) {
    setState((prev) => {
      return {
        ...prev,
        isLoading: true,
      };
    });
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: token,
      },
    });
    const json = await response.json();
    setState({ content: json, isLoading: false });
  }

  useEffect(() => {
    const url = "http://192.168.1.4:8080/pokemon/";
    fetchData(url);
  }, []);

  const populateDummyElements = () => {
    const elements = [];
    for (let i = 0; i < 20; i++) {
      elements.push(<PokemonElement key={i} />);
    }
    return elements;
  };

  const PokemonContainer = () => {
    return (
      <div className={styles.pokemonContainer}>
        {state.isLoading !== true
          ? state.content._embedded.pokemonList.map((pokemon) => {
              return (
                <Link key={pokemon.number} to={"/pokemon/" + pokemon._id}>
                  <PokemonElement {...pokemon} />
                </Link>
              );
            })
          : populateDummyElements()}
      </div>
    );
  };
  const nextPage = () => {
    const urlNext = state.content._links.next.href;
    fetchData(urlNext);
  };

  const prevPage = () => {
    const urlPrev = state.content._links.prev.href;
    fetchData(urlPrev);
  };

  const Navigation = () => {
    return state.isLoading !== true ? (
      <div className={styles.navigation}>
        {state.content._links.prev ? (
          <button onClick={prevPage}>Previous</button>
        ) : (
          <button disabled>Previous</button>
        )}
        <label>
          {state.content.page.number + 1} from {state.content.page.totalPages}
        </label>
        {state.content._links.next ? (
          <button onClick={nextPage}>Next</button>
        ) : (
          <button disabled>Next</button>
        )}
      </div>
    ) : (
      ""
    );
  };

  return (
    <div className={styles.main}>
      <h1>Current User: {username}</h1>
      <PokemonContainer />
      <Navigation />
      {isUserHaveAdminAuthority() ? (
        <>
          <button onClick={() => changeView("/pokemon/add")}>
            Add new Pokemon
          </button>
          <button onClick={() => changeView("/admin")}>Admin Panel</button>
        </>
      ) : (
        ""
      )}
      <button onClick={logout}>LOGOUT</button>
    </div>
  );
}

export default withRouter(PokemonView);
