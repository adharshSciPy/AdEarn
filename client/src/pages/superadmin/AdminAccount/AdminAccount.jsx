import React, { useState, useEffect, useRef } from "react";
import styles from "./adminAcc.module.css";
import Sidebar from "../../../components/SuperAdminSideBar/SuperSidebar";
import axios from 'axios'
import baseUrl from "../../../baseurl"
import { Pagination } from "antd";

function AdminAccount() {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState("");
  const [stars, setStars] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);



  useEffect(() => {
    const adminAccount = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/v1/super-admin/amount/admin/total-amount`, {
          params: {
            page: currentPage,
            limit: pageSize,
          }
        });
        setTotal(response.data.totalAmountInRupees)
        setStars(response.data.transactionCount)
        setData(response.data.transactions)
      } catch (error) {
        console.log(error)
      }
    }

    adminAccount()
  }, [currentPage, pageSize])

  function formatDateTime(isoString) {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;

    return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
  }

  // Output: 11-07-2025 12:05 PM


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
            <h4>Total Amount</h4>
          </div>
          <div>
            <h1>₹{total}</h1>
          </div>
          <div className={styles.rightText}>
            <h4>Transactions Count</h4>
            <h3 style={{ textAlign: "center" }}>{stars}</h3>
          </div>
        </div>

        <div className={styles.requestsHeader}>
          <h3>Admin Transaction Details</h3>
          <button className={styles.exportBtn}>Export</button>
        </div>

        <div className={styles.table}>
          <div className={styles.tableHeader}>
            <div>User name</div>
            <div>Email</div>
            <div>Amount</div>
            <div>Date</div>
          </div>

          {data.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((user) => (
            <div
              className={styles.tableRow}
              key={user.id}
            >
              <div className={styles.userCell}>
                <span>{user.userName}</span>
              </div>
              <div>{user.userEmail}</div>
              <div>₹ {user.amountInRupees}</div>
              <div>{formatDateTime(user.date)}</div>
              <div>{user.amount}</div>
            </div>
          ))}


        </div>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={stars} // total transaction count
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

export default AdminAccount;
