import { useState } from "react"

export const useForm = (initialValues) => {
    const [values, setValues] = useState(initialValues)

    function action(event) {
        // if (event === null || event.length <= 2) {
        //     if (event !== null) {
        //         setValues({
        //             ...values,
        //             chosenType: event,
        //             pokemonType: makePokemon(event, values.allPokemonType)
        //         })
        //     } else {
        //         setValues({
        //             ...values,
        //             chosenType: []
        //         })
        //     }
        // } else if (event.length > 10) {
        //     setValues({
        //         ...values,
        //         allPokemonType: event
        //     })

        // } else if (event.target) {
        //     setValues({
        //         ...values,
        //         [event.target.name]: event.target.value
        //     })
        // } else if (event.content || event.status !== null) {
        //     setValues(event)
        // }
        if (event.target) {
            setValues({
                ...values,
                [event.target.name]: event.target.value
            })
        } else {
            setValues(event)
        }
    }

    return [values, action]
}