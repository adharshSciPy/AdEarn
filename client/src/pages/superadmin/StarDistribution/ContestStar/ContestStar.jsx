import React, { useState } from "react";
import styles from "./../../ContestAccount/Contest.module.css";
import SuperSidebar from "../../../../components/SuperAdminSideBar/SuperSidebar";
import Header from "../../../../components/Header/Header";
import { Button, Modal, Input } from "antd";
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

  const transactions = [
    {
      id: 1,
      name: "Ad Earn",
      entryStars: 5,
      contestStatus: "Ongoing",
      totalStars: 500,
      adsnumber: 1,
      stars: 200,
    },
    {
      id: 2,
      name: "Ad Earn",
      entryStars: 5,
      contestStatus: "End",
      totalStars: 500,
      adsnumber: 1,
      stars: 300,
    },
    {
      id: 3,
      name: "Ad Earn",
      entryStars: 5,
      contestStatus: "Ongoing",
      totalStars: 500,
      adsnumber: 1,
      stars: 400,
    },
  ];

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
                <h1>₹ 5000</h1>
                <div className={styles.accountamountdetails}>
                  <p>Company account</p>
                  <p>+8% from yesterday</p>
                  <button className={styles.addStar} onClick={showModal}>
                    Manual Payouts
                  </button>
                </div>
              </div>
            </div>

            <div className={styles.table}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div className={styles.tabletitle}>
                  <h2>Welcome Bonus</h2>
                </div>
                <div>
                  <select
                    className={styles.monthyear}
                    style={{ marginRight: "10px" }}
                  >
                    <option key="month" value="Month">
                      Month
                    </option>
                    <option key="jan" value="jan">
                      Jan
                    </option>
                    <option key="feb" value="feb">
                      Feb
                    </option>
                    <option key="mar" value="mar">
                      Mar
                    </option>
                  </select>
                  <select className={styles.monthyear}>
                    <option key="year" value="Year">
                      Year
                    </option>
                    <option key="2024" value="2024">
                      2024
                    </option>
                    <option key="2025" value="2025">
                      2025
                    </option>
                  </select>
                </div>
              </div>

              <div className={styles.tablesection}>
                <table style={{ borderCollapse: "separate", width: "100%" }}>
                  <thead>
                    <tr>
                      <td className={styles.tableCell}>Contest</td>
                      <td className={styles.tableCell}>Ads</td>
                      <td className={styles.tableCell}>Entry Stars</td>
                      <td className={styles.tableCell}>Status</td>
                      <td className={styles.tableCell}>Winners</td>
                      <td className={styles.tableCell}>Total Stars</td>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((txn) => (
                      <tr key={txn.id}>
                        <td className={styles.tableCell}>{txn.name}</td>
                        <td className={styles.tableCell}>{txn.adsnumber}</td>
                        <td className={styles.tableCell}>{txn.entryStars}</td>
                        <td className={styles.tableCell}>
                          {txn.contestStatus}
                        </td>
                        <td className={styles.tableCell}>
                          <button className={styles.btnWinners}>Winners</button>
                        </td>
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
                          {txn.stars}
                        </td>
                      </tr>
                    ))}

                    <tr style={{ background: "#693bb8" }}>
                      <td
                        colSpan="5"

                        className={styles.tableCell}
                        style={{ fontWeight: "bold", color: "white",textAlign:"left" }}
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
                          width:"100%"
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
                        {transactions.reduce(
                          (total, txn) => total + txn.stars,
                          0
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleConfirm}>
            Confirm
          </Button>,
        ]}
      >
        <div style={{ marginTop: "20px" }}>
          <p className={styles.modalp}>Enter Payout Stars</p>
          <Input
            placeholder="Enter Stars"
            value={payoutStars}
            onChange={(e) => setPayoutStars(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
}

export default ContestStar
