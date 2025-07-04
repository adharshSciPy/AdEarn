import React, { useEffect, useState } from 'react'
import styles from "./coupon.module.css";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from "axios"
import baseUrl from '../../../baseurl';
import Navbar from '../NavBar/Navbar';
import CreateAdPopup from "../../../components/AdPopup/CreateAdPopup";
import Delete from "../../../assets/delete.png";



function CouponPage() {
   const [activeTab, setActiveTab] = useState("Payouts");
  const [showPopup, setShowPopup] = useState(false);
  const [stars, setStars] = useState("");
  const [walletDetails, setWalletDetails] = useState([]);
  const [showBuyStarsModal, setShowBuyStarsModal] = useState(false);
  const userId = useSelector((state) => state.user.id);
  const navigate = useNavigate();
  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  const handleRedeemClick = () => {
    setActiveTab("Redeem Coupons");
  };

  const tabs = [
    "Redeem Coupons",
    "Request Coupons",
  ];
 const paymentClick=()=>{
    console.log("click");
    
 }
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
                <div className={styles.firstMainp}>
                  
                </div>
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
              <h2>Redeem Coupons</h2>
              <table className={styles.payoutTable}>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Request no</th>
                    <th>Status</th>
                    <th>Payout amount</th>
                    <th>Redeem money</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>03/04/2025</td>
                    <td>Request 1</td>
                    <td>Accepted</td>
                    <td>500</td>
                    <td
                      style={{
                        display: "flex",
                        justifyContent: "space-around",
                      }}
                    >
                      <button
                        className={styles.redeemBtn}
                        onClick={handleRedeemClick}
                      >
                        Redeem now
                      </button>
                      <button className={styles.cancelBtn}>
                        Cancel payout
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </section>
          )}

          {activeTab === "Redeem Payouts" && (
            <section className={styles.payoutTableSection}>
              <h2>Redeem Payouts</h2>
              <table className={styles.payoutTable}>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Request no</th>
                    <th>Star</th>
                    <th>Payout amount</th>
                    <th>Export</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>03/04/2025</td>
                    <td>Request 1</td>
                    <td>50</td>
                    <td>500</td>
                    <td>
                      <button
                        className={styles.redeemBtn}
                        onClick={handleRedeemClick}
                        style={{ margin: "0" }}
                      >
                        Download
                      </button>
                    </td>
                    <td>
                      <button
                        className={styles.cancelBtn}
                        style={{ margin: "0" }}
                      >
                        <img className={styles.image} src={Delete} alt="" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </section>
          )}
          {activeTab === "Payment History" && (
            <section className={styles.payoutTableSection}>
              <h2>Payment History</h2>
              <table className={styles.payoutTable}>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Request no</th>
                    <th>Star</th>
                    <th>Payout amount</th>
                    <th>Export</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>03/04/2025</td>
                    <td>Request 1</td>
                    <td>50</td>
                    <td>500</td>
                    <td>
                      <button
                        className={styles.redeemBtn}
                        onClick={handleRedeemClick}
                        style={{ margin: "0" }}
                      >
                        Download
                      </button>
                    </td>
                    <td>
                      <button
                        className={styles.cancelBtn}
                        style={{ margin: "0" }}
                      >
                        <img className={styles.image} src={Delete} alt="" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </section>
          )}
          {activeTab === "Cancelled payouts" && (
            <section className={styles.payoutTableSection}>
              <h2>Cancelled payouts</h2>
              <table className={styles.payoutTable}>
                <thead>
                  <tr>
                    <th style={{ width: "20%" }}>Date</th>
                    <th style={{ width: "20%" }}>Request no</th>
                    <th style={{ width: "20%" }}>Star</th>
                    <th style={{ width: "20%" }}>Payout amount</th>
                    <th style={{ width: "20%" }}>Reason</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ width: "19%" }}>03/04/2025</td>
                    <td style={{ width: "19%" }}>Request 1</td>
                    <td style={{ width: "19%" }}>50</td>
                    <td style={{ width: "18%" }}>500</td>
                    <td style={{ width: "25%" }}>
                      <p>
                        reason behind the cancellation reason behind the
                        cancellation reason behind the cancellation
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
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
                <button onClick={paymentClick()}>Proceed</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default CouponPage