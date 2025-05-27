import React from 'react'
import styles from "./SuperadminDash.module.css"
import SuperSidebar from "../../../components/SuperAdminSideBar/SuperSidebar"
import Header from '../../../components/Header/Header'
import { DatePicker, Space } from 'antd';
import { ProjectOutlined, FileTextOutlined, TagOutlined, UserAddOutlined } from '@ant-design/icons';
import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
} from 'chart.js';
import { useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { Tabs, Table, Button, Avatar, Tag } from 'antd';

const { TabPane } = Tabs;





function SuperadminDash() {

    const navigate = useNavigate()

    ChartJS.register(
        LineElement,
        PointElement,
        CategoryScale,
        LinearScale,
        Tooltip,
        Legend
    );

    const data = {
        labels: ['16/04', '17/04', '18/04', '19/04', '20/04', '21/04', '22/04'],
        datasets: [
            {
                label: 'Total Users',
                data: [1000, 1500, 1300, 1600, 2000, 1700],
                borderColor: '#4F46E5',
                fill: false,
                tension: 0.4,
                pointRadius: 3,
            },
            {
                label: 'Ads Users',
                data: [1000, 1200, 1000, 2000, 1800, 1000],
                borderColor: '#6366F1',
                fill: false,
                tension: 0.4,
                pointRadius: 3,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: '#333',
                },
            },
        },
        scales: {
            x: {
                ticks: { color: '#666' },
                grid: { display: false },
            },
            y: {
                ticks: { color: '#666' },
                grid: { color: '#eee' },
            },
        },
    };


    const onChange = (date, dateString) => {
        console.log(date, dateString);
    };

    const columns = [
        {
            title: 'Users',
            dataIndex: 'user',
            render: (text, record) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Avatar src={record.avatar} />
                    <div>
                        <div style={{ fontWeight: 'bold' }}>{record.name}</div>
                        <div style={{ fontSize: 12, color: '#999' }}>{record.username}</div>
                    </div>
                </div>
            )
        },
        {
            title: 'Total stars',
            dataIndex: 'stars'
        },
        {
            title: 'Referral codes',
            dataIndex: 'referral',
            render: (code, record) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div
                        style={{
                            background: record.referralColor,
                            padding: '2px 8px',
                            borderRadius: '10px',
                            minWidth: '50px'
                        }}
                    />
                    <span style={{ color: 'purple' }}>{code}</span>
                </div>
            )
        },
        {
            title: 'View ads',
            dataIndex: 'viewAds'
        },
        {
            title: 'Coupons',
            dataIndex: 'coupons'
        }
    ];

    // 👤 All Users Data
    const allUsersData = [
        {
            key: '1',
            avatar: 'https://i.pravatar.cc/100?img=1',
            name: 'User 1',
            username: 'Jason Roy',
            stars: 100,
            referral: '5 stars',
            referralColor: '#E6FFFB',
            viewAds: '5 stars',
            coupons: '5 stars'
        },
        {
            key: '2',
            avatar: 'https://i.pravatar.cc/100?img=2',
            name: 'User 2',
            username: 'Mathew Flintoff',
            stars: 200,
            referral: '5 stars',
            referralColor: '#F0F5FF',
            viewAds: '5 stars',
            coupons: '5 stars'
        }
    ];

    // 📢 Ads Users Data
    const adsUsersData = [
        {
            key: '1',
            avatar: 'https://i.pravatar.cc/100?img=3',
            name: 'User A',
            username: 'Anil Kumar',
            stars: 150,
            referral: '4 stars',
            referralColor: '#FFF7E6',
            viewAds: '4 stars',
            coupons: '3 stars'
        },
        {
            key: '2',
            avatar: 'https://i.pravatar.cc/100?img=4',
            name: 'User B',
            username: 'George Cruize',
            stars: 180,
            referral: '5 stars',
            referralColor: '#F9F0FF',
            viewAds: '5 stars',
            coupons: '4 stars'
        }
    ];


    return (
        <div className={styles.superdashmain}>
            <div className={styles.superdashcontainer}>
                <SuperSidebar />
                <Header />
                <div className={styles.superdashspace}>
                    <div style={{ width: '100%', maxWidth: '1550px', height: '600px', padding: '30px' }} className={styles.SuperCard}>
                        <div className={styles.superdashcard}>
                            <h3>Welcome back Super Admin!</h3>
                            <div className={styles.supercardsection}>
                                <div className={styles.superadminusers}>
                                    <ProjectOutlined className={styles.cardiconusers} />
                                    <h3>Users</h3>
                                    <p>Total Sales</p>
                                    <p className={styles.percentage}>+8% from yesterday</p>
                                </div>
                                <div className={styles.superadminaccounts}>
                                    <FileTextOutlined className={styles.cardiconaccounts} />
                                    <h3>Accounts</h3>
                                    <p>Total Order</p>
                                    <p className={styles.percentage}>+5% from yesterday</p>
                                </div>
                                <div className={styles.superadminstars}>
                                    <TagOutlined className={styles.cardiconstars} />
                                    <h3>Stars</h3>
                                    <p>Product Sold</p>
                                    <p className={styles.percentage}>+1,2% from yesterday</p>
                                </div>
                                <div className={styles.superadmincoupons}>
                                    <UserAddOutlined className={styles.cardiconcoupons} />
                                    <h3>Coupons</h3>
                                    <p>Total Sales</p>
                                    <p className={styles.percentage}>+0,5% from yesterday</p>
                                </div>
                                <div className={styles.superadminusers}>
                                    <ProjectOutlined className={styles.cardiconusers} />
                                    <h3>Contest</h3>
                                    <p>Total Sales</p>
                                    <p className={styles.percentage}>+8% from yesterday</p>
                                </div>
                                <div className={styles.superadminusers}>
                                    <ProjectOutlined className={styles.cardiconusers} />
                                    <h3>Subscription</h3>
                                    <p>Total Sales</p>
                                    <p className={styles.percentage}>+8% from yesterday</p>
                                </div>
                                <div className={styles.superadminusers}>
                                    <ProjectOutlined className={styles.cardiconusers} />
                                    <h3>Referral Bonus</h3>
                                    <p>Total Sales</p>
                                    <p className={styles.percentage}>+8% from yesterday</p>
                                </div>
                                <div className={styles.superadminstars}>
                                    <TagOutlined className={styles.cardiconstars} />
                                    <h3>Welcome Bonus</h3>
                                    <p>Total Sales</p>
                                    <p className={styles.percentage}>+8% from yesterday</p>
                                </div>
                                <div className={styles.superadminusers}>
                                    <ProjectOutlined className={styles.cardiconusers} />
                                    <h3>Admin</h3>
                                    <p>Total Sales</p>
                                    <p className={styles.percentage}>+8% from yesterday</p>
                                </div>
                                <div className={styles.superadmincoupons}>
                                    <UserAddOutlined className={styles.cardiconcoupons} />
                                    <h3>Report & Analysis</h3>
                                    <p>Total Sales</p>
                                    <p className={styles.percentage}>+8% from yesterday</p>
                                </div>
                                <div className={styles.superadminusers}>
                                    <ProjectOutlined className={styles.cardiconusers} />
                                    <h3>Settings</h3>
                                    <p>Total Sales</p>
                                    <p className={styles.percentage}>+8% from yesterday</p>
                                </div>
                            </div>
                        </div>
                        <div className={styles.superadmingraph}>
                            <div className={styles.supergraphsection}>
                                <div className={styles.graphheading}>
                                    <h5>Total Users & Ads Users</h5>
                                    <h6>Overview of users</h6>
                                </div>
                                <div className={styles.actionbuttons}>
                                    <DatePicker onChange={onChange} picker="month" />
                                </div>
                            </div>
                            <div style={{ width: '100%', height: '420px' }}>
                                <Line data={data} options={options} />
                            </div>
                        </div>
                        <div style={{ marginBottom: "50px" }}>
                            <h2>All Users</h2>
                            <Tabs defaultActiveKey="1" size="large">
                                <TabPane
                                    tab={<Button shape="round">All Users</Button>}
                                    key="1"
                                >
                                    <Table columns={columns} dataSource={allUsersData} pagination={false} />
                                </TabPane>
                                <TabPane
                                    tab={<Button shape="round">Ads Users</Button>}
                                    key="2"
                                >
                                    <Table columns={columns} dataSource={adsUsersData} pagination={false} />
                                </TabPane>
                            </Tabs>
                        </div>
                        <div className={styles.seemore}>
                            <Button onClick={() => navigate("/superadminadsuser")}>See more</Button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default SuperadminDash