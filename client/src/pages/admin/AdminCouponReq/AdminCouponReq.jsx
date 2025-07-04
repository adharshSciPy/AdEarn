import React, { useState, useEffect } from "react";
import styles from "./AdminReq.module.css";
import Sidebar from "../../../components/sidebar/Sidebar";
import baseUrl from "../../../baseurl";
import axios from "axios";
import { useParams } from "react-router-dom";
function AdminCouponReq() {
  const [bundles, setBundles] = useState([]);
  const getCoupons = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/admin/coupons-requests`
      );
      console.log(response);
      setBundles(response.data.data || []);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getCoupons();
  }, []);
  return (
    <div className={styles.UserAccount}>
      <Sidebar />
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h2>Coupon Requests</h2>
        </div>

        <div className={styles.grid}>
          <table className={styles.bundleTable}>
            <thead>
              <tr>
                <th>#</th>
                <th>UserName</th>
                <th>Note</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bundles.map((bundle, index) => (
                <tr key={bundle._id}>
                  <td>{index + 1}</td>
                  <td>{bundle.userName}</td>
                  <td>
                    {bundle.note}
                  </td>
                  <td>
                    <button className={styles.sendButton}>Send</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminCouponReq;
