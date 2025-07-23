import React, { useState, useEffect } from "react";
import styles from "./Subscription.module.css";
import SuperSidebar from "../../../components/SuperAdminSideBar/SuperSidebar";
import axios from "axios";
import baseUrl from "../../../baseurl";
import { Pagination } from "antd";

function SubscriptionAccount() {
  const [data, setData] = useState([])
  const [subscribe, setSubscribe] = useState({})
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const subscription = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/v1/super-admin/amount/subscription-details`,
          {
            params: {
              page: currentPage,
              limit: pageSize,
            }
          });

        console.log(response)
        setSubscribe(response.data)
        setData(response.data.subscriptionLogs)
      } catch (error) {
        console.log(error)
      }
    }
    subscription()
  }, [currentPage, pageSize])

  function capitalize(string) {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }

  return (
    <div className={styles.UserAccount}>
      <SuperSidebar />
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h2>Subscription Account</h2>
          <button className={styles.logBtn}>Log</button>
        </div>

        <div className={styles.amountCard}>
          <div>
            <p>Total Amount</p>
          </div>
          <div>
            <h1>₹{subscribe.totalAmountInRupees}</h1>
          </div>
          <div className={styles.rightText}>
            <p>Subscription account</p>
          </div>
        </div>

        <div className={styles.requestsHeader}>
          <h3>Subscription Details</h3>
          <button className={styles.exportBtn}>Export</button>
        </div>
        <div className={styles.tablesection}>
          <table style={{ borderCollapse: "separate", width: "100%" }}>
            <thead>
              <tr>
                <td className={styles.tableCell}>Name</td>
                <td className={styles.tableCell}>Subscription Amount</td>
                <td className={styles.tableCell}>Status</td>
              </tr>
            </thead>
            <tbody>
              {data.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((value, index) => (
                <tr key={index}>
                  <td className={styles.tableCell}>{value.userName}</td>
                  <td className={styles.tableCell}>₹ {value.amountInRupees}</td>
                  <td className={styles.tableCell}>{capitalize(value.subscriptionStatus)}</td>
                </tr>
              ))}

              <tr style={{ background: "#693bb8" }}>
                <td
                  colSpan="2"
                  className={styles.tableCell}
                  style={{
                    fontWeight: "bold",
                    color: "white",
                    textAlign: "left",
                  }}
                >
                  Total Amount
                </td>
                <td
                  className={styles.tableCell}
                  style={{
                    fontWeight: "bold",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  ₹ {subscribe.totalAmountInRupees}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={data.length}
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

export default SubscriptionAccount;
