import React, { useState, useEffect } from 'react'
import styles from "./AssignedKyc.module.css"
import Sidebar from '../../../components/sidebar/Sidebar'
import Header from '../../../components/Header/Header'
import { Button, Pagination } from 'antd';
import axios from 'axios';
import baseUrl from '../../../baseurl';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';


function AssignedKyc() {
    const navigate = useNavigate()
    const adminId = useSelector((state) => state.admin.id)
    const [assignedkyc, setAssignedkyc] = useState([])

    const handlenavigate = (id) => {
        console.log("id vannu", id)
        navigate(`/VerifyKYC/${id}`)
    }

    const verifyKyc = async (id) => {
        try {
            console.log("idid", id);

            const response = await axios.get(`${baseUrl}/api/v1/admin/kyc-requested-single-user`, {
                params: { id }
            });
            const kycData = response.data.data
            navigate(`/VerifyKYC/${id}`, { state: { kycData } });

            console.log("response", response.data.data);
        } catch (error) {
            console.error("Axios error:", error.response?.data?.message || error.message);
        }
    };

    useEffect(() => {
        console.log("admin id store", adminId)
        const assignedkyc = async () => {
            try {
                const response = await axios.get(`${baseUrl}/api/v1/admin/assigned-kyc/${adminId}`)
                setAssignedkyc(response.data.data)
                console.log("res res", response.data.data)
            } catch (error) {
                console.log(error)
            }
        }
        assignedkyc()
    }, [])

    function formatDate(isoString) {
        const date = new Date(isoString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    return (
        <div className={styles.assignadsmain}>
            <div className={styles.assignadscontainermain}>
                <Sidebar />
                <Header />
                <div className={styles.assignads}>
                    <div style={{ width: '100%', maxWidth: '1550px', height: '600px', padding: '30px' }} className={styles.AssignSection}>

                        <section className={styles.payoutTableSection}>
                            <h1 style={{ fontSize: "25px", padding: '10px' }}>Verify KYC</h1>
                            <table className={styles.payoutTable}>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>KYC Status</th>
                                        <th>Date</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {assignedkyc.map((ad) => (
                                        <tr key={ad._id}>
                                            <td>
                                                {ad.fullName}
                                            </td>
                                            <td>{ad.kycStatus}</td>
                                            <td>{formatDate(ad.updatedAt)}</td>
                                            <td>
                                                <button
                                                    className={styles.redeemBtn}
                                                    onClick={() => handlenavigate(ad.userId._id)}
                                                >
                                                    {'Verify'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}

                                </tbody>
                            </table>

                        </section>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AssignedKyc