import React, { useState } from 'react'
import styles from './adminhome.module.css'
import Sidebar from '../../../components/sidebar/Sidebar'
import Header from '../../../components/Header/Header'
import CanvasJSReact from '@canvasjs/react-charts';
import { FileTextOutlined, TagOutlined, UserAddOutlined, ProjectOutlined } from "@ant-design/icons"
import { Tabs, Table, Button, Avatar, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";

const { TabPane } = Tabs;

const CanvasJSChart = CanvasJSReact.CanvasJSChart;


function AdminHome() {
  const navigate = useNavigate();
  const id = useSelector((state) => state.admin.id)
  const [selectedMonth, setSelectedMonth] = useState("All");

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const allDataPoints = [
    { x: new Date(2021, 0, 1), y1: 27, y2: 40 },
    { x: new Date(2021, 1, 1), y1: 28, y2: 42 },
    { x: new Date(2021, 2, 1), y1: 35, y2: 50 },
    { x: new Date(2021, 3, 1), y1: 45, y2: 62 },
    { x: new Date(2021, 4, 1), y1: 54, y2: 72 },
    { x: new Date(2021, 5, 1), y1: 64, y2: 80 },
    { x: new Date(2021, 6, 1), y1: 69, y2: 85 },
    { x: new Date(2021, 7, 1), y1: 68, y2: 84 },
    { x: new Date(2021, 8, 1), y1: 61, y2: 76 },
    { x: new Date(2021, 9, 1), y1: 50, y2: 64 },
    { x: new Date(2021, 10, 1), y1: 41, y2: 54 },
    { x: new Date(2021, 11, 1), y1: 33, y2: 44 }
  ];

  const filteredDataPoints = selectedMonth === "All"
    ? allDataPoints
    : allDataPoints.filter((_, index) => index === parseInt(selectedMonth));

  const options = {
    animationEnabled: true,
    theme: "light2",
    title: {
      text: "Overview of Users"
    },
    axisX: {
      valueFormatString: "MM/YY",
      intervalType: "month",
      interval: 1
    },
    axisY: {
      suffix: "K"
    },
    toolTip: {
      shared: true
    },
    legend: {
      cursor: "pointer",
      itemclick: function (e) {
        if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
          e.dataSeries.visible = false;
        } else {
          e.dataSeries.visible = true;
        }
        e.chart.render();
      }
    },
    data: [
      {
        type: "line",
        name: "Total Users",
        showInLegend: true,
        yValueFormatString: "#,##0K",
        dataPoints: filteredDataPoints.map(dp => ({ x: dp.x, y: dp.y1 }))
      },
      {
        type: "line",
        name: "Ads Users",
        showInLegend: true,
        yValueFormatString: "#,##0K",
        dataPoints: filteredDataPoints.map(dp => ({ x: dp.x, y: dp.y2 }))
      }
    ]
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
    <div className={styles.adminmain}>
      <div className={styles.admincontainermain}>
        <Sidebar />
        <Header />
        <div className={styles.chart}>
          <div style={{ width: '100%', maxWidth: '1550px', height: '450px', padding: '30px' }} className={styles.spline}>
            <CanvasJSChart options={options} />
          </div>
          <div style={{ width: '100%', maxWidth: '1550px', height: 'auto', padding: '30px', gap: '10px' }} className={styles.cards}>

            <div className={styles.cardone} onClick={() => navigate(`/AdminAds/${id}`)}>
              <div className={styles.cardoneTop}></div>
              <div className={styles.iconWrapper}>
                <div className={styles.iconCircle}>
                  <FileTextOutlined style={{ fontSize: 20, color: 'white' }} />
                </div>
                <span className={styles.countBadge}>1200</span>
              </div>
              <h3>Ads</h3>
              <h6>Total Order</h6>
              <p>+5% from yesterday</p>
            </div>
            <div className={styles.cardtwo} onClick={() => navigate(`/AdminCoupon/${id}`)}>
              <div className={styles.cardtwoTop}></div>
              <div className={styles.iconWrapper}>
                <div className={styles.iconCircleGreen}>
                  <TagOutlined style={{ fontSize: 20, color: 'white' }} />
                </div>
                <span className={styles.countBadgeGreen}>1200</span>
              </div>
              <h3>Coupons</h3>
              <h6>Product Sold</h6>
              <p>+1,2% from yesterday</p>
            </div>
            <div className={styles.cardthree} onClick={() => navigate(`/AdminKYC/${id}`)}>
              <div className={styles.cardthreeTop}></div>
              <div className={styles.iconWrapper}>
                <div className={styles.iconCirclePurple}>
                  <UserAddOutlined style={{ fontSize: 20, color: 'white' }} />
                </div>
                <span className={styles.countBadgePurple}>1200</span>
              </div>
              <h3>KYC</h3>
              <h6>New Customers</h6>
              <p>+0,5% from yesterday</p>
            </div>
            {/* <div className={styles.cardfour}>
              <div className={styles.cardfourTop}></div>
              <div className={styles.iconWrapper}>
                <div className={styles.iconCircleBlue}>
                  <ProjectOutlined style={{ fontSize: 20, color: 'white' }} />
                </div>
              </div>
              <h3>Gallery</h3>
              <h6>Total Sales</h6>
              <p>+8% from yesterday</p>
            </div> */}

            <div className={styles.allusertab}>
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
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminHome