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


    const data = [
        { id: 1, Name: "Vishva", Age: 25, AdType: "Image", Status: "Verified" },
        { id: 2, Name: "Sanju", Age: 25, AdType: "Video", Status: "NotVerified" },
        { id: 3, Name: "Gokul", Age: 25, AdType: "Survey", Status: "Verified" },
        { id: 4, Name: "Adithya", Age: 24, AdType: "Video", Status: "NotVerified" },
        { id: 5, Name: "Akshay", Age: 26, AdType: "Image", Status: "Verified" }

    ]

    return (
        <div className={styles.verifiedpayouts}>
            <div className={styles.verifiedpayoutsmain}>
                <Header />
                <SuperSidebar />
                <div className={styles.verifiedpayoutcontainer}>
                    <div style={{ width: '100%', maxWidth: '1550px', height: '600px', padding: '30px' }} className={styles.SuperCard}>
                        <div className={styles.responsiveTableWrapper}>
                            <h1 style={{ margin: "20px 0", textAlign: "left" }}>Payout Summary</h1>
                            <div className={styles.tableContainer}>
                                <table className={styles.responsiveTable}>
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Age</th>
                                            <th>AdType</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.map((value, index) => (
                                            <tr key={index}>
                                                <td>{value.Name}</td>
                                                <td>{value.Age}</td>
                                                <td>{value.AdType}</td>
                                                <td>{value.Status}</td>
                                            </tr>
                                        ))}
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