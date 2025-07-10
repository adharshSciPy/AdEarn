import React, { useState } from "react";
import styles from "./CouponGeneration.module.css";
import SuperSidebar from "../../../components/SuperAdminSideBar/SuperSidebar";
import baseUrl from "../../../baseurl";
import axios from "axios";

function CouponGeneration() {
  const [isLoading, setIsLoading] = useState(false);
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

    // Validate required fields
    if (!formData.couponCount || !formData.perStarCount) {
      alert("Please fill in all required fields");
      return;
    }

    // Validate dates if both are provided
    if (formData.date && formData.expiryDate) {
      const startDate = new Date(formData.date);
      const endDate = new Date(formData.expiryDate);

      if (endDate <= startDate) {
        alert("Expiry date must be after the start date");
        return;
      }
    }

    setIsLoading(true);

    // Create payload with only filled fields
    const payload = {
      couponCount: formData.couponCount,
      perStarCount: formData.perStarCount,
      generationDate: formData.date || "",
      expiryDate: formData.expiryDate || "",
    };

    console.log("pay", payload);

    try {
      const response = await axios.post(
        `${baseUrl}/api/v1/super-admin/generate-coupons`,
        payload
      );

      if (response.status === 200) {
        alert("Coupons generated successfully!");
        setFormData({
          couponCount: "",
          perStarCount: "",
          date: "",
          expiryDate: "",
        });
      }
    } catch (error) {
      console.error("Error generating coupons:", error);
      alert(error?.response?.data?.message || "Failed to generate coupons!");
    } finally {
      setIsLoading(false);
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
            <label>Enter generating coupon count *</label>
            <input
              type="number"
              name="couponCount"
              value={formData.couponCount}
              onChange={handleChange}
              placeholder="Enter generating coupon count"
              required
              min="1"
            />

            <label>Enter each coupon star count *</label>
            <select
              name="perStarCount"
              value={formData.perStarCount}
              onChange={handleChange}
              className={styles.dropDown}
              required
            >
              <option value="">Select star count</option>
              <option value="5">5 Star</option>
              <option value="10">10 Stars</option>
              <option value="25">25 Stars</option>
              <option value="50">50 Stars</option>
              <option value="100">100 Stars</option>
              <option value="250">250 Stars</option>
            </select>

            <label>Enter Start Date (optional)</label>
            <input
              type="date"
              name="date"
              value={formData.date || ""}
              onChange={handleChange}
              min={new Date().toISOString().split("T")[0]} // Optional: restrict to future dates
            />

            <label>Enter Expiry Date (optional)</label>
            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate || ""}
              onChange={handleChange}
              min={formData.date || new Date().toISOString().split("T")[0]}
            />

            <div className={styles.buttons}>
              <button
                type="button"
                className={styles.cancel}
                onClick={() =>
                  setFormData({
                    couponCount: "",
                    perStarCount: "",
                    date: "",
                    expiryDate: "",
                  })
                }
              >
                Cancel
              </button>
              <button
                type="submit"
                className={styles.submit}
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CouponGeneration;
