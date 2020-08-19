import React from "react"
import Select from "react-select"


import styles from "../style/AdminPanelStyle.module.css"
import { useState } from "react"
import { useEffect } from "react";

function AdminPanel({ token, username }) {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [search, setSearch] = useState([]);

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

        let roleTable = [];

        if (labelsList || labelsList !== null) {
            labelsList.forEach(label => {
                roleTable.push(roles.find(role => role.role === label.label))
            });
        }

        const usersCopy = findUser(id, "authorities", roleTable)

        setUsers(usersCopy)
    }

    const findUser = (id, name, value) => {
        const index = findUserIndex(id)
        let usersCopy = Array.from(users);
        usersCopy[index] = { ...usersCopy[index], [name]: value }
        return usersCopy
    }
    const findUserIndex = (id) => {
        const foundUser = users.find(user => user.user_id == id)
        const index = users.indexOf(foundUser)
        return index
    }


    const handleUpdateUser = async (id) => {
        const url = `http://localhost:8080/user/${id}`
        const response = await fetch(url, {
            method: "PUT",
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(users[findUserIndex(id)])
        })
        console.log(response.status)
    }

    const handleDeleteUser = async (id) => {
        const url = `http://localhost:8080/user/${id}`
        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                'Authorization': token,
            },
        })
        console.log(response.status)
    }

    const handleSearchChange = ({ target }) => {
        const { value } = target
        setSearch(value)
    }

    const handleSearchClick = () => {
        const regex = `[a-z]*(${search})[a-z]*`
        const filteredUsers = users.filter((user) => { return user.username.search(regex) !== -1 })
        setUsers(filteredUsers)
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Admin Panel</h1>
            <h1>Current User: {username}</h1>
            <div className={styles.searchContainer}>
                <label htmlFor="searchUser">Search User: </label>
                <input id="searchUser" type="text" name="searchUser" value={search} onChange={handleSearchChange} />
                <button className={styles.searchButton} onClick={handleSearchClick}>Search</button>
            </div>
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
                        <th>Update</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => {
                        return <tr key={user.user_id}>
                            <td>{user.user_id}</td>
                            <td>{user.username}</td>
                            <td>
                                <input className={user.user_id}
                                    key={user.user_id + "accountNonExpired"}
                                    name="accountNonExpired"
                                    type="checkbox"
                                    checked={user.accountNonExpired}
                                    onChange={handleChange} />
                            </td>
                            <td>
                                <input
                                    className={user.user_id}
                                    key={user.user_id + "accountNonLocked"}
                                    name="accountNonLocked"
                                    type="checkbox"
                                    checked={user.accountNonLocked}
                                    onChange={handleChange} />
                            </td>
                            <td>
                                <input
                                    className={user.user_id}
                                    key={user.user_id + "credentialsNonExpired"}
                                    name="credentialsNonExpired"
                                    type="checkbox"
                                    checked={user.credentialsNonExpired}
                                    onChange={handleChange} />
                            </td>
                            <td>
                                <input
                                    className={user.user_id}
                                    key={user.user_id + "enabled"}
                                    name="enabled"
                                    type="checkbox"
                                    checked={user.enabled}
                                    onChange={handleChange} />
                            </td>
                            <td>
                                <Select
                                    key={user.user_id + "select"}
                                    isMulti={true}
                                    value={user.authorities.map(mapRoleLabels)}
                                    onChange={(event, event2) => handleSelectChange(event, event2, user.user_id)}
                                    options={roles.map(mapRoleLabels)} />
                            </td>
                            <td>
                                <button onClick={(event) => handleUpdateUser(user.user_id)}>Update</button>
                            </td>
                            <td>
                                <button onClick={(event) => handleDeleteUser(user.user_id)}>Delete</button>
                            </td>
                        </tr>
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default AdminPanel