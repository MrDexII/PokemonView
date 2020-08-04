import React from "react"
import Select from "react-select"


import styles from "../style/AdminPanelStyle.module.css"
import { useState } from "react"
import { useEffect } from "react";

function AdminPanel({ token, mapTypeToLabel }) {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        getAllUsers()
        getAllRoles()
    }, [])

    async function getAllUsers() {
        const url = "http://localhost:8080/user/"
        const response = await fetch(url, {
            method: "GET",
            headers: {
                'Authorization': token
            }
        })
        let allUsers = await response.json();

        setUsers(allUsers)
    }

    async function getAllRoles() {
        const url = "http://localhost:8080/user/role/"
        const response = await fetch(url, {
            method: "GET",
            headers: {
                'Authorization': token
            }
        })
        const roles = await response.json();

        setRoles(roles)
    }

    const mapRoleLabels = role => { return { "value": role.role, "label": role.role } }

    const handleChange = ({ target }) => {
        const { name, checked } = target
        const id = target.className

        const usersCopy = findUser(id, name, checked)

        setUsers(usersCopy)
    }

    const handleSelectChange = (labelsList, event, id) => {

        let roleTable = new Array();

        labelsList.forEach(label => {
            roleTable.push(roles.find(role => role.role === label.label))
        });

        const usersCopy = findUser(id, "authorities", roleTable )

        setUsers(usersCopy)
    }

    const findUser = (id, name, value) => {
        const foundUser = users.filter(user => user.id == id)
        const index = users.indexOf(foundUser[0])
        let usersCopy = Array.from(users);
        usersCopy[index] = { ...usersCopy[index], [name]: value }

        return usersCopy
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Admin Panel</h1>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>User name</th>
                        <th>Account non expired</th>
                        <th>Account non locked</th>
                        <th>Credentials non expired</th>
                        <th>Enabled</th>
                        <th>Authorities</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => {
                        return <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.username}</td>
                            <td><input className={user.id} key={user.id + "accountNonExpired"} name="accountNonExpired" type="checkbox" checked={user.accountNonExpired} onChange={handleChange} /></td>
                            <td><input className={user.id} key={user.id + "accountNonLocked"} name="accountNonLocked" type="checkbox" checked={user.accountNonLocked} onChange={handleChange} /></td>
                            <td><input className={user.id} key={user.id + "credentialsNonExpired"} name="credentialsNonExpired" type="checkbox" checked={user.credentialsNonExpired} onChange={handleChange} /></td>
                            <td><input className={user.id} key={user.id + "enabled"} name="enabled" type="checkbox" checked={user.enabled} onChange={handleChange} /></td>
                            <td> <Select key={user.id + "select"} isMulti={true} value={user.authorities.map(mapRoleLabels)} onChange={(event, event2) => handleSelectChange(event, event2, user.id)} options={roles.map(mapRoleLabels)} /></td>
                        </tr>
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default AdminPanel