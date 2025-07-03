import React, { useState } from "react";
import styles from "./CouponGeneration.module.css";
import SuperSidebar from "../../../components/SuperAdminSideBar/SuperSidebar";
import baseUrl from "../../../baseurl";
import axios from "axios";

function CouponGeneration() {
  const [formData, setFormData] = useState({
    couponCount: "",
    perStarCount: "",
    date: "",
    expiryDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      couponCount: formData.couponCount,
      perStarCount: formData.perStarCount,
      generationDate: formData.date,
      expiryDate: formData.expiryDate,
    };
    console.log(payload);

    try {
      const response = await axios.post(
        `${baseUrl}/api/v1/super-admin/generate-coupons`,
        payload
      );
      console.log(response);
      
      if (response.status === 200) {
        console.log("Success:", response.data);
        setFormData({
          couponCount: "",
          perStarCount: "",
          date: "",
          expiryDate: "",
        });
      }
    } catch (error) {
      console.error("Error generating coupons:", error);
      // toast.error(error?.response?.data?.message || "Failed to generate coupons!");
    }
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
            <label>Enter generating coupon count</label>
            <input
              type="number"
              name="couponCount"
              value={formData.couponCount}
              onChange={handleChange}
              placeholder="Enter generating coupon count"
            />

            <label>Enter each coupon star count</label>
            <select
              name="perStarCount"
              value={formData.perStarCount}
              onChange={handleChange}
              className={styles.dropDown}
            >
              <option value="">Select star count</option>
              <option value="5">5 Star</option>
              <option value="10">10 Stars</option>
              <option value="25">25 Stars</option>
              <option value="50">50 Stars</option>
              <option value="100">100 Stars</option>
              <option value="250">250 Stars</option>

            </select>

            <label>Enter Start Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />

            <label>Enter Expiry Date</label>
            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
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
  );
}

export default CouponGeneration;
