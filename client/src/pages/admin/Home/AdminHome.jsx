import React, { useState } from 'react'
import styles from './adminhome.module.css'
import Sidebar from '../../../components/sidebar/Sidebar'
import Header from '../../../components/Header/Header'
import CanvasJSReact from '@canvasjs/react-charts';
import { Notepad } from "@phosphor-icons/react";
import { FileTextOutlined, TagOutlined, UserAddOutlined, ProjectOutlined } from "@ant-design/icons"

const CanvasJSChart = CanvasJSReact.CanvasJSChart;


function AdminHome() {
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
  return (
    <div className={styles.adminmain}>
      <div className={styles.admincontainermain}>
        <Sidebar />
        <Header />
        <div className={styles.chart}>
          <div style={{ width: '100%', maxWidth: '1550px', height: '450px', padding: '30px' }} className={styles.spline}>
            <CanvasJSChart options={options} />
          </div>
          <div style={{ width: '100%', maxWidth: '1550px', height: 'auto', padding: '30px', gap:'10px' }} className={styles.cards}>
            <div className={styles.cardone}>
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
            <div className={styles.cardtwo}>
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
            <div className={styles.cardthree}>
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
            <div className={styles.cardfour}>
              <div className={styles.cardfourTop}></div>
              <div className={styles.iconWrapper}>
                <div className={styles.iconCircleBlue}>
                  <ProjectOutlined style={{ fontSize: 20, color: 'white' }} />
                </div>
              </div>
              <h3>Gallery</h3>
              <h6>Total Sales</h6>
              <p>+8% from yesterday</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminHome