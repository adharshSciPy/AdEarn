import React, { useState, useEffect } from "react";
import styles from "./Coupon.module.css";
import SuperSidebar from "../../../components/SuperAdminSideBar/SuperSidebar";
import axios from 'axios'
import baseUrl from "../../../baseurl"
import { Pagination } from "antd";


function CouponAccount() {

  const [data, setData] = useState([])
  const [coupon, setCoupon] = useState({})
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const couponaccount = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/v1/super-admin/coupon-batch-details`, {
          params: {
            page: currentPage,
            limit: pageSize,
          }
        });
        console.log(response)
        setData(response.data.batches)
        setCoupon(response.data)
      } catch (error) {
        console.log(error)
      }
    }

    couponaccount()
  }, [currentPage, pageSize])

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-indexed
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }


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
            <h1>₹ {coupon.totalAmountInRupees}</h1>
          </div>
          <div className={styles.rightText}>
            <p>Coupons account</p>
          </div>
        </div>

        <div className={styles.requestsHeader}>
          <h3>Coupons Distribution Details</h3>
          <button className={styles.exportBtn}>Export</button>
        </div>
        <div className={styles.tablesection}>
          <table style={{ borderCollapse: "separate", width: "100%" }}>
            <thead>
              <tr>
                <td className={styles.tableCell}>Sl.No</td>
                <td className={styles.tableCell}>Coupon Count</td>
                <td className={styles.tableCell}>Expiry Date</td>
                <td className={styles.tableCell}>Total Amount</td>
              </tr>
            </thead>
            <tbody>
              {data.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((value, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td className={styles.tableCell}>{value.couponCount}</td>
                  <td className={styles.tableCell}>{formatDate(value.expiryDate)}</td>
                  <td className={styles.tableCell}>₹ {value.totalAmountInRupees}</td>
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
                  Total Amount
                </td>
                <td
                  className={styles.tableCell}
                  style={{
                    fontWeight: "bold",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  ₹ {coupon.totalAmountInRupees}
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

export default CouponAccount;
