import React from 'react'
import styles from "SelectWinner.module.css"
import SuperSidebar from "../../../components/SuperAdminSideBar/SuperSidebar"
import Header from "../../../components/Header/Header"

function SelectWinner() {
    return (
        <div className={styles.selectwinner}>
            <div className={styles.selectedwinnermain}>
                <SuperSidebar />
                <Header />
                <div className={styles.selectedcontainer}>
                    <div style={{ width: '100%', maxWidth: '1550px', height: '600px', padding: '30px' }} className={styles.contestimage}>
                        <h1>Select Contest</h1>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SelectWinner