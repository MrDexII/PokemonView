import React, { useEffect, useState } from "react";
import { useForm } from "../customHooks/useForm";
import Select from "react-select";
import config from "../config";

import styles from "../style/AddPokemonView.module.css";
import styleButton from "../style/PokemonStyle.module.css";

function AddPokemon({
  token,
  isUserHaveAdminAuthority,
  handleSubmit,
  initialValues,
}) {
  const defaultPokemonStat = {
    hp: { base: 0, min: 0, max: 0 },
    attack: { base: 0, min: 0, max: 0 },
    defence: { base: 0, min: 0, max: 0 },
    specialAttack: { base: 0, min: 0, max: 0 },
    specialDefence: { base: 0, min: 0, max: 0 },
    speed: { base: 0, min: 0, max: 0 },
  };
  const defaultPokemon = {
    name: "",
    number: 0,
    fotoUrl: "",
    types: [],
    pokemonStats: defaultPokemonStat,
  };
  const [pokemon, setPokemon] = useForm(defaultPokemon);
  const [allPokemonType, setAllTypes] = useState([]);
  const [chosenType, setChosenType] = useState([]);
  const [pokemonStats, setPokemonStats] = useState(defaultPokemonStat);

  useEffect(() => {
    setPokemon({
      ...pokemon,
      pokemonStats: pokemonStats,
    });
  }, [pokemonStats]);

  useEffect(() => {
    const url = `${config.SERVER_NAME}/pokemon/type/`;
    fetchPokemonType(url);
    if (initialValues) {
      const newPokemon = {
        name: initialValues.name,
        fotoUrl: initialValues.fotoUrl,
        types: initialValues.types,
        number: initialValues.number
      };
      setPokemonStats(initialValues.pokemonStats);
      setPokemon(newPokemon);
      setChosenType(
        initialValues.types.map((type) => {
          return { value: type.toLowerCase(), label: type };
        })
      );
    } else {
      setPokemon(defaultPokemon);
    }
  }, []);

  const changeType = (event) => {
    function makePokemon(chosenType) {
      const chosenTypeList = chosenType.map((item) => {
        return item.label;
      });

      // let val = allPokemonType
      //   .filter((item) => {
      //     for (const item2 of temp) {
      //       if (item2 === item.name) {
      //         return true;
      //       }
      //     }
      //     return false;
      //   })
      //   .map((item) => {
      //     return { id: item.id };
      //   });
      return chosenTypeList;
    }

    if (event !== null || event === []) {
      setPokemon({
        ...pokemon,
        types: makePokemon(event),
      });
    } else {
      setPokemon({
        ...pokemon,
        types: [],
      });
    }
    setChosenType(event);
  };

  async function fetchPokemonType(url) {
    await fetch(url, {
      method: "GET",
      headers: {
        Authorization: token,
      },
    })
      .then((data) => data.json())
      .then((data) => setAllTypes(data._embedded.pokemonTypeList))
      .catch((error) => console.error(error));
  }

  const mapTypeToLabel = (item) => {
    return { value: item.name.toLowerCase(), label: item.name };
  };

  const onPokemonStatsChange = ({ target }) => {
    const { name } = target;
    //np [hp.base]
    const statArray = name.split(".");
    setPokemonStats((prev) => {
      return {
        ...prev,
        [statArray[0]]: { ...prev[statArray[0]], [statArray[1]]: target.value },
      };
    });
  };

  return (
    <div className={styles.container}>
      {/* {console.log("pokemon", pokemon, "Pokemon stat", pokemonStats)} */}
      <form
        className={styles.addForm}
        onSubmit={(event) => handleSubmit(event, pokemon)}
      >
        <label>Pokmeon type</label>
        <Select
          className={styles.selectBox}
          isMulti={true}
          value={chosenType}
          onChange={changeType}
          options={allPokemonType.map(mapTypeToLabel)}
        />
        <label>Pokemon Name</label>
        <input
          name="name"
          value={pokemon.name}
          type="text"
          onChange={setPokemon}
          placeholder="Pokemon Name"
          autoComplete="off"
        />
        <label>Image URL</label>
        <input
          name="fotoUrl"
          value={pokemon.fotoUrl}
          type="text"
          onChange={setPokemon}
          placeholder="Image URL"
          autoComplete="off"
        />
        <label>Pokemon stats</label>
        <div className={styles.gridContainer}>
          <label>Base hp</label>
          <input
            name="hp.base"
            value={pokemonStats.hp.base}
            type="number"
            onChange={onPokemonStatsChange}
          />
          <label>Min hp</label>
          <input
            name="hp.min"
            value={pokemonStats.hp.min}
            type="number"
            onChange={onPokemonStatsChange}
          />
          <label>Max hp</label>
          <input
            name="hp.max"
            value={pokemonStats.hp.max}
            type="number"
            onChange={onPokemonStatsChange}
          />
          <label>Base attack</label>
          <input
            name="attack.base"
            value={pokemonStats.attack.base}
            type="number"
            onChange={onPokemonStatsChange}
          />
          <label>Min attack</label>
          <input
            name="attack.min"
            value={pokemonStats.attack.min}
            type="number"
            onChange={onPokemonStatsChange}
          />
          <label>Max attack</label>
          <input
            name="attack.max"
            value={pokemonStats.attack.max}
            type="number"
            onChange={onPokemonStatsChange}
          />
          <label>Base defence</label>
          <input
            name="defence.base"
            value={pokemonStats.defence.base}
            type="number"
            onChange={onPokemonStatsChange}
          />
          <label>Min defence</label>
          <input
            name="defence.min"
            value={pokemonStats.defence.min}
            type="number"
            onChange={onPokemonStatsChange}
          />
          <label>Max defence</label>
          <input
            name="defence.max"
            value={pokemonStats.defence.max}
            type="number"
            onChange={onPokemonStatsChange}
          />
          <label>Base specialAttack</label>
          <input
            name="specialAttack.base"
            value={pokemonStats.specialAttack.base}
            type="number"
            onChange={onPokemonStatsChange}
          />
          <label>Min specialAttack</label>
          <input
            name="specialAttack.min"
            value={pokemonStats.specialAttack.min}
            type="number"
            onChange={onPokemonStatsChange}
          />
          <label>Max specialAttack</label>
          <input
            name="specialAttack.max"
            value={pokemonStats.specialAttack.max}
            type="number"
            onChange={onPokemonStatsChange}
          />
          <label>Base specialDefence</label>
          <input
            name="specialDefence.base"
            value={pokemonStats.specialDefence.base}
            type="number"
            onChange={onPokemonStatsChange}
          />
          <label>Min specialDefence</label>
          <input
            name="specialDefence.min"
            value={pokemonStats.specialDefence.min}
            type="number"
            onChange={onPokemonStatsChange}
          />
          <label>Max specialDefence</label>
          <input
            name="specialDefence.max"
            value={pokemonStats.specialDefence.max}
            type="number"
            onChange={onPokemonStatsChange}
          />
          <label>Base speed</label>
          <input
            name="speed.base"
            value={pokemonStats.speed.base}
            type="number"
            onChange={onPokemonStatsChange}
          />
          <label>Min speed</label>
          <input
            name="speed.min"
            value={pokemonStats.speed.min}
            type="number"
            onChange={onPokemonStatsChange}
          />
          <label>Max speed</label>
          <input
            name="speed.max"
            value={pokemonStats.speed.max}
            type="number"
            onChange={onPokemonStatsChange}
          />
        </div>
        {isUserHaveAdminAuthority() ? (
          <button className={styleButton.deleteButton}>
            {initialValues ? "Update Pokemon" : "Add Pokemon"}
          </button>
        ) : (
          ""
        )}
      </form>
    </div>
  );
}

export default AddPokemon;
