import React, { useState, useEffect } from "react";
import { Switch, Route, useHistory } from "react-router-dom";

import { useForm } from "./useForm";

import PokemonView from "./PokemonView";
import LoginView from "./LoginView";
import AddPokemon from "./AddPokemon";
import Pokemon from "./Pokemon";
import CreateUser from "./CreateUser";
import NoAllow from "./NoAllow";
import AdminPanel from "./AdminPanel";
import BattleView from "./BattleView";

import config from "../config";

import "../style/index.css";

function App() {
  const defaultUserDetails = {
    username: "",
    password: "",
    token: null,
    status: 0,
  };

  const [values, setValues] = useForm(defaultUserDetails);
  const [isLoading, setIsLoading] = useState(false);

  let history = useHistory();

  // useEffect(() => {
  //   setIsLoading(false);
  // }, [setIsLoading]);

  const loginSubmit = (event) => {
    event.preventDefault();

    async function fetchUser(url) {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          username: values.username,
          password: values.password,
        }),
      });
      if (response.status === 200) {
        setValues({
          ...values,
          token: response.headers.get("Authorization"),
          status: response.status,
        });
        changeView("/pokemon");
      } else {
        setValues({
          ...values,
          password: "",
          token: null,
          status: response.status,
        });
      }
      setIsLoading(false);
    }

    const url = `${config.SERVER_NAME}/login`;

    setIsLoading(true);
    fetchUser(url);
  };

  const extractAuthorities = (token) => {
    if (!token || token == null) {
      return [];
    }
    token = token.replace("Bearer ", "");
    const jwt = require("jsonwebtoken");
    const decoded = jwt.decode(token);
    return decoded.authorities.map((authority) => authority.authority);
  };

  const addPokemonSubmit = (event, pokemon) => {
    event.preventDefault();

    function addPokemon(url) {
      fetch(url, {
        method: "POST",
        headers: {
          Authorization: values.token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pokemon),
      }).catch((error) => console.error(error));
    }

    const url = `${config.SERVER_NAME}/pokemon/`;
    addPokemon(url);
    changeView("/pokemon");
  };

  const logout = () => {
    setValues(defaultUserDetails);
    changeView("/");
  };
  const changeView = (path) => history.push(path);

  const isUserHaveAdminAuthority = () => {
    const authorities = extractAuthorities(values.token);
    if (authorities) return authorities.indexOf("ADMIN") > -1;
    return false;
  };
  return (
    <Switch>
      <Route path="/" exact>
        <LoginView
          {...values}
          isLoading={isLoading}
          changeView={changeView}
          handleChange={setValues}
          handleSubmit={loginSubmit}
        />
      </Route>
      <Route path="/pokemon" exact>
        <PokemonView
          username={values.username}
          token={values.token}
          isUserHaveAdminAuthority={isUserHaveAdminAuthority}
          changeView={changeView}
          logout={logout}
        />
      </Route>
      <Route path="/pokemon/add" exact>
        {isUserHaveAdminAuthority() ? (
          <AddPokemon
            authorities={values.authorities}
            isUserHaveAdminAuthority={isUserHaveAdminAuthority}
            handleSubmit={addPokemonSubmit}
            token={values.token}
          />
        ) : (
          <NoAllow />
        )}
      </Route>
      <Route path="/pokemon/:id">
        <Pokemon
          token={values.token}
          isUserHaveAdminAuthority={isUserHaveAdminAuthority}
          changeView={changeView}
        />
      </Route>
      <Route path="/createUser" exact>
        <CreateUser />
      </Route>
      <Route path="/admin" exact>
        {isUserHaveAdminAuthority() ? (
          <AdminPanel username={values.username} token={values.token} />
        ) : (
          <NoAllow />
        )}
      </Route>
      <Route path="/battle" exact>
        <BattleView token={values.token} username={values.username} />
      </Route>
    </Switch>
  );
}

export default App;
