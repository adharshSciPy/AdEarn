import React, { useEffect, useState } from "react";
import styles from "./coupon.module.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import baseUrl from "../../../baseurl";
import Navbar from "../NavBar/Navbar";
import CreateAdPopup from "../../../components/AdPopup/CreateAdPopup";
import Delete from "../../../assets/delete.png";

function CouponPage() {
  const [activeTab, setActiveTab] = useState("Redeem Coupons");
  const [showPopup, setShowPopup] = useState(false);
  const [stars, setStars] = useState("");
  const [walletDetails, setWalletDetails] = useState([]);
  const [showBuyStarsModal, setShowBuyStarsModal] = useState(false);
  const userId = useSelector((state) => state.user.id);
  const navigate = useNavigate();
  const [couponCount, setCouponCount] = useState("");
  const [perStarCount, setPerStarCount] = useState("");
  const [requestStatus, setRequestStatus] = useState(null);
  const [note, setNotes] = useState("");

  const [code, setCode] = useState("");
  const [status, setStatus] = useState(null);

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  const handleRedeemClick = () => {
    setActiveTab("Redeem Coupons");
  };

  const handleRedeem = async () => {
    if (!code.trim()) {
      setStatus("error");
      return;
    }

    // if (code === "WELCOME100") {
    //   setStatus("success");
    // } else {
    //   setStatus("error");
    // }
    try {
      const response = await axios.post(
        `${baseUrl}/api/v1/user/redeem-coupon/${userId}`,
        { couponCode: code }
      );
      if (response.status === 200) {
        setStatus("success");
        console.log(response);
      }
    } catch (error) {
      setStatus("error");
      console.log(error);
    }
  };

  const paymentClick = () => {
    console.log("click");
  };
const handleRequestCoupon = async () => {
  if (
    !couponCount ||
    !perStarCount ||
    couponCount <= 0 ||
    perStarCount <= 0
  ) {
    setRequestStatus("error");
    return;
  }

  try {
    const response = await axios.post(`${baseUrl}/api/v1/user/request-coupon/${userId}`, {
      couponCount,
      perStarCount,
      note,
    });
    console.log(response);
    
    if (response.status === 201) {
      setRequestStatus("success");
      setCouponCount("");
      setPerStarCount("");
      setNotes("");
    }
  } catch (error) {
    console.error(error);
    setRequestStatus("error");
  }
};


  const tabs = ["Redeem Coupons", "Request Coupons"];

  return (
    <>
      <Navbar />
      <CreateAdPopup isOpen={showPopup} onClose={() => setShowPopup(false)} />

      <div className={styles.walletContainer}>
        <div className={styles.contentsContainer}>
          <div className={styles.firstContent}>
            <div className={styles.firstMain}>
              <div className={styles.firstMainleftContainer}>
                <div className={styles.firstMainHeader}>
                  <h2>Coupons</h2>
                </div>
                <div className={styles.firstMainp}></div>
                <div className={styles.firstMainbutton}>
                  <button onClick={() => setShowPopup(true)}>Place Ads</button>
                </div>
              </div>

              <div className={styles.firstMainrightContainer}>
                <div className={styles.firstImageContainer}>
                  <div className={styles.firstImageContainerMain}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.contentTwo}>
          <nav className={styles.tabMenu}>
            <ul>
              {tabs.map((tab) => (
                <li
                  key={tab}
                  className={activeTab === tab ? styles.active : ""}
                  onClick={() => handleTabClick(tab)}
                >
                  {tab}
                </li>
              ))}
            </ul>
          </nav>

          {activeTab === "Redeem Coupons" && (
            <section className={styles.payoutTableSection}>
              <div className={styles.couponCard}>
                <div className={styles.couponHeader}>
                  <h2>🎁 Redeem Your Coupon</h2>
                  <p>Enter your code to unlock rewards!</p>
                </div>

                <div className={styles.inputGroup}>
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={code}
                    onChange={(e) => {
                      setCode(e.target.value);
                      setStatus(null);
                    }}
                    className={styles.input}
                  />
                  <button onClick={handleRedeem} className={styles.button}>
                    Apply
                  </button>
                </div>

                {status === "success" && (
                  <p className={styles.success}>
                    ✅ Coupon applied successfully!
                  </p>
                )}
                {status === "error" && (
                  <p className={styles.error}>
                    ❌ Invalid coupon code. Try again.
                  </p>
                )}
              </div>
            </section>
          )}

          {/* Other tab contents can be added here as needed */}
          {activeTab === "Request Coupons" && (
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
          )}
        </div>

        {showBuyStarsModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <p className={styles.modalP} style={{ textAlign: "center" }}>
                Start Purchase
              </p>
              <p
                className={styles.modalP}
                style={{ fontSize: "12px", paddingTop: "5px" }}
              >
                Enter number of stars
              </p>
              <input
                placeholder="Enter number of stars"
                type="number"
                className={styles.modalInput}
                onChange={(e) => setStars(e.target.value)}
              ></input>
              <p className={styles.indicator}> * minimum 60 stars</p>
              <div className={styles.modalActions}>
                <button
                  onClick={() => setShowBuyStarsModal(false)}
                  style={{ marginRight: "20px" }}
                >
                  Cancel
                </button>
                <button onClick={paymentClick}>Proceed</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default CouponPage;
