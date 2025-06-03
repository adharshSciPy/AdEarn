import React, { useState } from "react";
import styles from "./contextpage.module.css";
import SuperSidebar from "../../../components/SuperAdminSideBar/SuperSidebar";


function SuperAdminContextPage() {
      const [formData, setFormData] = useState({
        couponNumber: "",
        couponCount: "",
        starCount: "",
        date: "",
        expiryDate: "",
      });
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
      };
    
      const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form Submitted:", formData);
        // You can call your API here
      };
  return (
   <div className={styles.UserAccount}>
      <SuperSidebar />
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h2>Coupon Generation</h2>
        </div>
        <div className={styles.container}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <label>Enter coupon number</label>
            <input
              type="text"
              name="couponNumber"
              value={formData.couponNumber}
              onChange={handleChange}
              placeholder="Enter coupon number"
            />

            <label>Enter generating coupon count</label>
            <input
              type="text"
              name="couponCount"
              value={formData.couponCount}
              onChange={handleChange}
              placeholder="Enter contest name"
            />

            <label>Enter each coupon star count</label>
            <input
              type="text"
              name="starCount"
              value={formData.starCount}
              onChange={handleChange}
              placeholder="Enter star count"
            />

            <label>Enter date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />

            {/* <label>Enter expiry date</label>
        <input
          type="date"
          name="expiryDate"
          value={formData.expiryDate}
          onChange={handleChange}
        /> */}

            <div className={styles.buttons}>
              <button type="button" className={styles.cancel}>
                Cancel
              </button>
              <button type="submit" className={styles.submit}>
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SuperAdminContextPage
