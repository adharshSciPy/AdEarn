import React, { useState } from 'react'
import styles from "./StarTransfer.module.css"
import Header from "../../../components/Header/Header"
import SuperSidebar from "../../../components/SuperAdminSideBar/SuperSidebar"
import { Button, Input } from 'antd'
import axios from 'axios'
import baseUrl from '../../../baseurl'
import { ConsoleSqlOutlined } from '@ant-design/icons'
const { TextArea } = Input;


function StarTransfer() {

    const [form, setForm] = useState({
        starsTransferred: "",
        note: ""
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const submitHandler = async () => {
        const stars = Number(form.starsTransferred);

        if (!stars || stars <= 0) {
            alert("Please enter a valid number of stars greater than zero.");
            return;
        }

        try {
            const response = await axios.post(`${baseUrl}/api/v1/admin/star-transfer`, {
                stars,
                note: form.note.trim()
            });
            console.log(response)
            setForm({
                starsTransferred: "",
                note: ""
            })
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className={styles.startransfermain}>
            <div className={styles.startransfercontainer}>
                <Header />
                <SuperSidebar />
                <div className={styles.startransfer}>
                    <div style={{ width: '100%', maxWidth: '1550px', height: '600px', padding: '30px' }} className={styles.starimage}>
                        <div className={styles.startransferform}>
                            <div className={styles.transferform}>
                                <label>Star Count</label>
                                <Input type='number' name='starsTransferred' value={form.starsTransferred} placeholder='Star Count' onChange={handleChange} />
                            </div>
                            <div className={styles.transferform}>
                                <label>Note</label>
                                <TextArea rows={2} type='text' name='note' value={form.note} placeholder='Star Count' onChange={handleChange} />
                            </div>
                            <div className={styles.subbutton}>
                                <Button onClick={() => submitHandler()}>Submit</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StarTransfer