import React, { useEffect, useId, useState } from "react";
import styles from "./WalletPage.module.css";
import Delete from "../../../assets/delete.png";
import Navbar from "../NavBar/Navbar";
import { useSelector } from "react-redux";
import axios from "axios";
import baseUrl from "../../../baseurl";
import { useNavigate } from "react-router-dom";
import CreateAdPopup from "../../../components/AdPopup/CreateAdPopup";
import { Modal, Input, Form, Pagination } from "antd";
import { toast } from "react-toastify";
import Driver from "driver.js";
import "driver.js/dist/driver.min.css";

const WalletPage = () => {
  const [activeTab, setActiveTab] = useState("Payouts");
  const [showPopup, setShowPopup] = useState(false);
  const [stars, setStars] = useState("");
  const [walletDetails, setWalletDetails] = useState([]);
  const [showBuyStarsModal, setShowBuyStarsModal] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState(0);
  const [payOutDetails, setPayoutDetails] = useState([]);
  const [tourState, setTourState] = useState({
    navbarCompleted: false,
    homeCompleted: false,
  });

  const userId = useSelector((state) => state.user.id);
  const token = useSelector((state) => state.user.token);
  const [paymentDetails, setPayment] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cancelledPayout, setcancelledPayout] = useState([]);
  // Pagination states
  const [payoutPage, setPayoutPage] = useState(1);
  const [payoutPageSize, setPayoutPageSize] = useState(5);

  const [paymentPage, setPaymentPage] = useState(1);
  const [paymentPageSize, setPaymentPageSize] = useState(5);

  const [cancelledPage, setCancelledPage] = useState(1);
  const [cancelledPageSize, setCancelledPageSize] = useState(5);

  const navigate = useNavigate();
  const handlePayout = async () => {
    console.log("token", token);
    console.log(typeof payoutAmount);

    try {
      const res = await axios.post(
        `${baseUrl}/api/v1/payout/request`,
        {
          starCount: payoutAmount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res?.status >= 200 && res?.status < 300) {
        setIsModalOpen(false);
        setPayoutAmount("");
        toast.success("Payout request send successfully");
        getPayoutDetails();
        getUserWalletDetails();
      }
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setPayoutAmount("");
  };
  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  const handleRedeemClick = () => {
    setActiveTab("Redeem Payouts");
  };

  const tabs = ["Payouts", "Payment History", "Cancelled payouts"];
  const getUserWalletDetails = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/user/user-wallet/${userId}`
      );
      setWalletDetails(response.data.wallet);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getUserWalletDetails();
    getPayoutDetails();
    getCancelledPayout();
    verifiedPayouts();
  }, []);

  // const handleClick = () => {
  //   navigate(`/adform/${userId}`); // replace with your route
  // };
  const paymentClick = async () => {
    try {
      const response = await axios.post(
        `${baseUrl}/api/v1/user/buy-stars/${userId}`,
        { starsNeeded: stars }
      );
      console.log(response);
      if (response.status === 200) {
        getUserWalletDetails();
        setShowBuyStarsModal(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getPayoutDetails = async () => {
    try {
      const res = await axios.get(
        `${baseUrl}/api/v1/payout/my-payouts/${userId}`
      );
      console.log("pay", res);
      setPayoutDetails(res.data.payoutRequests);
    } catch (error) {
      console.log(error);
    }
  };
  const getCancelledPayout = async () => {
    try {
      const res = await axios.get(
        `${baseUrl}/api/v1/payout/my-payouts/rejected/${userId}`
      );
      console.log("cancelled", res);
      setcancelledPayout(res.data.rejectedPayouts);
    } catch (error) {
      console.log(error);
    }
  };
  const verifiedPayouts = async () => {
    try {
      const res = await axios.get(
        `${baseUrl}/api/v1/payout/my-payouts/verified/${userId}`
      );
      console.log("veri", res);
      setPayment(res.data.completedPayouts);
    } catch (error) {
      console.log(error);
    }
  };

  // Handle tour completion
  const handleTourComplete = (tourType) => {
    setTourState((prev) => ({
      ...prev,
      [tourType === "navbar" ? "navbarCompleted" : "homeCompleted"]: true,
    }));
  };

  //driver.js

  // Start home tour when navbar tour is completed
  useEffect(() => {
    const hometourCompleted = localStorage.getItem(
      `userTourCompleted_${userId}`
    );
    const walletpageCompleted = localStorage.getItem(
      `walletpageCompleted_${userId}`
    );

    // Start home tour if navbar is done but full tour isn't complete
    if (hometourCompleted && !walletpageCompleted) {
      // Add a small delay to ensure all elements are rendered
      setTimeout(() => {
        startHomeTour();
      }, 500);
    }
  }, [userId]); // Remove tourState.navbarCompleted dependency

  // Also trigger when navbar completes via callback
  useEffect(() => {
    if (tourState.navbarCompleted) {
      setTimeout(() => {
        startHomeTour();
      }, 500);
    }
  }, [tourState.navbarCompleted]);

  const startHomeTour = () => {
    // Check again to prevent duplicate tours
    const wallettourCompleted = localStorage.getItem(
      `walletpageCompleted_${userId}`
    );
    if (wallettourCompleted) return;

    let attempts = 0;

    const interval = setInterval(() => {
      const selectors = [
        "#place-ads-btn",
        "#buy-stars",
        "#payout-request",
        "#payouts",
      ];

      const existingSelectors = selectors.filter((sel) =>
        document.querySelector(sel)
      );

      // Start tour if at least the place-ads-btn exists (main requirement)
      const canStartTour = document.querySelector("#place-ads-btn");

      if (canStartTour || attempts > 10) {
        clearInterval(interval);

        if (canStartTour) {
          // Use only existing selectors for the tour
          const tourSteps = [];

          if (document.querySelector("#place-ads-btn")) {
            tourSteps.push({
              element: "#place-ads-btn",
              popover: {
                title: "Place Your Ad",
                description: "Click here to place a new advertisement.",
                position: "bottom",
              },
            });
          }

          if (document.querySelector("#buy-stars")) {
            tourSteps.push({
              element: "#buy-stars",
              popover: {
                title: "Buy Stars",
                description: "For buying stars.",
                position: "top",
              },
            });
          }

          if (document.querySelector("#payout-request")) {
            tourSteps.push({
              element: "#payout-request",
              popover: {
                title: "Payout Request",
                description: "To add payout request.",
                position: "top",
              },
            });
          }

          if (document.querySelector("#payouts")) {
            tourSteps.push({
              element: "#payouts",
              popover: {
                title: "Payouts",
                description: "View payouts details.",
                position: "top",
              },
            });
          }

          const driver = new Driver({
            animate: true,
            opacity: 0.5,
            stageBackground: "rgba(0, 0, 0, 0.5)",
            allowClose: true,
            doneBtnText: "Next",
            closeBtnText: "Skip",
            nextBtnText: "Next",
            prevBtnText: "Previous",
            onReset: () => {
              // Mark both tours as completed
              localStorage.setItem(`walletpageCompleted_${userId}`, "true");
              setTourState((prev) => ({
                ...prev,
                homeCompleted: true,
              }));
            },
          });

          driver.defineSteps(tourSteps);
          driver.start();
        } else {
          console.warn("Place ads button not found, completing tour anyway.");
          // Still mark as completed if main element not found
          localStorage.setItem(`walletpageCompleted_${userId}`, "true");
        }
      }

      attempts++;
    }, 1000);
  };

  return (
    <>
      <Navbar onTourComplete={handleTourComplete} />
      <CreateAdPopup isOpen={showPopup} onClose={() => setShowPopup(false)} />

      <div className={styles.walletContainer}>
        <div className={styles.contentsContainer}>
          <div className={styles.firstContent}>
            <div className={styles.firstMain}>
              <div className={styles.firstMainleftContainer}>
                <div className={styles.firstMainHeader}>
                  <h2>Your Wallet</h2>
                </div>
                <div className={styles.firstMainp}>
                  <p>
                    Providing cheap car rental services and safe and comfortable
                    facilities.
                  </p>
                </div>
                <div className={styles.firstMainbutton}>
                  <button id="place-ads-btn" onClick={() => setShowPopup(true)}>
                    Place Ads
                  </button>
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
          <section className={styles.walletBalanceSection}>
            <div className={styles.balanceCard}>
              <div className={styles.balanceAmount}>
                {walletDetails?.totalStars || ""}
                <span style={{ color: "gold", fontSize: "30px" }}>★</span>{" "}
              </div>
              <button
                id="buy-stars"
                className={styles.buyButton}
                onClick={() => setShowBuyStarsModal(true)}
              >
                Buy stars
              </button>
              <div className={styles.referBox}>
                <span>🔗 Refer Codes & Earn</span>
                <code>
                  #1232163311
                  <span>
                    <button className={styles.copyBtn}>📋</button>
                  </span>
                </code>
              </div>
            </div>
            <div className={styles.requestBox}>
              <p>Redeem your stars to physical money</p>
              <button
                id="payout-request"
                className={styles.requestBtn}
                onClick={() => {
                  setIsModalOpen(true);
                }}
              >
                Request payout
              </button>
            </div>
          </section>

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

          {activeTab === "Payouts" && (
            <section className={styles.payoutTableSection} id="payouts">
              <h2>Payout requests</h2>
              <table className={styles.payoutTable}>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Request Id</th>
                    <th>Status</th>
                    <th>Payout amount</th>
                    <th>Download pdf</th>
                  </tr>
                </thead>
                <tbody>
                  {payOutDetails
                    .slice(
                      (payoutPage - 1) * payoutPageSize,
                      payoutPage * payoutPageSize
                    )
                    .map((item, index) => (
                      <tr key={index}>
                        <td>{item.requestedAt || ""}</td>
                        <td>{item._id || ""}</td>
                        <td>
                          {!item.isPayoutCompleted ? "pending" : "Completed"}
                        </td>
                        <td>{item.amount || ""}</td>
                        <td>
                          <button
                            className={styles.redeemBtn}
                            onClick={handleRedeemClick}
                          >
                            Download
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              <Pagination
                current={payoutPage}
                pageSize={payoutPageSize}
                total={payOutDetails.length}
                onChange={(page, size) => {
                  setPayoutPage(page);
                  setPayoutPageSize(size);
                }}
                showSizeChanger
                style={{ marginTop: "20px", textAlign: "right" }}
              />
            </section>
          )}

          {/* {activeTab === "Redeem Payouts" && (
            <section className={styles.payoutTableSection}>
              <h2 id="redeem-payouts">Redeem Payouts</h2>
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
          )} */}
          {activeTab === "Payment History" && (
            <section className={styles.payoutTableSection}>
              <h2 id="payment-history">Payment History</h2>
              <table className={styles.payoutTable}>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Request no</th>
                    <th>Status</th>
                    <th>Payout Star</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentDetails
                    .slice(
                      (paymentPage - 1) * paymentPageSize,
                      paymentPage * paymentPageSize
                    )
                    .map((item, index) => (
                      <tr key={index}>
                        <td>{item.requestedAt}</td>
                        <td>{item._id}</td>
                        <td>{item.payoutStatus}</td>
                        <td>{item.starCount}</td>
                        <td>
                          <button
                            className={styles.redeemBtn}
                            onClick={handleRedeemClick}
                          >
                            Download
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              <Pagination
                current={paymentPage}
                pageSize={paymentPageSize}
                total={paymentDetails.length}
                onChange={(page, size) => {
                  setPaymentPage(page);
                  setPaymentPageSize(size);
                }}
                showSizeChanger
                style={{ marginTop: "20px", textAlign: "right" }}
              />
            </section>
          )}
          {activeTab === "Cancelled payouts" && (
            <section className={styles.payoutTableSection}>
              <h2 id="cancelled-payouts">Cancelled payouts</h2>
              <table className={styles.payoutTable}>
                <thead>
                  <tr>
                    <th style={{ width: "20%" }}>Rejected Date</th>
                    <th style={{ width: "20%" }}>Request no</th>
                    <th style={{ width: "20%" }}>Star</th>
                    <th style={{ width: "20%" }}>Payout amount</th>
                    <th style={{ width: "20%" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {cancelledPayout
                    .slice(
                      (cancelledPage - 1) * cancelledPageSize,
                      cancelledPage * cancelledPageSize
                    )
                    .map((item, index) => (
                      <tr key={index}>
                        <td>{item.rejectedAt}</td>
                        <td>{item._id}</td>
                        <td>{item.starCount}</td>
                        <td>{item.amount}</td>
                        <td>
                          <p>{item.rejectionReason}</p>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              <Pagination
                current={cancelledPage}
                pageSize={cancelledPageSize}
                total={cancelledPayout.length}
                onChange={(page, size) => {
                  setCancelledPage(page);
                  setCancelledPageSize(size);
                }}
                showSizeChanger
                style={{ marginTop: "20px", textAlign: "right" }}
              />
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
      <Modal
        title="Make a Payout"
        open={isModalOpen}
        onOk={handlePayout}
        onCancel={handleCancel}
        okText="Submit"
      >
        <Form layout="vertical">
          <Form.Item label="Enter Star" required>
            <Input
              type="number"
              placeholder="Minimum 1000 star is needed"
              value={payoutAmount}
              onChange={(e) => setPayoutAmount(parseInt(e.target.value) || 0)}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default WalletPage;
