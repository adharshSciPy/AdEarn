import React, { useState, useEffect } from "react";
import styles from "../../SubscriptionAccount/Subscription.module.css";
import SuperSidebar from "../../../../components/SuperAdminSideBar/SuperSidebar";
import axios from "axios";
import baseUrl from "../../../../baseurl";
import { Pagination } from "antd";

function SubscriptionStar() {

  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);


  useEffect(() => {
    const subscription = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/v1/super-admin/subscription-log/details`, {
          params: {
            page: currentPage,
            limit: pageSize,
          }
        });
        console.log(response)
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

  function formatDateTime(isoString) {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }

  const starCount = data.reduce((sum, item) => sum + (item.starsUsed) || 0, 0)

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
            <p>Total Star</p>
          </div>
          <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "4px",
            textAlign: "center"
          }}>
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="gold"
              xmlns="http://www.w3.org/2000/svg"
              style={{ verticalAlign: "middle" }}
            >
              <path d="M12 2L14.9 8.6L22 9.2L17 14L18.5 21L12 17.3L5.5 21L7 14L2 9.2L9.1 8.6L12 2Z" />
            </svg>
            <h2 style={{ margin: 0 }}>{starCount}</h2>
          </div>
          <div className={styles.rightText}>
            <p>Subscription account</p>
          </div>
        </div>

        <div className={styles.requestsHeader}>
          <h3>User Subscription Details</h3>
          <button className={styles.exportBtn}>Export</button>
        </div>
        <div className={styles.tablesection}>
          <table style={{ borderCollapse: "separate", width: "100%" }}>
            <thead>
              <tr>
                <td className={styles.tableCell}>Name</td>
                <td className={styles.tableCell}>Status</td>
                <td className={styles.tableCell}>End Date</td>
                <td className={styles.tableCell}>Subscription Star</td>
              </tr>
            </thead>
            <tbody>
              {data.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((value, index) => (
                <tr key={index}>
                  <td className={styles.tableCell}>{value.userName}</td>
                  <td className={styles.tableCell}>{capitalize(value.subscriptionStatus)}</td>
                  <td className={styles.tableCell}>{formatDateTime(value.subscriptionEndDate)}</td>
                  <td className={styles.tableCell}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="gold"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ verticalAlign: "middle" }}
                    >
                      <path d="M12 2L14.9 8.6L22 9.2L17 14L18.5 21L12 17.3L5.5 21L7 14L2 9.2L9.1 8.6L12 2Z" />
                    </svg>
                    {" "}{value.starsUsed}
                  </td>
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
                  Total Stars
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
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="gold"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 2L14.9 8.6L22 9.2L17 14L18.5 21L12 17.3L5.5 21L7 14L2 9.2L9.1 8.6L12 2Z" />
                  </svg>
                  {" "}{starCount}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
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

export default SubscriptionStar;
