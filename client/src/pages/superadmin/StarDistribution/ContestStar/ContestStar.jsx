import React, { useState, useEffect } from "react";
import styles from "./../../ContestAccount/Contest.module.css";
import SuperSidebar from "../../../../components/SuperAdminSideBar/SuperSidebar";
import Header from "../../../../components/Header/Header";
import { Button, Modal, Input, Pagination } from "antd";
import axios from "axios";
import baseUrl from "../../../../baseurl";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
  Tooltip,
  Legend
);

function ContestStar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(Date.now());
  const [payoutStars, setPayoutStars] = useState("");
  const [datacontest, setDatacontest] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const showModal = () => setIsModalOpen(true);

  const handleCancel = () => {
    setIsModalOpen(false);
    setPreviewImage(null);
    setFileInputKey(Date.now());
    setPayoutStars("");
  };

  const handleConfirm = () => {
    console.log("Payout Stars:", payoutStars);
    handleCancel(); // Close modal after confirm
  };

  const data = {
    labels: ["0", "10k", "20k", "30k", "40k", "50k", "60k"],
    datasets: [
      {
        label: "Total Accounts",
        data: [10, 10, 20, 35, 40, 50, 60],
        fill: true,
        backgroundColor: "rgba(192, 132, 252, 0.2)",
        borderColor: "rgba(192, 132, 252, 1)",
        tension: 0.4,
        pointRadius: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      x: { grid: { display: false } },
      y: {
        beginAtZero: true,
        grid: { borderDash: [4, 4] },
      },
    },
  };

  useEffect(() => {
    const conteststar = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/api/v1/super-admin/all-contests`,
          {
            params: {
              page: currentPage,
              limit: pageSize,
            },
          }
        );
        setDatacontest(response.data.contests);
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    };
    conteststar();
  }, [currentPage, pageSize]);

  const totalstar = datacontest.reduce(
    (sum, item) => sum + item.totalStarsCollected || 0,
    0
  );

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

            <div className={styles.companygraph}>
              <Line data={data} options={options} />
            </div>

            <div className={styles.accountshead}>
              <h1>Accounts</h1>
            </div>

            <div className={styles.totalamountsection}>
              <div className={styles.accountsheadsection}>
                <h1>Total Amount</h1>
                <h1>
                  {" "}
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="gold"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 2L14.9 8.6L22 9.2L17 14L18.5 21L12 17.3L5.5 21L7 14L2 9.2L9.1 8.6L12 2Z" />
                  </svg>{" "}
                  {totalstar}
                </h1>
                <div className={styles.accountamountdetails}>
                  <p>Company account</p>
                  <p>+8% from yesterday</p>
                </div>
              </div>
            </div>

            <div className={styles.table}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div className={styles.tabletitle}>
                  <h2>Contest Details</h2>
                </div>
              </div>

              <div className={styles.tablesection}>
                <table style={{ borderCollapse: "separate", width: "100%" }}>
                  <thead>
                    <tr>
                      <td className={styles.tableCell}>Contest</td>
                      <td className={styles.tableCell}>Contest Type</td>
                      <td className={styles.tableCell}>Entry Stars</td>
                      <td className={styles.tableCell}>Status</td>
                      <td className={styles.tableCell}>Total Stars</td>
                    </tr>
                  </thead>
                  <tbody>
                    {datacontest
                      .slice(
                        (currentPage - 1) * pageSize,
                        currentPage * pageSize
                      )
                      .map((value, index) => (
                        <tr key={index}>
                          <td className={styles.tableCell}>
                            {value.contestName}
                          </td>
                          <td className={styles.tableCell}>
                            {value.winnerSelectionType}
                          </td>
                          <td className={styles.tableCell}>
                            {value.entryStars}
                          </td>
                          <td className={styles.tableCell}>{value.status}</td>
                          <td
                            className={styles.tableCell}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
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
                            {value.totalStarsCollected}
                          </td>
                        </tr>
                      ))}

                    <tr style={{ background: "#693bb8" }}>
                      <td
                        colSpan="4"
                        className={styles.tableCell}
                        style={{
                          fontWeight: "bold",
                          color: "white",
                          textAlign: "left",
                        }}
                      >
                        Total Stars
                      </td>
                      <td
                        className={styles.tableCell}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          fontWeight: "bold",
                          color: "white",
                          width: "100%",
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
                <Pagination
                  current={currentPage}
                  pageSize={pageSize}
                  total={datacontest.length}
                  showSizeChanger
                  pageSizeOptions={["10", "20", "50", "100"]}
                  onChange={(page, size) => {
                    setCurrentPage(page);
                    setPageSize(size);
                  }}
                  style={{
                    marginTop: "20px",
                    textAlign: "right",
                    display: "flex",
                    justifyContent: "end",
                    alignItems: "end",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContestStar;
