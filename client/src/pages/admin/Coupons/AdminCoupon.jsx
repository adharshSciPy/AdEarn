import React, { useState, useEffect, useRef } from "react";
import styles from "../../superadmin/UserAccount/useraccount.module.css";
import Sidebar from '../../../components/sidebar/Sidebar'
import baseUrl from '../../../baseurl';
import axios from "axios"
import { useParams } from "react-router-dom";


function AdminCoupon() {
 const [bundles, setBundles] = useState([]);
  const [expanded, setExpanded] = useState({});
  const {id}=useParams()
const fetchBundles = async () => {
  console.log("idd", id);

  try {
    const response = await axios.get(`${baseUrl}/api/v1/admin/adminget/${id}`);

    if (response.status === 200) {
      console.log("Response:", response);
      setBundles(response.data.data?.couponBundles || []); // adjust as needed
    }
  } catch (err) {
    console.error("Failed to fetch bundles", err);
  }
};

  useEffect(() => {
    fetchBundles();
  }, []);

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className={styles.UserAccount}>
      <Sidebar />
      <div className={styles.wrapper}>
      <h2>My Assigned Coupon Bundles</h2>
      <div className={styles.bundleList}>
        {bundles.map((bundle) => (
          <div key={bundle._id} className={styles.bundleCard}>
            <div className={styles.bundleHeader} onClick={() => toggleExpand(bundle._id)}>
              <p><strong>Bundle ID:</strong> {bundle._id}</p>
              <p><strong>Generated On:</strong> {new Date(bundle.generationDate).toLocaleDateString("en-GB")}</p>
              <p><strong>Coupon Count:</strong> {bundle.coupons.length}</p>
              <button className={styles.toggleBtn}>
                {expanded[bundle._id] ? "Hide Coupons" : "Show Coupons"}
              </button>
            </div>
            {expanded[bundle._id] && (
              <div className={styles.couponList}>
                {bundle.coupons.map((coupon, idx) => (
                  <div key={idx} className={styles.couponItem}>
                    <p><strong>Code:</strong> {coupon.code}</p>
                    <p><strong>Per Star Count:</strong> {coupon.perStarCount}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
    </div >

  )
}

export default AdminCoupon