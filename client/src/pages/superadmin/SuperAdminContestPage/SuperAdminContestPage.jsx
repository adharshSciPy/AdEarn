import React, { useState } from "react";
import styles from "./contestpage.module.css";
import SuperSidebar from "../../../components/SuperAdminSideBar/SuperSidebar";


function SuperAdminContestPage() {
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
          <h2>Create Contest</h2>
        </div>
        <div className={styles.container}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <label>Enter Contest Name</label>
            <input
              type="text"
              name="contestName"
              value={formData.contestName}
              onChange={handleChange}
              placeholder="Enter Contest Name"
            />

            <label>Enter Contest Number</label>
            <input
              type="text"
              name="contestNumber"
              value={formData.contestNumber}
              onChange={handleChange}
              placeholder="Enter Contest Number"
            />

            <label>Enter Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              placeholder="Enter Start Date"
            />

            <label>Total Users</label>
            <input
              type="text"
              name="totalEntry"
              value={formData.totalEntry}
              onChange={handleChange}
              placeholder="Total Users"
            />
            
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

export default SuperAdminContestPage
