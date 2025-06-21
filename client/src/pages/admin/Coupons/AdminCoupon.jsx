import React, { useState, useEffect, useRef } from "react";
import styles from "../../superadmin/UserAccount/useraccount.module.css";
import Sidebar from '../../../components/sidebar/Sidebar'


function AdminCoupon() {

  const couponsarray = [
    { couponName: 'Coupons 1', couponStatus: "start", starDistribution: 1 },
    { couponName: 'Coupons 2', couponStatus: "start", starDistribution: 2 },
    { couponName: 'Coupons 3', couponStatus: "start", starDistribution: 3 },
    { couponName: 'Coupons 4', couponStatus: "start", starDistribution: 4 },
    { couponName: 'Coupons 5', couponStatus: "start", starDistribution: 5 }
  ]

  return (
    <div className={styles.UserAccount}>
      <Sidebar />
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h2>Coupons</h2>
          <button className={styles.logBtn}>Log</button>
        </div>

        <div className={styles.amountCard}>
          <div>
            <h2>Total Stars</h2>
            <h2>⭐ 5000</h2>
          </div>
          <div className={styles.rightText}>
            <p>Company account</p>
            <span>+8% from yesterday</span>
          </div>
        </div>

        {/* <div className={styles.requestsHeader}>
          <h3>Payout requests</h3>
          <button className={styles.exportBtn}>Export</button>
        </div> */}

        <div className={styles.table}>
          <div className={styles.tableHeader}>
            <div>Coupon Name</div>
            <div>Status</div>
            <div>Stars</div>
          </div>

          {couponsarray.map((coupon, index) => (
            <div key={index} className={styles.tableRow}>
              <div>{coupon.couponName}</div>
              <div>{coupon.couponStatus}</div>
              <div style={{ fontSize: "18px" }}>
                {'⭐'} {coupon.starDistribution}
              </div>
            </div>
          ))}

          <div style={{ display: "flex", justifyContent: "space-between", padding: "15px", backgroundColor: "#693bb8" }}>
            <div style={{ color: 'white', fontSize: "20px" }}><strong>Total</strong></div>
            <div></div>
            <div style={{ color: 'white' }}><strong style={{ color: 'gold', fontSize: "20px" }}>★</strong> 5000</div>
          </div>
        </div>



      </div>
    </div >
  )
}

export default AdminCoupon