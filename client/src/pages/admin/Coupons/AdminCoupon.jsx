import React, { useState, useEffect } from "react";
import styles from "./AdminCoupon.module.css";
import Sidebar from "../../../components/sidebar/Sidebar";
import baseUrl from "../../../baseurl";
import axios from "axios";
import { useParams } from "react-router-dom";

function AdminCoupon() {
  const [bundles, setBundles] = useState([]);
  const [couponDetails, setCouponDetails] = useState({});
  const [selectedBundleId, setSelectedBundleId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    fetchBundles();
  }, []);
  console.log(couponDetails.length);

  const fetchBundles = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/v1/admin/adminget/${id}`);
      if (res.status === 200) {
        setBundles(res.data?.assignedCouponBatches || []);
      }
    } catch (err) {
      console.error("Failed to fetch bundles", err);
    }
  };

  const openModal = async (bundleId) => {
    setSelectedBundleId(bundleId);
    setShowModal(true);

    if (!couponDetails[bundleId]) {
      try {
        const res = await axios.get(
          `${baseUrl}/api/v1/super-admin/coupon-batch/${bundleId}`
        );
        if (res.status === 200) {
          setCouponDetails((prev) => ({
            ...prev,
            [bundleId]: res.data.data?.coupons || [],
          }));
        }
      } catch (err) {
        console.error("Failed to fetch coupon details:", err);
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const downloadCSV = () => {
    const coupons = couponDetails[selectedBundleId];
    if (!coupons) return;

    const csvContent = [
      ["Code", "Per Star Count"],
      ...coupons.map((c) => [c.code, c.perStarCount]),
    ]
      .map((e) => e.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "coupons.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={styles.UserAccount}>
      <Sidebar />
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h2>My Assigned Coupon Bundles</h2>
        </div>

        <div className={styles.grid}>
          {bundles.map((bundle) => (
            <div
              key={bundle._id}
              className={styles.card}
              onClick={() => openModal(bundle.batchId)}
            >
              <div className={styles.cardContent}>
                <h4>Bundle ID: {bundle.batchId}</h4>
                <div className={styles.viewDetails}>
                  <span>Click to view details</span>
                  <span className={styles.arrowIcon}>→</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {showModal && selectedBundleId && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <button className={styles.closeBtn} onClick={closeModal}>
                ×
              </button>
              <h3>Coupons for Bundle: {selectedBundleId}</h3>

              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "end",
                }}
              >
                <button className={styles.downloadBtn} onClick={downloadCSV}>
                  Download CSV
                </button>
              </div>

              {couponDetails[selectedBundleId]?.length > 0 ? (
                <div className={styles.couponList}>
                  {couponDetails[selectedBundleId].map((coupon, i) => (
                    <div key={i} className={styles.couponItem}>
                      <p>
                         {i + 1}
                      </p>
                      <p>
                        <strong>Code:</strong> {coupon.code}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ marginTop: "20px" }}>Loading coupons...</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminCoupon;
