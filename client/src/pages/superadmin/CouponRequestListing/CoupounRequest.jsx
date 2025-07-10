import React, { useEffect, useState } from "react";
import Sidebar from "../../../components/SuperAdminSideBar/SuperSidebar";
import styles from "./CouponRequest.module.css";
import { useSelector } from "react-redux";
import axios from "axios";
import baseUrl from "../../../baseurl";

function CoupounRequest() {
  const [bundles, setBundles] = useState([]);
  const adminId = useSelector((state) => state.admin.id);

  // Fetch all coupon requests
  const getCoupons = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/v1/super-admin/coupon-requests`);
      setBundles(response.data.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCoupons();
  }, []);

  // Approve and assign coupon
  const sendReq = async (bundleId, adminId) => {
    try {
      const response = await axios.post(`${baseUrl}/api/v1/super-admin/approve-assign-coupon`, {
        requestId: bundleId,
        adminId: adminId,
      });

      if (response.status === 200) {
        // Optimistically update UI by removing approved item
        setBundles((prevBundles) =>
          prevBundles.filter((bundle) => bundle._id !== bundleId)
        );

        // Optional: re-fetch from backend after short delay to ensure sync
        // setTimeout(() => getCoupons(), 500);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.UserAccount}>
      <Sidebar />
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h2>Coupon Requests</h2>
        </div>

        <div className={styles.grid}>
          <table className={styles.bundleTable}>
            <thead>
              <tr>
                <th>#</th>
                <th>UserName</th>
                <th>Note</th>
                <th>Coupon Count</th>
                <th>Stars Count Per Coupon</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bundles.length > 0 ? (
                bundles.map((bundle, index) => (
                  <tr key={bundle._id}>
                    <td>{index + 1}</td>
                    <td>{bundle.adminId?.adminEmail}</td>
                    <td>{bundle.note}</td>
                    <td>{bundle.couponCount}</td>
                    <td>{bundle.starCountPerCoupon}</td>
                    <td>
                      <button
                        className={styles.sendButton}
                        onClick={() => sendReq(bundle._id, bundle.adminId?._id)}
                      >
                        Verify and Accept
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className={styles.noData}>
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

export default CoupounRequest;
