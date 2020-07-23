import React from "react"
import styles from "../style/LoadingStyle.module.css"

function Loading(){
    return(
        <div className={styles.container}>
        <div className={styles.ldsSpinner}><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
        </div>
    )
}

export default Loading