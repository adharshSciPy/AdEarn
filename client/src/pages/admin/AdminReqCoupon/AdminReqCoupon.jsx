import React from 'react'
import Navbar from "../NavBar/Navbar";


function AdminReqCoupon() {
  return (
    <>
      <Navbar />
    <div className="">

        <section className={styles.payoutTableSection}>
                      <div className={styles.couponCard}>
                        <div className={styles.couponHeader}>
                          <h2>📩 Request New Coupons</h2>
                          <p>
                            Specify how many coupons you need and how many stars per
                            coupon.
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
        
                        <button onClick={handleRequestCoupon} className={styles.button}>
                          Submit Request
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
    </>
  )
}

export default AdminReqCoupon