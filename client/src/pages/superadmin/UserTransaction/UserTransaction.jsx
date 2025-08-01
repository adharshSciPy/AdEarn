import React, { useState, useEffect } from 'react'
import styles from "./UserTransaction.module.css"
import Header from '../../../components/Header/Header'
import SuperSidebar from "../../../components/SuperAdminSideBar/SuperSidebar"
import { DatePicker, Space } from 'antd';
import baseUrl from '../../../baseurl';
import axios from "axios"
import { useParams } from 'react-router-dom';

function UserTransaction() {

    const { id } = useParams();
    const [data, setData] = useState([])
    const [selectedMonth, setSelectedMonth] = useState(null);

    const onChange = (date, dateString) => {
        if (date) {
            setSelectedMonth(date);
        } else {
            setSelectedMonth(null); // Reset filter if cleared
        }
    };


    useEffect(() => {
        const details = async () => {
            try {
                const response = await axios.get(`${baseUrl}/api/v1/payout/my-payouts/verified/${id}`);
                setData(response.data.completedPayouts)
                console.log(response)
            } catch (error) {
                console.log(error)
            }
        }
        details()
    }, [])

    function formatDate(dateString) {
        const date = new Date(dateString);

        if (isNaN(date)) return 'Invalid Date';

        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    }


    return (
        <div className={styles.usertransactionmain}>
            <div className={styles.usertransactioncontainer}>
                <Header />
                <SuperSidebar />
                <div className={styles.usertransaction}>
                    <div className={styles.usertransactionsection} style={{ width: '100%', maxWidth: '1550px', height: '600px', padding: '30px' }}>
                        <h1>User Payout Details</h1>
                        <div className={styles.filterbtn}>
                            <Space direction="vertical">
                                <DatePicker onChange={onChange} picker="month" />
                            </Space>
                        </div>
                        <div style={{ overflowX: "auto" }} className={styles.tablesection}>
                            <table className={styles.transactiontable}>
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Amount</th>
                                        <th>Star Count</th>
                                        <th>Verified Date</th>
                                        <th>Payout Completion</th>
                                        <th>Payout Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data
                                        .filter((value) => {
                                            if (!selectedMonth) return true;
                                            const payoutDate = new Date(value.createdAt);
                                            return (
                                                payoutDate.getMonth() === selectedMonth.month() &&
                                                payoutDate.getFullYear() === selectedMonth.year()
                                            );
                                        }).map((value, index) => (
                                            <tr key={index}>
                                                <td>{formatDate(value.createdAt)}</td>
                                                <td>{value.amount}</td>
                                                <td>{value.starCount}</td>
                                                <td>{formatDate(value.verifiedAt)}</td>
                                                <td>{formatDate(value.payoutCompletedAt)}</td>
                                                <td>{value.payoutStatus}</td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default UserTransaction