import React, { useState, useEffect } from "react";
import styles from "./AdminCouponAssign.module.css";
import Sidebar from "../../../components/sidebar/Sidebar";
import baseUrl from "../../../baseurl";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

function AdminCouponReq() {
  const [bundles, setBundles] = useState([]);
  const adminId = useSelector((state) => state.admin.id);

  const getRequest = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/v1/admin/assigned-coupon-requests/${adminId}`);
      console.log(response);
      const coupondata = response.data.data;
      setBundles(coupondata.filter((item) => item._id !== adminId))


    } catch (error) {
      console.log(error);
    }
  };
  const sendReq = async (bundleId) => {
    try {
      const response = await axios.post(`${baseUrl}/api/v1/admin/distribute-coupon/${adminId}`, { requestId: bundleId })
      console.log(response);
      if (response.status === 200) {
        getRequest()
      }
    } catch (error) {
      console.log(error);

    }
    console.log("click", bundleId);

  }
  useEffect(() => { getRequest() }, [])
  return (
    <div className={styles.UserAccount}>
      <Sidebar />
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h2>Coupon Assignment</h2>
        </div>

        <div className={styles.grid}>
          <table className={styles.bundleTable}>
            <thead>
              <tr>
                <th>#</th>
                <th>UserName</th>
                <th>Note</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bundles.length > 0 ? (
                bundles.map((bundle, index) => (
                  <tr key={bundle._id}>
                    <td>{index + 1}</td>
                    <td>{bundle.userName}</td>
                    <td>{bundle.note}</td>
                    <td>
                      <button
                        className={styles.sendButton}
                        onClick={() => sendReq(bundle._id)}
                      >
                        Verify
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className={styles.noData}>
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

export default AdminCouponReq;
