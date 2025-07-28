import React, { useEffect, useState } from "react";
import styles from "./coupon.module.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import baseUrl from "../../../baseurl";
import Navbar from "../NavBar/Navbar";
import CreateAdPopup from "../../../components/AdPopup/CreateAdPopup";
import Delete from "../../../assets/delete.png";
import Driver from "driver.js";
import "driver.js/dist/driver.min.css";

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
  const [tourState, setTourState] = useState({
    navbarCompleted: false,
    homeCompleted: false,
    tabsCompleted: false,
  });

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
        role: 300
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

  // Handle tour completion with chaining
  const handleTourComplete = (tourType) => {
    setTourState((prev) => ({
      ...prev,
      [tourType === "navbar" ? "navbarCompleted" : 
       tourType === "home" ? "homeCompleted" : 
       "tabsCompleted"]: true,
    }));

    // Chain tours: coupon page → tabs tour
    if (tourType === "home") {
      setTimeout(() => {
        startTabsTour();
      }, 1000);
    }
  };

  // Start coupon page tour when main tour is completed
  useEffect(() => {
    const hometourCompleted = localStorage.getItem(`userTourCompleted_${userId}`);
    const couponpageCompleted = localStorage.getItem(`couponpageCompleted_${userId}`);

    if (hometourCompleted && !couponpageCompleted) {
      setTimeout(() => {
        startCouponPageTour();
      }, 500);
    }
  }, [userId]);

  // Also trigger when navbar completes via callback
  useEffect(() => {
    if (tourState.navbarCompleted) {
      setTimeout(() => {
        startCouponPageTour();
      }, 500);
    }
  }, [tourState.navbarCompleted]);

  // Start tabs tour when coupon page tour completes
  useEffect(() => {
    if (tourState.homeCompleted && !tourState.tabsCompleted) {
      setTimeout(() => {
        startTabsTour();
      }, 500);
    }
  }, [tourState.homeCompleted]);

  const startCouponPageTour = () => {
    const couponpageCompleted = localStorage.getItem(`couponpageCompleted_${userId}`);
    if (couponpageCompleted) return;

    let attempts = 0;

    const interval = setInterval(() => {
      const canStartTour = document.querySelector("#place-ads-btn");

      if (canStartTour || attempts > 10) {
        clearInterval(interval);

        if (canStartTour) {
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

          if (document.querySelector("#coupon-tabs-container")) {
            tourSteps.push({
              element: "#coupon-tabs-container",
              popover: {
                title: "Coupon Tabs",
                description: "Switch between different coupon options using these tabs.",
                position: "bottom",
              },
            });
          }

          const driver = new Driver({
            animate: true,
            opacity: 0.5,
            stageBackground: "rgba(0, 0, 0, 0.5)",
            allowClose: true,
            doneBtnText: "Next: Tabs Tour",
            closeBtnText: "Skip",
            nextBtnText: "Next",
            prevBtnText: "Previous",
            onReset: () => {
              localStorage.setItem(`couponpageCompleted_${userId}`, "true");
              handleTourComplete("home");
            },
          });

          driver.defineSteps(tourSteps);
          driver.start();
        } else {
          console.warn("Place ads button not found, completing tour anyway.");
          localStorage.setItem(`couponpageCompleted_${userId}`, "true");
          handleTourComplete("home");
        }
      }

      attempts++;
    }, 1000);
  };

  const startTabsTour = () => {
    const tabsTourCompleted = localStorage.getItem(`couponTabsTourCompleted_${userId}`);
    if (tabsTourCompleted) return;

    // Ensure we start with the Redeem Coupons tab active
    setActiveTab("Redeem Coupons");

    let attempts = 0;

    const interval = setInterval(() => {
      const canStartTabsTour = document.querySelector("#redeem-coupon-tab");

      if (canStartTabsTour || attempts > 10) {
        clearInterval(interval);

        if (canStartTabsTour) {
          const driver = new Driver({
            animate: true,
            opacity: 0.5,
            stageBackground: "rgba(0, 0, 0, 0.5)",
            allowClose: true,
            doneBtnText: "Complete Tabs Tour!",
            closeBtnText: "Skip Tabs Tour",
            nextBtnText: "Next",
            prevBtnText: "Previous",
            onNext: (element) => {
              // Handle tab switching during tour
              if (element && element.element === "#request-coupon-tab") {
                // Switch to Request Coupons tab when clicking on it
                setTimeout(() => {
                  setActiveTab("Request Coupons");
                }, 100);
              }
            },
            onPrevious: (element) => {
              // Handle tab switching when going back
              if (element && element.element === "#redeem-coupon-content") {
                setTimeout(() => {
                  setActiveTab("Redeem Coupons");
                }, 100);
              }
            },
            onReset: () => {
              localStorage.setItem(`couponTabsTourCompleted_${userId}`, "true");
              setTourState((prev) => ({
                ...prev,
                tabsCompleted: true,
              }));
            },
          });

          // Define tour steps dynamically
          const tourSteps = [
            // Step 1: Redeem Coupons Tab
            {
              element: "#redeem-coupon-tab",
              popover: {
                title: "Redeem Coupons Tab",
                description: "Click here to redeem coupon codes and unlock rewards.",
                position: "bottom",
              },
            },
            // Step 2: Redeem Coupon Content
            {
              element: "#redeem-coupon-content",
              popover: {
                title: "Redeem Coupon Section",
                description: "Enter your coupon code here to apply it to your account.",
                position: "top",
              },
            },
            // Step 3: Request Coupons Tab
            {
              element: "#request-coupon-tab",
              popover: {
                title: "Request Coupons Tab",
                description: "Switch to this tab to request new coupons from admin. Click Next to see the form.",
                position: "bottom",
              },
              onNext: () => {
                // Switch to Request Coupons tab before next step
                setActiveTab("Request Coupons");
                // Wait for DOM to update
                return new Promise((resolve) => {
                  setTimeout(resolve, 300);
                });
              },
            },
            // Step 4: Request Coupon Content (will be visible after tab switch)
            {
              element: "#request-coupon-content",
              popover: {
                title: "Request Coupon Section",
                description: "Fill out this form to request new coupons with specific star values.",
                position: "top",
              },
            },
          ];

          driver.defineSteps(tourSteps);
          driver.start();
        } else {
          console.warn("Tab elements not found, completing tabs tour anyway.");
          localStorage.setItem(`couponTabsTourCompleted_${userId}`, "true");
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
                  <h2>Coupons</h2>
                </div>
                <div className={styles.firstMainp}></div>
                <div className={styles.firstMainbutton} id="place-ads-btn">
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
          <nav className={styles.tabMenu} id="coupon-tabs-container">
            <ul>
              {tabs.map((tab, index) => (
                <li
                  key={tab}
                  id={index === 0 ? "redeem-coupon-tab" : "request-coupon-tab"}
                  className={activeTab === tab ? styles.active : ""}
                  onClick={() => handleTabClick(tab)}
                >
                  {tab}
                </li>
              ))}
            </ul>
          </nav>

          {activeTab === "Redeem Coupons" && (
            <section className={styles.payoutTableSection} id="redeem-coupon-content">
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

          {activeTab === "Request Coupons" && (
            <section className={styles.payoutTableSection} id="request-coupon-content">
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
              />
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