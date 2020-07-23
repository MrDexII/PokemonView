import React, { useEffect, useState } from "react"
import { withRouter, Link } from "react-router-dom"

import styles from "../style/PokemonContainerStyle.module.css"
import PokemonElement from "./PokemonElement"

function PokemonView({ isUserHaveAdminAuthority, token, changeView, logout }) {
    const [state, setState] = useState({ content: "", new: false })

    async function fetchData(url) {
        await fetch(url, {
            method: "GET",
            headers: {
                'Authorization': token
            }
        }).then(data => data.json())
            .then(data => setState({ content: data }))
            .catch(error => console.log(error))
    }

    useEffect(() => {
        const url = "http://localhost:8080/pokemon/all"
        fetchData(url)
    }, [])

    const PokemonContainer = () => {
        return (
            <div className={styles.pokemonContainer}>
                {state.content.length !== 0 && state.content._embedded.pokemons.map(pokemon => {
                    return (
                        <Link key={pokemon.id} to={"/pokemon/" + pokemon.id}>
                            <PokemonElement {...pokemon} />
                        </Link>
                    )
                })
                }
            </div>
        )
    }
    const nextPage = () => {
        const urlNext = state.content._links.next.href
        fetchData(urlNext)
    }

    const prevPage = () => {
        const urlPrev = state.content._links.prev.href
        fetchData(urlPrev)
    }

    const Navigation = () => {
        return (
            state.content !== "" ?
                <div className={styles.navigation}>
                    {state.content._links.prev ? <button onClick={prevPage}>Previous</button> : <button disabled>Previous</button>}
                    <label>{state.content.page.number + 1} from {state.content.page.totalPages}</label>
                    {state.content._links.next ? <button onClick={nextPage}>Next</button> : <button disabled>Next</button>}
                </div>
                : ""
        )
    }

    return (
        <div className={styles.main}>
            <PokemonContainer />
            <Navigation />
            {isUserHaveAdminAuthority() ? <button onClick={() => changeView("/pokemon/add")}>Add new Pokemon</button> : <button disabled>Add new Pokemon</button>}
            <button onClick={logout}>LOGOUT</button>
        </div>
    )
}

export default withRouter(PokemonView)