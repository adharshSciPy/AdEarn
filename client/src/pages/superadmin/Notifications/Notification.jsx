import React from 'react'
import styles from "./Notification.module.css"
import SuperSidebar from "../../../components/SuperAdminSideBar/SuperSidebar"
import Header from '../../../components/Header/Header'
import { Button, Input } from 'antd'
const { TextArea } = Input;
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
                        <div className={styles.inputnotification}>
                            <TextArea rows={4} placeholder="Notification" />
                        </div>
                        <div className={styles.subbutton}>
                            <Button>Submit</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Notification