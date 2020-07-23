import React from "react"
import styles from "../style/LoginViewStyle.module.css"
import Loading from "./Loading"

function LoginView({ handleSubmit, isLoading, handleChange, username, password, status }) {
    return (
        !isLoading ? <div className={styles.container}>
            <div className={styles.header}>
                <h1>Welcome</h1>
            </div>
            <form className={styles.loginForm} onSubmit={handleSubmit}>
                {(status === 200 || status === 0) ? <label></label> : <label className={styles.error}>Bad email or password</label>}
                <input
                    className={styles.inputs}
                    type="text"
                    name="username"
                    value={username}
                    onChange={handleChange}
                    placeholder="User name"
                />
                <input
                    className={styles.inputs}
                    type="password"
                    name="password"
                    value={password}
                    onChange={handleChange}
                    placeholder="Password"
                />
                <input className={styles.button} type="submit" value="LOGIN" />
            </form>
            <div className={styles.footer}>
                <p>Don't have an account? <a href="/createUser">Sing up</a></p>
            </div>
        </div> :
            <Loading />
    )
}

export default LoginView