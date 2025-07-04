import React, { useState, useEffect } from "react";
import styles from "./AdminReq.module.css";
import Sidebar from "../../../components/sidebar/Sidebar";
import baseUrl from "../../../baseurl";
import axios from "axios";
import { useParams } from "react-router-dom";
function AdminCouponReq() {
    const [bundles, setBundles] = useState([]);
  const getCoupons=async()=>{
    try {
      const response=await axios.get(``)
      
    } catch (error) {
      console.log(error);
      
    }
  }
  return (
    <div className={styles.UserAccount}>
      <Sidebar />
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h2>Coupon Requests</h2>
        </div>

        <div className={styles.grid}>
          {bundles.map((bundle) => (
            <div
              key={bundle._id}
              className={styles.card}
            >
              <div className={styles.cardContent}>
                <h4>Bundle ID: {bundle.batchId}</h4>
                <div className={styles.viewDetails}>
                  <span>Click to view details</span>
                  <span className={styles.arrowIcon}>→</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        
      </div>
    </div>
  )
}

export default AdminCouponReq