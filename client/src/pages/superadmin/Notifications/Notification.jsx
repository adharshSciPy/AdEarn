import React from 'react'
import styles from "./Notification.module.css"
import SuperSidebar from "../../../components/SuperAdminSideBar/SuperSidebar"
import Header from '../../../components/Header/Header'
import { Button } from 'antd'
function Notification() {
    return (
        <div className={styles.notificationmain}>
            <div className={styles.notificationcontainer}>
                <SuperSidebar />
                <Header />
                <div className={styles.notificationform}>
                    <div style={{ width: '100%', maxWidth: '1550px', height: '600px', padding: '30px' }} className={styles.notificationadminimage}>
                        <div className={styles.notificationhead}>
                            <h1>Notification</h1>
                            <Button>Log</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Notification