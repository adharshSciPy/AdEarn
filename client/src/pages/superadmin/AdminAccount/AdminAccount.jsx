import React, { useState, useEffect, useRef } from "react";
import styles from "./adminAcc.module.css";
import Sidebar from "../../../components/SuperAdminSideBar/SuperSidebar";

const allPayoutRequests = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  name: `User name ${i + 1}`,
  avatar: `https://api.dicebear.com/7.x/thumbs/svg?seed=User${i + 1}`,
  amount: 1000,
  date: "02/06/2025",
  status: "Disabled",
}));
function AdminAccount() {
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [payoutAmount, setPayoutAmount] = useState("");
  const [visibleCount, setVisibleCount] = useState(10);
  const observerRef = useRef();

  const handleApprove = (user) => {
    setSelectedUser(user);
    setShowModal(true);
    setPayoutAmount(user.amount);
  };

  const handleConfirm = () => {
    console.log(`Payout approved for ${selectedUser.name}: ₹${payoutAmount}`);
    setShowModal(false);
    setPayoutAmount("");
  };

  const lastRowRef = useRef();

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          visibleCount < allPayoutRequests.length
        ) {
          setVisibleCount((prev) => prev + 20);
        }
      },
      { threshold: 1 }
    );
    if (lastRowRef.current) observerRef.current.observe(lastRowRef.current);
  }, [visibleCount]);

  return (
    <div className={styles.UserAccount}>
      <Sidebar />
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h2>Admin Account</h2>
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
            <button>payout</button>
          </div>
        </div>

        <div className={styles.requestsHeader}>
          <h3>User Distribution Details</h3>
          <button className={styles.exportBtn}>Export</button>
        </div>

        <div className={styles.table}>
          <div className={styles.tableHeader}>
            <div>User name</div>
            <div>Total Ads</div>
            <div>Amount</div>
            <div>Date</div>
            <div>Total Amount</div>
          </div>

          {allPayoutRequests.slice(0, visibleCount).map((user, index, arr) => (
            <div
              className={styles.tableRow}
              key={user.id}
              ref={index === arr.length - 1 ? lastRowRef : null}
            >
              <div className={styles.userCell}>
                <img src={user.avatar} alt="avatar" className={styles.avatar} />
                <span>{user.name}</span>
              </div>
              <div>1</div>
              <div>{user.amount}</div>
              <div>{user.date}</div>
              <div>{user.amount}</div>

              <div></div>
            </div>
          ))}
        </div>

        {showModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <h3>Enter payout amount</h3>
              <input
                type="number"
                value={payoutAmount}
                onChange={(e) => setPayoutAmount(e.target.value)}
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

export default AdminAccount;
