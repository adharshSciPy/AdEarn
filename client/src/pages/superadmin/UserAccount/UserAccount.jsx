import React, { useState, useEffect, useRef } from "react";
import styles from "./useraccount.module.css";
import Sidebar from "../../../components/SuperAdminSideBar/SuperSidebar";
import axios from "axios";
import baseUrl from "../../../baseurl";
import { Pagination } from "antd";
import { useNavigate } from "react-router-dom";



function UserAccount() {
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [payoutAmount, setPayoutAmount] = useState("");
  const [data, setData] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);


  const navigate = useNavigate()
  const handleVerify = async (user) => {
    setSelectedUser(user);
    const id = user.id;
    navigate(`/Superadminpayoutpage/${id}`)
    setPayoutAmount(user.amount);
  };

  useEffect(() => {
    const fetchpayoutrequest = async () => {
      try {
        const fetchresponse = await axios.get(`${baseUrl}/api/v1/payout/all-unverified/requests`, {
          params: {
            page: currentPage,
            limit: pageSize,
          }
        });
        setData(fetchresponse.data.requests)
        console.log(fetchresponse)
      } catch (error) {
        console.log(error)
      }
    }

    fetchpayoutrequest()
  }, [currentPage, pageSize]);

  const totalamount = data.reduce((sum, item) => sum + (item.amount) || 0, 0)

  function formatDateTime(isoString) {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }

  return (
    <div className={styles.UserAccount}>
      <Sidebar />
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h2>Users Payouts</h2>
          <button className={styles.logBtn}>Log</button>
        </div>

        <div className={styles.amountCard}>
          <div>
            <p>Total Amount</p>
            <h1>₹ {totalamount}</h1>
          </div>
          <div className={styles.rightText}>
            <p>Company account</p>
            <span>+8% from yesterday</span>
          </div>
        </div>

        <div className={styles.requestsHeader}>
          <h3>Payout requests</h3>
          <button className={styles.exportBtn}>Export</button>
        </div>

        <div className={styles.table}>
          <div className={styles.tableHeader}>
            <div>User name</div>
            <div>Star Count</div>
            <div>Amount</div>
            <div>Date</div>
            <div>Actions</div>
          </div>

          {data.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((user, index) => (
            <div
              className={styles.tableRow}
              key={index}
            >
              <div className={styles.userCell}>
                <span>{user.userName}</span>
              </div>
              <div>{user.starCount}</div>
              <div>{user.amount}</div>
              <div>{formatDateTime(user.requestedAt)}</div>
              <div>
                <button className={styles.approve} onClick={() => handleVerify(user)}>Verify</button>
              </div>
            </div>
          ))}
        </div>

        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={data.length} // total transaction count
          showSizeChanger
          pageSizeOptions={['10', '20', '50', '100']}
          onChange={(page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          }}
          style={{ marginTop: "20px", textAlign: "right", display: "flex", justifyContent: "end", alignItems: "end" }}
        />
      </div>
    </div>
  );
}

export default UserAccount;
