import React, { useState, useEffect } from 'react'
import styles from "./BlacklistUser.module.css"
import axios from 'axios'
import baseUrl from "../../../baseurl"
import Header from "../../../components/Header/Header"
import SuperSidebar from "../../../components/SuperAdminSideBar/SuperSidebar"
import { Button, Pagination } from 'antd'

function BlacklistUser() {

    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);


    useEffect(() => {
        const fetchdata = async () => {
            try {
                const userdata = await axios.get(`${baseUrl}/api/v1/admin/all-users`, {
                    params: {
                        page: currentPage,
                        limit: pageSize,
                    }
                });
                console.log(userdata)
                setData(userdata.data.users)
                const filtered = userdata.data.users.filter(user => !user.isBlacklisted);
                setData(filtered);

            } catch (error) {
                console.log(error)
            }
        }
        fetchdata()
    }, [currentPage, pageSize])

    const blacklisted = async (userId) => {
        try {
            console.log("idid", userId)
            const response = await axios.patch(`${baseUrl}/api/v1/super-admin/blacklist-user`, { userId });
            setData(prev => prev.filter(user => user.isBlacklisted === false));
            console.log(response)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className={styles.blacklistuser}>
            <div className={styles.blacklistusermain}>
                <Header />
                <SuperSidebar />
                <div className={styles.blacklistusercontainer}>
                    <div style={{ width: '100%', maxWidth: '1550px', height: '600px', padding: '30px' }} className={styles.starimage}>
                        <h1>Users</h1>
                        <div className={styles.userstable}>
                            <table>
                                <thead className={styles.tableHead}>
                                    <th>User Name</th>
                                    <th>Email</th>
                                    <th>Referral Code</th>
                                    <th>Action</th>
                                </thead>
                                <tbody className={styles.tableBody}>
                                    {data.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((value, index) => (
                                        <tr key={index || value._id}>
                                            <td>{value.firstName}{" "}{value.lastName}</td>
                                            <td>{value.email}</td>
                                            <td>{value.myReferalCode}</td>
                                            <td><Button onClick={() => blacklisted(value._id)}>Blacklisted</Button></td>
                                        </tr>
                                    ))}

                                </tbody>
                            </table>
                        </div>
                        <Pagination
                            current={currentPage}
                            pageSize={pageSize}
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

export default BlacklistUser