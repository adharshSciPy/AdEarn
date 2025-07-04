import React, { useState, useEffect } from "react";
import styles from "./AdminCouponAssign.module.css";
import Sidebar from "../../../components/sidebar/Sidebar";
import baseUrl from "../../../baseurl";
import axios from "axios";
import { useParams } from "react-router-dom";
function AdminCouponReq() {
  const [bundles, setBundles] = useState([]);
  const getRequest = async () => {
    try {
      const response = await axios.get(``);
    } catch (error) {
      console.log(error);
    }
  };
  const sendReq=async()=>{
    console.log("click");
    
  }
  return (
    <div className={styles.UserAccount}>
      <Sidebar />
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h2>Coupon Assignment</h2>
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
              {bundles.length > 0 ? (
                bundles.map((bundle, index) => (
                  <tr key={bundle._id}>
                    <td>{index + 1}</td>
                    <td>{bundle.userName}</td>
                    <td>{bundle.note}</td>
                    <td>
                      <button
                        className={styles.sendButton}
                        onClick={() => sendReq(bundle._id)}
                      >
                        Send
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className={styles.noData}>
                    No requests found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminCouponReq;
