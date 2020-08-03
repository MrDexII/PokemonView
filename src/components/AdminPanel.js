import React from "react"

import styles from "../style/AdminPanelStyle.module.css"
import { useState } from "react"
import { useEffect } from "react";

function AdminPanel({ token }) {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        getAllUsers()
    }, [])

    async function getAllUsers() {
        const url = "http://localhost:8080/user/"
        const response = await fetch(url, {
            method: "GET",
            headers: {
                'Authorization': token,
            }
        })
        const allUser = await response.json();
        setUsers(allUser)
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Admin Panel</h1>
            {console.log(users)}
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>User name</th>
                        <th>Account non expired</th>
                        <th>Account non locked</th>
                        <th>Credentials non expired</th>
                        <th>Enabled</th>
                        {/* <th>Authorities</th> */}
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => {
                        return <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.username}</td>
                            <td>{user.accountNonExpired ? "true" : "false"}</td>
                            <td>{user.accountNonLocked ? "true" : "false"}</td>
                            <td>{user.credentialsNonExpired ? "true" : "false"}</td>
                            <td>{user.enabled ? "true" : "false"}</td>
                            {/* <td>{user.authorities}</td> */}
                        </tr>
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default AdminPanel