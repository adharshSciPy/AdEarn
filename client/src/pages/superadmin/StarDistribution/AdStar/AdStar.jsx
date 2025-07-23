import React, { useState, useEffect } from "react";
import styles from "../../AdsAccount/AdsAccount.module.css";
import SuperSidebar from "../../../../components/SuperAdminSideBar/SuperSidebar";
import axios from "axios";
import baseUrl from "../../../../baseurl";
import { Pagination } from "antd";


function AdStar() {

  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const adsStar = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/v1/super-admin/all-user/ad-details`, {
          params: {
            page: currentPage,
            limit: pageSize,
          }
        });
        console.log(response)
        setData(response.data.data)
      } catch (error) {
        console.log(error)
      }
    }
    adsStar()
  }, [currentPage, pageSize])

  // ✅ Calculate total stars spent
  const totalStarsSpent = data.reduce((sum, item) => sum + (item.totalStarsSpent || 0), 0);


  return (
    <div className={styles.UserAccount}>
      <SuperSidebar />
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h2>Ads Account</h2>
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
            <h2 style={{ margin: 0 }}>{totalStarsSpent}</h2>
          </div>

          <div className={styles.rightText}>
            <p>Ads account</p>
          </div>
        </div>

        <div className={styles.requestsHeader}>
          <h3>User Ads Details</h3>
          <button className={styles.exportBtn}>Export</button>
        </div>
        <div className={styles.tablesection}>
          <table style={{ borderCollapse: "separate", width: "100%" }}>
            <thead>
              <tr>
                <td className={styles.tableCell}>Name</td>
                <td className={styles.tableCell}>Total Ads</td>
                <td className={styles.tableCell}>Verified Ads</td>
                <td className={styles.tableCell}>Rejected Ads</td>
                <td className={styles.tableCell}>Total Stars</td>
              </tr>
            </thead>
            <tbody>
              {data.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((value, index) => (
                <tr key={index}>
                  <td className={styles.tableCell}>{value.name}</td>
                  <td className={styles.tableCell}>{value.totalAds}</td>
                  <td className={styles.tableCell}>{value.verifiedAdCount}</td>
                  <td className={styles.tableCell}>{value.rejectedAdCount}</td>
                  <td className={styles.tableCell}>{value.totalStarsSpent}</td>
                </tr>
              ))}

              <tr style={{ background: "#693bb8" }}>
                <td
                  colSpan="4"
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
                  {totalStarsSpent}
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

export default AdStar
