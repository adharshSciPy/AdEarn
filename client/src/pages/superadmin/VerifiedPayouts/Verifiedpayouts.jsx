import React, { useState, useEffect } from 'react'
import styles from "./VerifiedPayouts.module.css"
import Header from '../../../components/Header/Header'
import SuperSidebar from "../../../components/SuperAdminSideBar/SuperSidebar"
import axios from 'axios'
import baseUrl from '../../../baseurl'

function Verifiedpayouts() {

    useEffect(() => {
        const verifiedpayouts = async () => {
            try {
                const response = await axios.get(`${baseUrl}/api/v1/payout/all-verified/requests`);
                console.log(response)
            } catch (error) {
                console.log(error)
            }
        }
        verifiedpayouts()
    }, [])

    return (
        <div className={styles.verifiedpayouts}>
            <div className={styles.verifiedpayoutsmain}>
                <Header />
                <SuperSidebar />
                <div className={styles.verifiedpayoutcontainer}>
                    <div style={{ width: '100%', maxWidth: '1550px', height: '600px', padding: '30px' }} className={styles.SuperCard}>
                        <div className={styles.payouts}>
                            <h1>Verified Payouts</h1>
                            <div>
                                <table>
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th></th>
                                            <th></th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Verifiedpayouts