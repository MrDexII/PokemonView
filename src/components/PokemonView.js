import React, { useEffect, useState } from "react";
import { withRouter, Link } from "react-router-dom";

import styles from "../style/PokemonContainerStyle.module.css";
import PokemonElement from "./PokemonElement";

import config from "../config";

function PokemonView({
  isUserHaveAdminAuthority,
  token,
  changeView,
  logout,
  username,
}) {
  const [state, setState] = useState({ content: null, isLoading: true });

  const [pokemonSearch, setPokemonSearch] = useState([]);

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
    const url = `${config.SERVER_NAME}/pokemon/`;
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
          ? state.content._embedded.pokemonList.map(mapPokemonListToLink)
          : populateDummyElements()}
      </div>
    );
  };

  const mapPokemonListToLink = (pokemon) => {
    return (
      <Link key={pokemon.number} to={"/pokemon/" + pokemon._id}>
        <PokemonElement {...pokemon} />
      </Link>
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

  const handleSearch = ({ target }) => {
    setPokemonSearch([]);
    if (target.value.length < 3) return;
    const url = `${config.SERVER_NAME}/elastic/${target.value}?page=0&size=3`;
    searchPokemonElastic(url);
  };

  const searchPokemonElastic = async (url) => {
    const response = await fetch(url, {
      method: "GET",
      "Content-Type": "application/json",
      headers: {
        Authorization: token,
      },
    });
    if (response.status !== 200) return;
    const json = await response.json();
    json._embedded.pokemonList
      ? setPokemonSearch(json._embedded.pokemonList)
      : setPokemonSearch([]);
  };

  return (
    <div className={styles.content}>
      <div className={styles.left}></div>
      <div className={styles.main}>
        <div className={styles.nav}>
          <h1 className={styles.navElement}>Current User: {username}</h1>
          <button
            className={styles.navElement}
            onClick={() => changeView("/battle")}
          >
            Pokemon Battle
          </button>
          {isUserHaveAdminAuthority() ? (
            <>
              <button
                className={styles.navElement}
                onClick={() => changeView("/pokemon/add")}
              >
                Add new Pokemon
              </button>
              <button
                className={styles.navElement}
                onClick={() => changeView("/admin")}
              >
                Admin Panel
              </button>
            </>
          ) : (
            ""
          )}
          <button className={styles.navElement} onClick={logout}>
            LOGOUT
          </button>
        </div>
        <PokemonContainer />
        <Navigation />
      </div>
      <div className={styles.right}>
        <label htmlFor="elasticSearch" className={styles.searchLabel}>
          Search for Pokemon:
        </label>
        <input
          type="search"
          name="elasticSearch"
          className={styles.inputSearch}
          onChange={handleSearch}
          autoComplete="off"
        />
        <div
          className={`${pokemonSearch.length !== 0 ? styles.searchList : ""}`}
        >
          {pokemonSearch.map(mapPokemonListToLink)}
        </div>
      </div>
    </div>
  );
}

export default withRouter(PokemonView);
