import React from "react"
import { useForm } from "./useForm"
import { useState } from "react"
import { useEffect } from "react"
import styles from "../style/LoginViewStyle.module.css"
import userStyle from "../style/CreateUserStyle.module.css"

function CreateUser() {
    const defaultFormValues = {
        email: "",
        email2: "",
        password: "",
        password2: ""
    }

    const [values, setValues] = useForm(defaultFormValues)

    const [isEmailValid, setIsEmailValid] = useState(true)
    const [isPasswordValid, setIsPasswordValid] = useState(true)
    const [responseMassage, setResponseMassage] = useState("")
    const [isUserCreatedSuccessfully, setIsUserCreatedSuccessfully] = useState(false)

    useEffect(() => {
        const emailRegex = RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)

        const validRegex = emailRegex.test(values.email)
        const validLength = values.email === values.email2

        if (validRegex && validLength) {
            setIsEmailValid(true)
        } else {
            setIsEmailValid(false)
        }
    }, [values.email, values.email2])

    useEffect(() => {
        const passwordRegex = RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~])[A-Za-z\d!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]{8,}$/)

        const validRegex = passwordRegex.test(values.password)
        const validLength = values.password === values.password2

        if (validRegex && validLength) {
            setIsPasswordValid(true)
        } else {
            setIsPasswordValid(false)
        }
    }, [values.password, values.password2])

    const handleOnSubmit = (event) => {
        event.preventDefault()
        if (isEmailValid && isPasswordValid && values.email !== "" && values.password !== "") {
            async function addUser(url) {
                await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        username: values.email,
                        password: values.password
                    })
                }).then(response => {
                    if (response.status !== 200) {
                        setIsUserCreatedSuccessfully(false)
                        return response.text()
                    }
                    else
                        return ""
                })
                    .then(data => setResponseMassage(data))
            }
            const url = "http://localhost:8080/user/new"
            addUser(url)
            setValues(defaultFormValues)
            setIsUserCreatedSuccessfully(true)
        }
    }

    return (
        <div className={userStyle.container}>
            <div className={userStyle.header}>
                <h1>Welcome</h1>
            </div>
            <form className={userStyle.loginForm} onSubmit={handleOnSubmit}>
                <span className={styles.error}>{isEmailValid ? "" : "Email not valid"}</span>
                <input className={styles.inputs} name="email" value={values.email} type="text" placeholder="Email" onChange={setValues} />
                <input className={styles.inputs} name="email2" value={values.email2} type="text" placeholder="Repeat Email" onChange={setValues} />
                <span className={styles.error}>{isPasswordValid ? "" : "Password not valid"}</span>
                <input className={styles.inputs} name="password" value={values.password} type="password" placeholder="Password" onChange={setValues} />
                <input className={styles.inputs} name="password2" value={values.password2} type="password" placeholder="Repeat Password" onChange={setValues} />
                <input className={styles.button} type="submit" value="Submit" />
                <span className={userStyle.valid}>{isUserCreatedSuccessfully ? "User is created successfully" : responseMassage}</span>
            </form>
            <div className={userStyle.footer}></div>
        </div>
    )
}

export default CreateUser