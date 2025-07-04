import React, { useState } from 'react'
import styles from "./CreateSubscription.module.css"
import SuperSidebar from '../../../components/SuperAdminSideBar/SuperSidebar'
import Header from '../../../components/Header/Header'
import { Button } from 'antd'
import axios from 'axios'
import baseUrl from '../../../baseurl'

function CreateSubscription() {

    const [form, setForm] = useState({
        starCountRequired: "",
        subscriptionDurationDays: ""
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            starCountRequired: form.starCountRequired,
            subscriptionDurationDays: form.subscriptionDurationDays
        };
        console.log(payload);

        try {
            const response = await axios.put(
                `${baseUrl}/api/v1/subscription/edit-subscriptions`,
                payload
            );
            console.log(response);
            setForm({
                starCountRequired: "",
                subscriptionDurationDays: ""
            });
        } catch (error) {
            console.error("Error generating coupons:", error);
            // toast.error(error?.response?.data?.message || "Failed to generate coupons!");
        }
    };

    return (
        <div className={styles.createsubscription}>
            <div className={styles.createsubscriptionmain}>
                <SuperSidebar />
                <Header />
                <div className={styles.subscriptionform}>
                    <div style={{ width: '100%', maxWidth: '1550px', height: '600px', padding: '30px' }} className={styles.AdsSection}>

                        <div className={styles.subscribelayout}>
                            <div className={styles.subscribesection}>
                                <div className={styles.formSubscribe}>
                                    <h2>Subscription Plan</h2>
                                    <input type='number' name='starCountRequired' value={form.starCountRequired} placeholder='Enter Star Count' onChange={handleChange} />
                                    <input type='number' name='subscriptionDurationDays' value={form.subscriptionDurationDays} placeholder='Subscription Duration' onChange={handleChange} />
                                    <Button style={{ backgroundColor: "#4f2cc9", color: "white" }} onClick={handleSubmit}>Submit</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateSubscription