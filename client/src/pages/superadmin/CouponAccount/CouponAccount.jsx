import React, { useState } from "react";
import styles from "./Coupon.module.css";
import SuperSidebar from "../../../components/SuperAdminSideBar/SuperSidebar";

function CouponAccount() {
  const [showModal, setShowModal] = useState(false);
  const [couponAmount, setCouponAmount] = useState("");

  const handleConfirm = () => {
    console.log("Coupon generated for amount:", couponAmount);
    setShowModal(false);
    setCouponAmount("");
  };
  const transactions = [
    {
      id: 1,
      name: "Coupon Distribution",
      couponsGenerated: 10,
      starsDistributed: 200,
      totalStars: 5000,
      date: "2025-06-01",
    },
    {
      id: 2,
      name: "Coupon Distribution",
      couponsGenerated: 10,
      starsDistributed: 300,
      totalStars: 4700,
      date: "2025-06-02",
    },
    {
      id: 3,
      name: "Coupon Distribution",
      couponsGenerated: 10,
      starsDistributed: 150,
      totalStars: 4400,
      date: "2025-06-03",
    },
  ];

  return (
    <div className={styles.UserAccount}>
      <SuperSidebar />
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h2>Coupons Account</h2>
          <button className={styles.logBtn}>Log</button>
        </div>

        <div className={styles.amountCard}>
          <div>
            <p>Total Amount</p>
          </div>
          <div>
            <h1>₹5000</h1>
          </div>
          <div className={styles.rightText}>
            <p>Company account</p>
            <span>+8% from yesterday</span>
            <button onClick={() => setShowModal(true)}>Generate Coupons</button>
          </div>
        </div>

        <div className={styles.requestsHeader}>
          <h3>User Distribution Details</h3>
          <button className={styles.exportBtn}>Export</button>
        </div>
        <div className={styles.tablesection}>
          <table style={{ borderCollapse: "separate", width: "100%" }}>
            <thead>
              <tr>
                <td className={styles.tableCell}>Name</td>
                <td className={styles.tableCell}>Distributed To</td>
                <td className={styles.tableCell}>Stars Distributed</td>
                <td className={styles.tableCell}>Total Stars</td>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn) => (
                <tr key={txn.id}>
                  <td className={styles.tableCell}>{txn.name}</td>
                  <td className={styles.tableCell}>{txn.couponsGenerated}</td>
                  <td className={styles.tableCell}>{txn.starsDistributed}</td>
                  <td className={styles.tableCell}>{txn.totalStars}</td>
                </tr>
              ))}

              <tr style={{ background: "#693bb8" }}>
                <td
                  colSpan="3"
                  className={styles.tableCell}
                  style={{
                    fontWeight: "bold",
                    color: "white",
                    textAlign: "left",
                  }}
                >
                  Total Stars Distributed
                </td>
                <td
                  className={styles.tableCell}
                  style={{
                    fontWeight: "bold",
                    color: "white",
                    display:"flex",
                    alignItems:"center",
                    justifyContent:"center"
                  }}
                >
                  {transactions.reduce(
                    (total, txn) => total + txn.starsDistributed,
                    0
                  )}
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="gold"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 2L14.9 8.6L22 9.2L17 14L18.5 21L12 17.3L5.5 21L7 14L2 9.2L9.1 8.6L12 2Z" />
                  </svg>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <h3>Enter Star To Add Manually</h3>
              <input
                type="number"
                value={couponAmount}
                onChange={(e) => setCouponAmount(e.target.value)}
                className={styles.input}
              />
              <h3>Enter Star For Each Coupons</h3>
              <input
                type="number"
                value={couponAmount}
                onChange={(e) => setCouponAmount(e.target.value)}
                className={styles.input}
              />
              <div className={styles.modalActions}>
                <button
                  className={styles.cancel}
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button className={styles.confirm} onClick={handleConfirm}>
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CouponAccount;
