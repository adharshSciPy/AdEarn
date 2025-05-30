import React from 'react'
import styles from './StarDistributiongraph.module.css'
import SuperSidebar from '../../../components/SuperAdminSideBar/SuperSidebar'
import Header from "../../../components/Header/Header"
import { Button } from 'antd'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Color } from 'antd/es/color-picker'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function StarDistributiongraph() {
  const labels = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const data = {
    labels,
    datasets: [
      {
        label: "Ads",
        data: [12, 19, 10, 5, 2, 3, 9, 14, 7, 11, 6, 8],
        backgroundColor: "#693bb8", // Blue
        stack: 'combined',
        barThickness: 40,
      },
      {
        label: "Stars Purchased",
        data: [5, 8, 6, 4, 3, 5, 7, 6, 4, 3, 2, 4],
        backgroundColor: "cyan", // Red
        stack: 'combined',
        barThickness: 40,
        borderRadius: {
          topLeft: 6,
          topRight: 6,
          bottomLeft: 0,
          bottomRight: 0
        }
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#fff"
        }
      },
      title: {
        display: true,
        text: "Monthly Combined Ads & Star Purchases",
        color: "#fff"
      },
      tooltip: {
        bodyColor: "#fff",
        titleColor: "#fff"
      }
    },
    scales: {
      x: {
        stacked: true,
        ticks: {
          color: "#fff"
        },
        grid: {
          display: false,
          drawBorder: true,
          borderColor: "#fff"
        },
        border: {
          color: "#fff",
          width: 1
        }
      },
      y: {
        stacked: true,
        ticks: {
          color: "#fff"
        },
        grid: {
          display: false,
          drawBorder: true,
          borderColor: "#fff"
        },
        border: {
          color: "#fff",
          width: 1
        }
      }
    }
  };

  return (
    <div className={styles.stardisplaymain}>
      <div className={styles.stardisplaycontainer}>
        <SuperSidebar />
        <Header />
        <div className={styles.stardisplaygraph}>
          <div style={{ width: '100%', maxWidth: '1550px', height: '600px', padding: '30px' }} className={styles.stargraph}>
            <div className={styles.stardisplayhead}>
              <h1>Star Distribution</h1>
              <Button>Log</Button>
            </div>
            <div className={styles.stardisplaying}>
              <div className={styles.starbargraph}>
                <Bar options={options} data={data} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StarDistributiongraph