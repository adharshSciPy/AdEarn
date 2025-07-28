import React, { useState, useEffect } from "react";
import styles from "./WelcomeStar.module.css";
import SuperSidebar from "../../../../components/SuperAdminSideBar/SuperSidebar";
import Header from "../../../../components/Header/Header";
import { Button, Modal, Input, Pagination } from "antd";
import axios from 'axios'
import baseUrl from "../../../../baseurl"

function WelcomeStar() {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [data, setData] = useState([])
    const [total,setTotal]=useState(0)

    useEffect(() => {
        const welcomestar = async () => {
            try {
                const response = await axios.get(`${baseUrl}/api/v1/super-admin/welcome-bonus/logs`, {
                    params: {
                        page: currentPage,
                        limit: pageSize,
                    }
                });
                setData(response.data.given)
                setTotal(response.data.remainingStars)
                console.log(response)
            } catch (error) {
                console.log(error)
            }
        }
        welcomestar()
    }, [currentPage, pageSize])

    

    function formatDateTime(isoString) {
        const date = new Date(isoString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        return `${day}-${month}-${year}`;
    }

    const totalstar = data.reduce((sum, item) => sum + (item.starsGiven) || 0, 0)

    

    return (
        <div className={styles.accountsmain}>
            <div className={styles.accountscontainer}>
                <SuperSidebar />
                <Header />
                <div className={styles.accountsgraph}>
                    <div
                        style={{
                            width: "100%",
                            maxWidth: "1550px",
                            height: "600px",
                            padding: "30px",
                        }}
                        className={styles.accountimage}
                    >
                        <div className={styles.logbutton}>
                            <Button>Log</Button>
                        </div>
                        <div className={styles.accountshead}>
                            <h1>Accounts</h1>
                        </div>
                        <div className={styles.totalamountsection}>
                            <div className={styles.accountsheadsection}>
                                <h1>Total Star</h1>
                                <h1><svg
                                    width="30"
                                    height="30"
                                    viewBox="0 0 24 24"
                                    fill="gold"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M12 2L14.9 8.6L22 9.2L17 14L18.5 21L12 17.3L5.5 21L7 14L2 9.2L9.1 8.6L12 2Z" />
                                </svg> {total || 0}</h1>
                                <div className={styles.accountamountdetails}>
                                    <p>Company account</p>
                                    <p>+8% from yesterday</p>
                                </div>
                            </div>
                        </div>

                        <div className={styles.table}>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <div className={styles.tabletitle}>
                                    <h2>Welcome Bonus </h2>
                                </div>
                            </div>
                            <div className={styles.tablesection}>
                                <table style={{ borderCollapse: "separate", width: "100%" }}>
                                    <thead>
                                        <tr>
                                            <td style={{ textAlign: "left", padding: "12px" }}>
                                                Date
                                            </td>
                                            <td style={{ textAlign: "left", padding: "12px" }}>
                                                Name
                                            </td>
                                            <td style={{ textAlign: "left", padding: "12px" }}>
                                                Stars
                                            </td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((value, index) => (
                                            <tr key={index}>
                                                <td style={{ textAlign: "left", padding: "12px" }}>
                                                    {formatDateTime(value.givenAt)}
                                                </td>
                                                <td style={{ textAlign: "left", padding: "12px" }}>{value.username}</td>
                                                <td
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "6px",
                                                        textAlign: "left",
                                                        padding: "12px",
                                                    }}
                                                >
                                                    <svg
                                                        width="20"
                                                        height="20"
                                                        viewBox="0 0 24 24"
                                                        fill="gold"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path d="M12 2L14.9 8.6L22 9.2L17 14L18.5 21L12 17.3L5.5 21L7 14L2 9.2L9.1 8.6L12 2Z" />
                                                    </svg>
                                                    {value.starsGiven}
                                                </td>
                                            </tr>
                                        ))}

                                        {/* Total row */}
                                        <tr style={{ background: "#693bb8" }}>
                                            <td
                                                colSpan={2}
                                                style={{
                                                    textAlign: "left",
                                                    padding: "12px",
                                                    fontWeight: "bold",
                                                    color: "white",
                                                }}
                                            >
                                                Total Stars
                                            </td>
                                            <td
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "6px",
                                                    textAlign: "left",
                                                    padding: "12px",
                                                    fontWeight: "bold",
                                                    borderTop: "1px solid #ddd",
                                                    color: "white",
                                                }}
                                            >
                                                <svg
                                                    width="20"
                                                    height="20"
                                                    viewBox="0 0 24 24"
                                                    fill="gold"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path d="M12 2L14.9 8.6L22 9.2L17 14L18.5 21L12 17.3L5.5 21L7 14L2 9.2L9.1 8.6L12 2Z" />
                                                </svg>
                                                {totalstar}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <Pagination
                                current={currentPage}
                                pageSize={pageSize}
                                total={data.length}
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

        </div>
    );
}

export default WelcomeStar;
