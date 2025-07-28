import React, { useState, useEffect } from "react";
import styles from "./UserStar.module.css";
import Sidebar from "../../../../components/SuperAdminSideBar/SuperSidebar";
import Header from "../../../../components/Header/Header";
import axios from "axios";
import baseUrl from "../../../../baseurl";

function UserStar() {
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [payoutAmount, setPayoutAmount] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const [getUser, setGetUser] = useState([]);
  const [total, setTotal] = useState(0);

  const handleApprove = (user) => {
    setSelectedUser(user);
    setShowModal(true);
    setPayoutAmount(user.userWalletDetails?.totalStars || 0);
  };

  const handleConfirm = () => {
    console.log(
      `Payout approved for ${selectedUser.firstName}: ₹${payoutAmount}`
    );
    setShowModal(false);
    setPayoutAmount("");
  };

  const getUserDetails = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/v1/admin/all-users`);
      setGetUser(res.data.users);
      const totalStars = res.data.users
        ?.map((user) => user.userWalletDetails?.totalStars || 0)
        .reduce((acc, curr) => acc + curr, 0);

      setTotal(totalStars);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  const totalPages = Math.ceil(getUser.length / usersPerPage);
  const paginatedUsers = getUser.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );


  return (
    <div className={styles.UserAccount}>
      <Sidebar />
      <Header />
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h2>Users Payouts</h2>
          <button className={styles.logBtn}>Log</button>
        </div>

        <div className={styles.amountCard}>
          <div>
            <p>Total Star</p>
            <h1>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="gold">
                <path d="M12 2L14.9 8.6L22 9.2L17 14L18.5 21L12 17.3L5.5 21L7 14L2 9.2L9.1 8.6L12 2Z" />
              </svg>
              {total || 0}
            </h1>
          </div>
          <div className={styles.rightText}>
            <p>Company account</p>
            <span>+8% from yesterday</span>
          </div>
        </div>

        <div className={styles.requestsHeader}>
          <h3>Payout Requests</h3>
          <button className={styles.exportBtn}>Export</button>
        </div>

        <div className={styles.table}>
          <div
            className={`${styles.tableRow} ${styles.tableHeader}`}
            style={{ backgroundColor: "#5325b5" }}
          >
            <div style={{}}>User Name</div>
            <div>Stars</div>
            {/* <div>Actions</div> */}
          </div>

          {paginatedUsers.map((user) => (
            <div className={styles.tableRow} key={user._id}>
              <div className={styles.userCell}>{user.firstName}</div>
              <div>{user.userWalletDetails?.totalStars || 0}</div>
              {/* <div>
                <button className={styles.approve} onClick={() => handleApprove(user)}>
                  Approve
                </button>
              </div> */}
            </div>
          ))}

          {/* Pagination */}
          <div className={styles.pagination}>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
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

export default UserStar;
