import React, { useEffect, useState } from "react";
import Sidebar from "../../../components/SuperAdminSideBar/SuperSidebar";
import styles from "./CouponRequest.module.css";
import { useSelector } from "react-redux";
import axios from "axios";
import baseUrl from "../../../baseurl";

function CoupounRequest() {
  const [bundles, setBundles] = useState([]);
  const adminId = useSelector((state) => state.admin.id);

  const getCoupons = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/super-admin/coupon-requests`
      );
      console.log(response);
      setBundles(response.data.data || []);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getCoupons();
  }, []);
  const sendReq = async (bundleId,adminId) => {
    console.log("thisss",bundleId,adminId);
    
    try {
        const respone =await axios.post(`${baseUrl}/api/v1/super-admin/approve-assign-coupon`,{
            requestId:bundleId,
            adminId:adminId
        })
        console.log(respone);
        
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
                        onClick={() => sendReq(bundle._id,bundle.adminId?._id)}
                      >
                        Verify and Accept
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

export default CoupounRequest;
