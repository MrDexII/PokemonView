import React, { useEffect, useState } from "react"
import { useForm } from "./useForm"
import Select from "react-select"

import styles from "../style/AddPokemonView.module.css"

function AddPokemon({ token, isUserHaveAdminAuthority, handleSubmit, initialValues }) {

    const [values, setValues] = useForm({ pokemonName: "", imageUrl: "", pokemonType: [] })
    const [allPokemonType, setAllTypes] = useState([])
    const [chosenType, setChosenType] = useState([])

    useEffect(() => {
        const url = "http://localhost:8080/pokemon/type/"
        fetchPokemonType(url)
        if (initialValues !== null && initialValues !== undefined) {
            setValues(initialValues)
            setChosenType(initialValues.pokemonType.map(mapTypeToLabel))
        }
    }, [])

    const changeType = (event) => {
        function makePokemon(chosenType, allPokemonType) {
            const temp = chosenType.map(item => { return item.label })

            let val = allPokemonType.filter(item => {
                for (const item2 of temp) {
                    if (item2 === item.name) {
                        return true
                    }
                }
                return false
            }).map(item => { return { id: item.id } })
            return val
        }

        if (event !== null || event === []) {
            setValues({
                ...values,
                pokemonType: makePokemon(event, allPokemonType)
            })
        } else {
            setValues({
                ...values,
                pokemonType: []
            })
        }
        setChosenType(event)
    }

    async function fetchPokemonType(url) {
        await fetch(url, {
            method: "GET",
            headers: {
                'Authorization': token
            }
        }).then(data => data.json())
            .then(data => setAllTypes(data._embedded.pokemonTypeList))
            .catch(error => console.error(error))
    }

    const mapTypeToLabel = item => { return { value: item.name.toLowerCase(), label: item.name } }

    return (
        <div className={styles.container}>
            <form className={styles.addForm} onSubmit={(event) => handleSubmit(event, values)}>
                <Select
                    className={styles.selectBox}
                    isMulti={true}
                    value={chosenType}
                    onChange={changeType}
                    options={allPokemonType.map(mapTypeToLabel)}
                />
                <input name="pokemonName" value={values.pokemonName} type="text" onChange={setValues} placeholder="Pokemon Name" autoComplete="off" />
                <input name="imageUrl" value={values.imageUrl} type="text" onChange={setValues} placeholder="Image URL" autoComplete="off" />
                {isUserHaveAdminAuthority() ?
                    <input type="submit" value={initialValues ? "Update Pokemon" : "Add Pokemon"} /> :
                    <input disabled type="submit" value={initialValues ? "Update Pokemon" : "Add Pokemon"} />
                }
            </form>
        </div>
    )
}

export default AddPokemon