import React, { useState, useEffect } from 'react'
import styles from "./CompanyStar.module.css"
import SuperSidebar from "../../../../components/SuperAdminSideBar/SuperSidebar"
import Header from '../../../../components/Header/Header'
import { FileTextOutlined, TagOutlined, UserAddOutlined, ProjectOutlined } from "@ant-design/icons"
import { Button } from 'antd'
import axios from 'axios'
import baseUrl from '../../../../baseurl'


function CompanyStar() {

    const [data, setData] = useState([]);
    const [received, setReceived] = useState(0);
    const [spent, setSpent] = useState(0);


    useEffect(() => {
        const companyStar = async () => {
            try {
                const response = await axios.get(`${baseUrl}/api/v1/super-admin/superadmin-wallet`);
                console.log("response", response)
                setData(response.data)

            } catch (error) {
                console.log(error)
            }
        }
        companyStar()
    }, [])

    useEffect(() => {
        const fetchAmounts = async () => {
            try {
                const [spentRes, receivedRes] = await Promise.all([
                    axios.get(`${baseUrl}/api/v1/super-admin/total-stars/given`),
                    axios.get(`${baseUrl}/api/v1/super-admin/total-stars/received`)
                ]);

                const spentAmount = spentRes?.data?.totalStarsGiven || 0;
                const receivedAmount = receivedRes?.data?.totalStarsReceived || 0;

                setSpent(spentAmount);
                setReceived(receivedAmount);

                console.log("Spent Amount:", spentRes);
                console.log("Received Amount:", receivedRes);
            } catch (error) {
                console.error("Error fetching amounts:", error);
            }
        };

        fetchAmounts();
    }, []);


    return (
        <div className={styles.accountsmain}>
            <div className={styles.accountscontainer}>
                <SuperSidebar />
                <Header />
                <div className={styles.accountsgraph}>
                    <div style={{ width: '100%', maxWidth: '1550px', height: '600px', padding: '30px' }} className={styles.accountimage}>
                        <div className={styles.logbutton}>
                            <Button>Log</Button>
                        </div>

                        <div className={styles.accountshead}>
                            <h1>Accounts</h1>
                        </div>
                        <div className={styles.totalamountsection}>
                            <div className={styles.accountsheadsection}>
                                <h1>Total Star</h1>
                                <h1>
                                    <svg
                                        width="30"
                                        height="30"
                                        viewBox="0 0 24 24"
                                        fill="gold"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M12 2L14.9 8.6L22 9.2L17 14L18.5 21L12 17.3L5.5 21L7 14L2 9.2L9.1 8.6L12 2Z" />
                                    </svg> 5000</h1>
                                <div className={styles.accountamountdetails}>
                                    <p>Company account</p>
                                    <p>+8% from yesterday</p>
                                </div>
                            </div>
                        </div>
                        <div className={styles.estimatesection}>
                            <div className={styles.estimatelist}>
                                <ol>
                                    <li>Star Given: {spent}</li>
                                    <li>Star Received: {received}</li>
                                    <li>Contest: {data.contestCollectedStars}</li>
                                    <li>Coupons: {data.couponGenerationTotalStars}</li>
                                    <li>Welcome Bonus: {data.welcomeBonusLogsTotalStars}</li>
                                </ol>
                            </div>
                            <div className={styles.amountlist}>
                                <h1>Total Received: {received}</h1>
                                <h1>Total Given: {spent}</h1>
                            </div>
                            <div className={styles.estimatetotal}>
                                <h1><svg
                                    width="30"
                                    height="30"
                                    viewBox="0 0 24 24"
                                    fill="gold"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M12 2L14.9 8.6L22 9.2L17 14L18.5 21L12 17.3L5.5 21L7 14L2 9.2L9.1 8.6L12 2Z" />
                                </svg> {received - spent}</h1>
                            </div>
                        </div>

                        <div className={styles.cards}>
                            <div className={styles.cardone}>
                                <div className={styles.cardoneTop}></div>
                                <div className={styles.iconWrapper}>
                                    <div className={styles.iconCircle}>
                                        <FileTextOutlined style={{ fontSize: 20, color: 'white' }} />
                                    </div>

                                </div>
                                <h3>Ads</h3>
                                <h4
                                    style={{
                                        display: "flex", justifyContent: "start", alignItems: "center", textAlign: "center"
                                    }}><svg
                                        width="20"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="gold"
                                        xmlns="http://www.w3.org/2000/svg"
                                        style={{ verticalAlign: "middle", margin: "0px" }}
                                    >
                                        <path d="M12 2L14.9 8.6L22 9.2L17 14L18.5 21L12 17.3L5.5 21L7 14L2 9.2L9.1 8.6L12 2Z" />
                                    </svg> {data.adExtraDeductionsTotalStars}</h4>
                                <p>+5% from yesterday</p>
                            </div>
                            <div className={styles.cardthree}>
                                <div className={styles.cardthreeTop}></div>
                                <div className={styles.iconWrapper}>
                                    <div className={styles.iconCirclePurple}>
                                        <UserAddOutlined style={{ fontSize: 20, color: 'white' }} />
                                    </div>
                                </div>
                                <h3>Users</h3>
                                <h4 style={{
                                    display: "flex", justifyContent: "start", alignItems: "center", textAlign: "center"
                                }}><svg
                                    width="20"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="gold"
                                    xmlns="http://www.w3.org/2000/svg"
                                    style={{ verticalAlign: "middle", margin: "0px" }}

                                >
                                        <path d="M12 2L14.9 8.6L22 9.2L17 14L18.5 21L12 17.3L5.5 21L7 14L2 9.2L9.1 8.6L12 2Z" />
                                    </svg> {data.userEntryTotalStars}</h4>
                                <p>+0,5% from yesterday</p>
                            </div>
                            <div className={styles.cardfour}>
                                <div className={styles.cardfourTop}></div>
                                <div className={styles.iconWrapper}>
                                    <div className={styles.iconCircleBlue}>
                                        <ProjectOutlined style={{ fontSize: 20, color: 'white' }} />
                                    </div>
                                </div>
                                <h3>Payouts</h3>
                                <h4 style={{
                                    display: "flex", justifyContent: "start", alignItems: "center", textAlign: "center"
                                }}><svg
                                    width="20"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="gold"
                                    xmlns="http://www.w3.org/2000/svg"
                                    style={{ verticalAlign: "middle", margin: "0px" }}

                                >
                                        <path d="M12 2L14.9 8.6L22 9.2L17 14L18.5 21L12 17.3L5.5 21L7 14L2 9.2L9.1 8.6L12 2Z" />
                                    </svg> demo</h4>
                                <p>+8% from yesterday</p>
                            </div>
                            <div className={styles.cardfour}>
                                <div className={styles.cardfourTop}></div>
                                <div className={styles.iconWrapper}>
                                    <div className={styles.iconCircleBlue}>
                                        <ProjectOutlined style={{ fontSize: 20, color: 'white' }} />
                                    </div>
                                </div>
                                <h3>Company</h3>
                                <h4 style={{
                                    display: "flex", justifyContent: "start", alignItems: "center", textAlign: "center"
                                }}><svg
                                    width="20"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="gold"
                                    xmlns="http://www.w3.org/2000/svg"
                                    style={{ verticalAlign: "middle", margin: "0px" }}

                                >
                                        <path d="M12 2L14.9 8.6L22 9.2L17 14L18.5 21L12 17.3L5.5 21L7 14L2 9.2L9.1 8.6L12 2Z" />
                                    </svg> {data.totalStars}</h4>
                                <p>+8% from yesterday</p>
                            </div>
                            <div className={styles.cardone}>
                                <div className={styles.cardoneTop}></div>
                                <div className={styles.iconWrapper}>
                                    <div className={styles.iconCircle}>
                                        <FileTextOutlined style={{ fontSize: 20, color: 'white' }} />
                                    </div>

                                </div>
                                <h3>Admin</h3>
                                <h4 style={{
                                    display: "flex", justifyContent: "start", alignItems: "center", textAlign: "center"
                                }}><svg
                                    width="20"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="gold"
                                    xmlns="http://www.w3.org/2000/svg"
                                    style={{ verticalAlign: "middle", margin: "0px" }}

                                >
                                        <path d="M12 2L14.9 8.6L22 9.2L17 14L18.5 21L12 17.3L5.5 21L7 14L2 9.2L9.1 8.6L12 2Z" />
                                    </svg> demo</h4>
                                <p>+5% from yesterday</p>
                            </div>
                            <div className={styles.cardfour}>
                                <div className={styles.cardfourTop}></div>
                                <div className={styles.iconWrapper}>
                                    <div className={styles.iconCircleBlue}>
                                        <ProjectOutlined style={{ fontSize: 20, color: 'white' }} />
                                    </div>
                                </div>
                                <h3>Welcome Bonus</h3>
                                <h4 style={{
                                    display: "flex", justifyContent: "start", alignItems: "center", textAlign: "center"
                                }}><svg
                                    width="20"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="gold"
                                    xmlns="http://www.w3.org/2000/svg"
                                    style={{ verticalAlign: "middle", margin: "0px" }}

                                >
                                        <path d="M12 2L14.9 8.6L22 9.2L17 14L18.5 21L12 17.3L5.5 21L7 14L2 9.2L9.1 8.6L12 2Z" />
                                    </svg> {data.welcomeBonusLogsTotalStars}</h4>
                                <p>+8% from yesterday</p>
                            </div>
                            <div className={styles.cardthree}>
                                <div className={styles.cardthreeTop}></div>
                                <div className={styles.iconWrapper}>
                                    <div className={styles.iconCirclePurple}>
                                        <UserAddOutlined style={{ fontSize: 20, color: 'white' }} />
                                    </div>
                                </div>
                                <h3>Referral Bonus</h3>
                                <h4 style={{
                                    display: "flex", justifyContent: "start", alignItems: "center", textAlign: "center"
                                }}><svg
                                    width="20"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="gold"
                                    xmlns="http://www.w3.org/2000/svg"
                                    style={{ verticalAlign: "middle", margin: "0px" }}

                                >
                                        <path d="M12 2L14.9 8.6L22 9.2L17 14L18.5 21L12 17.3L5.5 21L7 14L2 9.2L9.1 8.6L12 2Z" />
                                    </svg> demo</h4>
                                <p>+0,5% from yesterday</p>
                            </div>
                            <div className={styles.cardtwo}>
                                <div className={styles.cardtwoTop}></div>
                                <div className={styles.iconWrapper}>
                                    <div className={styles.iconCircleGreen}>
                                        <TagOutlined style={{ fontSize: 20, color: 'white' }} />
                                    </div>

                                </div>
                                <h3>Contest</h3>
                                <h4 style={{
                                    display: "flex", justifyContent: "start", alignItems: "center", textAlign: "center"
                                }}><svg
                                    width="20"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="gold"
                                    xmlns="http://www.w3.org/2000/svg"
                                    style={{ verticalAlign: "middle", margin: "0px" }}

                                >
                                        <path d="M12 2L14.9 8.6L22 9.2L17 14L18.5 21L12 17.3L5.5 21L7 14L2 9.2L9.1 8.6L12 2Z" />
                                    </svg> {data.contestCollectedStars}</h4>
                                <p>+1,2% from yesterday</p>
                            </div>
                            <div className={styles.cardthree}>
                                <div className={styles.cardthreeTop}></div>
                                <div className={styles.iconWrapper}>
                                    <div className={styles.iconCirclePurple}>
                                        <UserAddOutlined style={{ fontSize: 20, color: 'white' }} />
                                    </div>
                                </div>
                                <h3>Coupons</h3>
                                <h4 style={{
                                    display: "flex", justifyContent: "start", alignItems: "center", textAlign: "center"
                                }}><svg
                                    width="20"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="gold"
                                    xmlns="http://www.w3.org/2000/svg"
                                    style={{ verticalAlign: "middle", margin: "0px" }}

                                >
                                        <path d="M12 2L14.9 8.6L22 9.2L17 14L18.5 21L12 17.3L5.5 21L7 14L2 9.2L9.1 8.6L12 2Z" />
                                    </svg> {data.couponGenerationTotalStars}</h4>
                                <p>+0,5% from yesterday</p>
                            </div>
                            <div className={styles.cardfour}>
                                <div className={styles.cardfourTop}></div>
                                <div className={styles.iconWrapper}>
                                    <div className={styles.iconCircleBlue}>
                                        <ProjectOutlined style={{ fontSize: 20, color: 'white' }} />
                                    </div>
                                </div>
                                <h3>Subscription</h3>
                                <h4 style={{
                                    display: "flex", justifyContent: "start", alignItems: "center", textAlign: "center"
                                }}><svg
                                    width="20"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="gold"
                                    xmlns="http://www.w3.org/2000/svg"
                                    style={{ verticalAlign: "middle", margin: "0px" }}

                                >
                                        <path d="M12 2L14.9 8.6L22 9.2L17 14L18.5 21L12 17.3L5.5 21L7 14L2 9.2L9.1 8.6L12 2Z" />
                                    </svg> {data.subscriptionStarsUsed}</h4>
                                <p>+8% from yesterday</p>
                            </div>
                        </div>

                        <div className={styles.table}>
                            <div className={styles.tabletitle}>
                                <h2>Recent Transactions</h2>
                            </div>
                            <div className={styles.tablesection}>
                                <table>
                                    <thead>
                                        <tr>
                                            <td>Redeem star count</td>
                                            <td>Amount</td>
                                            <td>Export</td>
                                            <td>Delete</td>
                                        </tr>
                                    </thead>
                                    {/* <tbody>
                                        {transactions.map((txn) => (
                                            <tr key={txn.id}>
                                                <td>{txn.stars}</td>
                                                <td><svg
                                                    width="20"
                                                    height="18"
                                                    viewBox="0 0 24 24"
                                                    fill="gold"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path d="M12 2L14.9 8.6L22 9.2L17 14L18.5 21L12 17.3L5.5 21L7 14L2 9.2L9.1 8.6L12 2Z" />
                                                </svg> {txn.amount}</td>
                                                <td><a href="#">Download</a></td>
                                                <td>
                                                    <button
                                                        onClick={() => console.log(`Delete transaction ${txn.id}`)}
                                                        style={{
                                                            background: 'transparent',
                                                            border: 'none',
                                                            color: 'red',
                                                            cursor: 'pointer',
                                                            fontSize: '16px'
                                                        }}
                                                    >
                                                        🗑
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody> */}
                                </table>
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </div >
    )
}

export default CompanyStar