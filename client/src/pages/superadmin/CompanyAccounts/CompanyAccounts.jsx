import React from 'react'
import styles from "./CompanyAccounts.module.css"
import SuperSidebar from "../../../components/SuperAdminSideBar/SuperSidebar"
import Header from '../../../components/Header/Header'
import { Button } from 'antd'
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Filler,
    Tooltip,
    Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Filler,
    Tooltip,
    Legend
);

function CompanyAccounts() {
    const data = {
        labels: ['0', '10k', '20k', '30k', '40k', '50k', '60k'],
        datasets: [
            {
                label: 'Total Accounts',
                data: [10, 10, 20, 35, 40, 50, 60],
                fill: true,
                backgroundColor: 'rgba(192, 132, 252, 0.2)',
                borderColor: 'rgba(192, 132, 252, 1)',
                tension: 0.4,
                pointRadius: 3
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                mode: 'index',
                intersect: false
            }
        },
        scales: {
            x: {
                grid: {
                    display: false
                }
            },
            y: {
                beginAtZero: true,
                grid: {
                    borderDash: [4, 4]
                }
            }
        }
    };
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
                        <div className={styles.companygraph}>
                            <Line data={data} options={options} />
                        </div>
                        <div className={styles.accountshead}>
                            <h1>Accounts</h1>
                        </div>
                        <div className={styles.totalamountsection}>
                            <div className={styles.accountsheadsection}>
                                <h1>Total Amount</h1>
                                <h1>₹ 5000</h1>
                                <div className={styles.accountamountdetails}>
                                    <p>Company account</p>
                                    <p>+8% from yesterday</p>
                                </div>
                            </div>
                        </div>
                        <div className={styles.estimatesection}>
                            <div className={styles.estimatelist}>
                                <ol>
                                    <li>Star Added: 2000</li>
                                    <li>Star Received: 3000</li>
                                    <li>Contest: 2000</li>
                                    <li>Coupons: 3000</li>
                                    <li>Welcome Bonus</li>
                                </ol>
                            </div>
                            <div className={styles.amountlist}>
                                <h1>Total Received: 8000</h1>
                                <h1>Total Added: 2000</h1>
                            </div>
                            <div className={styles.estimatetotal}>
                                <h1>₹ 5000</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CompanyAccounts