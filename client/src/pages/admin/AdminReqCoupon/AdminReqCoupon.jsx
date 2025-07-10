import React, { useState } from "react";
import styles from "./AdminReqCoupon.module.css";
import Sidebar from "../../../components/sidebar/Sidebar";
import axios from "axios";
import baseUrl from "../../../baseurl";
import { useParams } from "react-router-dom";

function AdminReqCoupon() {
  const [couponCount, setCouponCount] = useState("");
  const [perStarCount, setPerStarCount] = useState("");
  const [note, setNotes] = useState("");
  const [requestStatus, setRequestStatus] = useState(""); // "success", "error", "loading"
  const { id } = useParams();
  const handleRequestCoupon = async () => {
    if (!couponCount || !perStarCount) {
      setRequestStatus("error");
      return;
    }

    const payload = {
      couponCount:couponCount,
      starCountPerCoupon:perStarCount,
      note,
    };
    
    try {
      console.log(payload);
      
      setRequestStatus("loading");
      const res = await axios.post(
        `${baseUrl}/api/v1/admin/coupon/request/${id}`,
        payload
      );
      console.log(res);
      
      if (res.status === 201) {
        setRequestStatus("success");
        setCouponCount("");
        setPerStarCount("");
        setNotes("");
      }
    } catch (err) {
      console.error("Coupon request failed:", err);
      setRequestStatus("error");
    }
  };

  return (
    <div className={styles.mainContainer}>
      <Sidebar />
      <div className={styles.subContainer}>
        <section className={styles.payoutTableSection}>
          <div className={styles.couponCard}>
            <div className={styles.couponHeader}>
              <h2>📩 Request New Coupons</h2>
              <p>
                Specify how many coupons you need and how many stars per coupon.
              </p>
            </div>

            <div className={styles.requestInputGroup}>
              <div className={styles.field}>
                <label>Number of Coupons</label>
                <input
                  type="number"
                  placeholder="e.g. 10"
                  value={couponCount}
                  onChange={(e) => setCouponCount(e.target.value)}
                  className={styles.input}
                />
              </div>

              <div className={styles.field}>
                <label>Stars Per Coupon</label>
                <input
                  type="number"
                  placeholder="e.g. 5"
                  value={perStarCount}
                  onChange={(e) => setPerStarCount(e.target.value)}
                  className={styles.input}
                />
              </div>
              <div className={styles.field}>
                <label>Notes</label>
                <textarea
                  placeholder="Optional note for admin"
                  value={note}
                  onChange={(e) => setNotes(e.target.value)}
                  className={styles.textarea}
                />
              </div>
            </div>

            <button
              onClick={handleRequestCoupon}
              className={styles.button}
              disabled={requestStatus === "loading"}
            >
              {requestStatus === "loading" ? "Submitting..." : "Submit Request"}
            </button>

            {requestStatus === "success" && (
              <p className={styles.success}>
                ✅ Request submitted successfully!
              </p>
            )}
            {requestStatus === "error" && (
              <p className={styles.error}>
                ❌ Please fill in all fields correctly.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default AdminReqCoupon;
