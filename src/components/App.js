import React, { useState, useEffect } from "react"
import { Switch, Route, useHistory } from "react-router-dom"

import { useForm } from "./useForm"

import PokemonView from "./PokemonView"
import LoginView from "./LoginView"
import AddPokemon from "./AddPokemon"
import Pokemon from "./Pokemon"
import CreateUser from "./CreateUser"
import NoAllow from "./NoAllow"
import "../style/index.css"

function App() {

    const defaultUserDetails = {
        username: "",
        password: "",
        //token: "Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImF1dGhvcml0aWVzIjpbeyJpZCI6MSwicm9sZSI6IkFETUlOIiwiYXV0aG9yaXR5IjoiQURNSU4ifSx7ImlkIjoyLCJyb2xlIjoiVVNFUiIsImF1dGhvcml0eSI6IlVTRVIifV0sImlhdCI6MTU5MDc1OTU3MywiZXhwIjoxNTkxOTEyODAwfQ.ZBGvp4ryogkRgLJRk7PwYgQt_emWefaVaPzA8pZPl3Ghhx69ks3xjyezbVBLkRJqd1Lz-3LCBQ8yr99xfCT7kQ",
        token: null,
        status: 0,
        authorities: []
    }

    const [values, setValues] = useForm(defaultUserDetails)
    const [isLoading, setIsLoading] = useState(undefined)

    let history = useHistory()

    useEffect(() => {
        setIsLoading(false)
    }, [setIsLoading])

    const loginSubmit = event => {
        event.preventDefault()

        async function fetchUser(url) {
            const response = await fetch(url, {
                method: "POST",
                body: JSON.stringify({ username: values.username, password: values.password })
            })
            if (response.status === 200) {
                setValues({
                    ...values,
                    token: response.headers.get("Authorization"),
                    status: response.status,
                    authorities: extractAuthorities(response.headers.get("Authorization"))
                })
                extractAuthorities(response.headers.get("Authorization"))
                changeView("/pokemon")
            } else {
                setValues({
                    ...values,
                    password: "",
                    token: null,
                    status: response.status,
                })
            }
            setIsLoading(false)
        }

        const url = 'http://localhost:8080/login'

        setIsLoading(true)
        fetchUser(url)
    }

    const extractAuthorities = token => {
        token = token.replace('Bearer ', '')
        const jwt = require('jsonwebtoken');
        const decoded = jwt.decode(token);
        return decoded.authorities.map(authority => authority.authority)
    }

    const addPokemonSubmit = (event, pokemon) => {
        event.preventDefault()

        function addPokemon(url) {
            fetch(url, {
                method: "POST",
                headers: {
                    'Authorization': values.token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(pokemon)
            })
                .catch(error => console.error(error))
        }

        const url = "http://localhost:8080/pokemon/"
        addPokemon(url)
        changeView("/pokemon")
    }

    const logout = () => {
        setValues(defaultUserDetails)
        changeView("/")
    }
    const changeView = path => history.push(path)

    const isUserHaveAdminAuthority = () => {
        if (values.authorities)
            return values.authorities.indexOf("ADMIN") > -1
        return false
    }

    return (
        <Switch>
            <Route path="/" exact>
                <LoginView {...values} isLoading={isLoading} changeView={changeView} handleChange={setValues} handleSubmit={loginSubmit} />
            </Route>
            <Route path="/pokemon" exact>
                <PokemonView token={values.token} isUserHaveAdminAuthority={isUserHaveAdminAuthority} changeView={changeView} logout={logout} />
            </Route>
            <Route path="/pokemon/add" exact>
                {isUserHaveAdminAuthority() ?
                    <AddPokemon authorities={values.authorities} isUserHaveAdminAuthority={isUserHaveAdminAuthority} handleSubmit={addPokemonSubmit} token={values.token} /> :
                    <NoAllow />
                }
            </Route>
            <Route path="/pokemon/:id">
                <Pokemon token={values.token} isUserHaveAdminAuthority={isUserHaveAdminAuthority} changeView={changeView} />
            </Route>
            <Route path="/createUser" exact>
                <CreateUser />
            </Route>
        </Switch>
    )
}

export default App