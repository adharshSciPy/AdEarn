import React, { useEffect, useRef, useState } from "react";
import styles from "./WelcomeDistribution.module.css";
import SuperSidebar from "../../../components/SuperAdminSideBar/SuperSidebar";
import Header from "../../../components/Header/Header";
import { Button, Modal, Input } from "antd";
import { Line } from "react-chartjs-2";

const generateMockData = (count) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    bonusStatus: i % 3 === 0 ? "Not Applied" : "Applied",
    starDistribution: 5,
    totalStars: 50,
    avatar: `https://source.unsplash.com/40x40/?avatar,${i + 1}`,
  }));
};

function WelcomeBonus() {
  const allData = useRef(generateMockData(100));
  const [visibleUsers, setVisibleUsers] = useState([]);
  const loader = useRef(null);
  const loadCount = 10;

  const loadMore = () => {
    setVisibleUsers((prev) =>
      allData.current.slice(0, prev.length + loadCount)
    );
  };

  useEffect(() => {
    loadMore();
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { threshold: 1 }
    );
    if (loader.current) observer.observe(loader.current);
    return () => observer.disconnect();
  }, []);

  const totalStars = visibleUsers.reduce(
    (sum, user) => sum + user.totalStars,
    0
  );

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
              <h1>Welcome Bonus</h1>
            </div>
            <div className={styles.totalamountsection}>
              <div className={styles.accountsheadsection}>
                <div className="">
                  <h1>Total Stars</h1>
                  <button
                    className={styles.addStar}
                    style={{ backgroundColor: "#E3B616", marginTop: "20px" }}
                  >
                    Change Star Distribution
                  </button>
                </div>
                <h1>₹ 5000</h1>
                <div className={styles.accountamountdetails}>
                  <p>Company account</p>
                  <p>+8% from yesterday</p>
                  <button className={styles.addStar} onClick={showModal}>
                    Add Stars
                  </button>
                </div>
              </div>
            </div>

            <div className={styles.container}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Users</th>
                    <th>Bonus status</th>
                    <th>Star distribution</th>
                    <th>Total Stars</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleUsers.map((user) => (
                    <tr key={user.id}>
                      <td className={styles.userCell}>
                        <img
                          src={user.avatar}
                          alt="avatar"
                          className={styles.avatar}
                        />
                        <div>
                          <div className={styles.userName}>{user.name}</div>
                          <div className={styles.userSub}>Number</div>
                        </div>
                      </td>
                      <td
                        className={
                          user.bonusStatus === "Applied"
                            ? styles.applied
                            : styles.notApplied
                        }
                      >
                        {user.bonusStatus}
                      </td>
                      <td className={styles.star}>
                        ⭐ +{user.starDistribution}
                      </td>
                      <td className={styles.star}>⭐ {user.totalStars}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {visibleUsers.length < allData.current.length && (
                <div ref={loader} className={styles.loader}>
                  Loading...
                </div>
              )}

              <div className={styles.totalRow}>
                <div>Total Stars</div>
                <div className={styles.star}>⭐ {totalStars}</div>
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
