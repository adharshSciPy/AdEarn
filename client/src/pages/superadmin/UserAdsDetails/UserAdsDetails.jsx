import React, { useState, useEffect } from 'react'
import styles from "./UserAdsDetails.module.css"
import Header from '../../../components/Header/Header'
import SuperSidebar from "../../../components/SuperAdminSideBar/SuperSidebar"
import { DatePicker, Space, Pagination } from 'antd';
import baseUrl from '../../../baseurl';
import axios from "axios"
import { useParams } from 'react-router-dom';

function UserAdsDetails() {

    const { id } = useParams();
    const [data, setData] = useState([])
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [datacount, setCount] = useState("")

    const onChange = (date, dateString) => {
        if (date) {
            setSelectedMonth(date);
        } else {
            setSelectedMonth(null);
        }
    };


    useEffect(() => {
        const details = async () => {
            try {
                const response = await axios.get(`${baseUrl}/api/v1/user/my-all-ads/${id}`,
                    {
                        params: {
                            page: currentPage,
                            limit: pageSize,
                        }
                    });
                setData(response.data.data.ads)
                setCount(response.data.data.count)
                console.log(response)
            } catch (error) {
                console.log(error)
            }
        }
        details()
    }, [currentPage, pageSize])

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
                                        <th>Ad Title</th>
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
                                        })
                                        .map((value, index) => {
                                            const adRef = value.imageAdRef || value.videoAdRef || value.surveyAdRef || null;

                                            return (
                                                <tr key={index}>
                                                    <td>{formatDate(value.createdAt)}</td>
                                                    <td>{adRef?.title}</td>
                                                    <td>{adRef?.starCount || adRef?.totalStarsAllocated}</td>
                                                    <td>{adRef?.adVerifiedTime ? formatDate(adRef.adVerifiedTime) : "N/A"}</td>
                                                    <td>{adRef?.adExpirationTime ? formatDate(adRef.adExpirationTime) : "N/A"}</td>
                                                    <td>{adRef?.isPaymentCompleted ? "Completed" : "Pending"}</td>
                                                </tr>
                                            );
                                        })}
                                </tbody>

                            </table>
                        </div>
                        <Pagination
                            current={currentPage}
                            pageSize={pageSize}
                            total={datacount} // total transaction count
                            showSizeChanger
                            pageSizeOptions={['10', '20', '50', '100']}
                            onChange={(page, size) => {
                                setCurrentPage(page);
                                setPageSize(size);
                            }}
                            style={{ marginTop: "20px", textAlign: "right", display: "flex", justifyContent: "end", alignItems: "end" }}
                        />
                    </div>


                </div>
            </div>
        </div>
    )
}

export default UserAdsDetails

