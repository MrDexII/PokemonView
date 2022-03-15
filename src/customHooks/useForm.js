import { useState } from "react"

export const useForm = (initialValues) => {
    const [values, setValues] = useState(initialValues)

    function action(event) {
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