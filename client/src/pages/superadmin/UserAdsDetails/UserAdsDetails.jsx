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

    const onChange = (date, dateString) => {
        if (date) {
            setSelectedMonth(date);
        } else {
            setSelectedMonth(null);
        }
        // Reset to first page when month filter changes
        setCurrentPage(1);
    };

    useEffect(() => {
        const details = async () => {
            try {
                // For frontend filtering approach, get more data or all data
                const response = await axios.get(`${baseUrl}/api/v1/user/my-all-ads/${id}`, {
                    params: {
                        page: 1,
                        limit: 1000,
                    }
                });
                
                setData(response.data.data.ads)
                console.log(response)
            } catch (error) {
                console.log(error)
            }
        }
        details()
    }, []) // Remove dependencies since we're getting all data once

    function formatDate(dateString) {
        const date = new Date(dateString);

        if (isNaN(date)) return 'Invalid Date';

        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    }

    // Handle pagination change
    const handlePaginationChange = (page, size) => {
        setCurrentPage(page);
        if (size !== pageSize) {
            // If page size changed, reset to first page
            setCurrentPage(1);
            setPageSize(size);
        }
    };

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
                                    {/* Frontend filtering and pagination */}
                                    {data
                                        .filter((value) => {
                                            if (!selectedMonth) return true;
                                            const payoutDate = new Date(value.createdAt);
                                            return (
                                                payoutDate.getMonth() === selectedMonth.month() &&
                                                payoutDate.getFullYear() === selectedMonth.year()
                                            );
                                        })
                                        .slice((currentPage - 1) * pageSize, currentPage * pageSize) // Apply pagination
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
                            total={data
                                .filter((value) => {
                                    if (!selectedMonth) return true;
                                    const payoutDate = new Date(value.createdAt);
                                    return (
                                        payoutDate.getMonth() === selectedMonth.month() &&
                                        payoutDate.getFullYear() === selectedMonth.year()
                                    );
                                }).length} // Use filtered data count
                            showSizeChanger
                            pageSizeOptions={['10', '20', '50', '100']}
                            onChange={handlePaginationChange}
                            style={{ marginTop: "20px", textAlign: "right", display: "flex", justifyContent: "end", alignItems: "end" }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserAdsDetails