import React, { useState } from "react";
import styles from "../../WelcomeBonus/Welcome.module.css";
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

function WelcomeBonus() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(Date.now());

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
    setFileInputKey(Date.now()); // reset file input
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
    { id: 1, name: "ad earn", stars: 200 },
    { id: 2, name: "ad earn", stars: 300 },
    { id: 3, name: "ad earn", stars: 400 },
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
            <div className={styles.accountshead}>
              <h1>Referal Star</h1>
            </div>
            <div className={styles.totalamountsection}>
              <div className={styles.accountsheadsection}>
                <h1>Total Star</h1>
                <h1>5000 <svg
                            width="30"
                            height="30"
                            viewBox="0 0 24 24"
                            fill="gold"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M12 2L14.9 8.6L22 9.2L17 14L18.5 21L12 17.3L5.5 21L7 14L2 9.2L9.1 8.6L12 2Z" />
                          </svg></h1>
                <div className={styles.accountamountdetails}>
                  <p>Company account</p>
                  <p>+8% from yesterday</p>
                  <button className={styles.addStar} onClick={showModal}>
                    Add Stars
                  </button>
                </div>
              </div>
            </div>

            <div className={styles.table}>
              <div style={{ display: "flex",justifyContent:"space-between" }}>
                <div className={styles.tabletitle}>
                  <h2>Welcome Bonus </h2>
                </div>
                <div className="">
                  <select className={styles.monthyear} style={{marginRight:"10px"}}>
                    <option value="Month"> Month</option>
                    <option value="jan">Jan</option>
                    <option value="feb">Feb</option>
                    <option value="march">Mar</option>


                  </select>
                  <select className={styles.monthyear}>
                    <option value="Month"> Year</option>
                    <option value="jan">Jan</option>
                    <option value="feb">Feb</option>
                    <option value="march">Mar</option>


                  </select>
                </div>
              </div>
              <div className={styles.tablesection}>
                <table style={{ borderCollapse: "separate", width: "100%" }}>
                  <thead>
                    <tr>
                      <td style={{ textAlign: "left", padding: "12px" }}>
                        Users
                      </td>
                      <td style={{ textAlign: "left", padding: "12px" }}>
                        Stars
                      </td>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((txn) => (
                      <tr key={txn.id}>
                        <td style={{ textAlign: "left", padding: "12px" }}>
                          {txn.name}
                        </td>
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
                          {txn.stars}
                        </td>
                      </tr>
                    ))}

                    {/* Total row */}
                    <tr style={{ background: "#693bb8" }}>
                      <td
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
        title={<span style={{ color: "#3563E9" }}>Place Sponsored Ads</span>}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary">
            Confirm
          </Button>,
        ]}
      >
        <p className={styles.modalp}>Enter stars to manual add</p>
        <div className={styles.imageUploadBox}>
          <input
            type="file"
            id="upload"
            hidden
            accept="image/*"
            onChange={handleImageChange}
            key={fileInputKey}
          />
          <label htmlFor="upload" className={styles.uploadLabel}>
            Upload
          </label>
        </div>
        {previewImage && (
          <div className={styles.imagePreview}>
            <img src={previewImage} alt="Preview" />
          </div>
        )}

        <div style={{ marginTop: "20px" }}>
          <p className={styles.modalp}>Total Amount</p>
          <Input placeholder="Enter amount" />
        </div>
        <div style={{ marginTop: "20px" }}>
          <p className={styles.modalp}>Star Distribution</p>
          <Input placeholder="Enter distribution" />
        </div>
      </Modal>
    </div>
  );
}

export default WelcomeBonus;
