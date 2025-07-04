import React, { useState, useEffect } from "react";
import styles from "./Subscriptionplan.module.css";
import SuperSidebar from "../../../components/SuperAdminSideBar/SuperSidebar";
import SubscribeImg from "../../../assets/crown.png"
import CheckMark from "../../../assets/check-mark.png"
import axios from "axios";
import baseUrl from "../../../baseurl";
import Header from "../../../components/Header/Header";

function SubscritionPlan() {
  const [showModal, setShowModal] = useState(false);
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("Month");
  const [data, setData] = useState({})


  const getSubscribe = async () => {
    try {
      const getres = await axios.get(`${baseUrl}/api/v1/subscription/get-subscriptions`);
      console.log("hi", getres.data.settings);
      setData(getres.data.settings);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSubscribe();
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      starCountRequired: price,
      subscriptionDurationDays:
        duration === "Week"
          ? 7
          : duration === "Month"
            ? 30
            : duration === "Year"
              ? 365
              : 0,
    };

    console.log("Submitting payload:", payload);

    try {
      const response = await axios.put(
        `${baseUrl}/api/v1/subscription/edit-subscriptions`,
        payload
      );
      console.log("Subscription updated:", response.data);
      await getSubscribe()

      // Reset state
      setPrice("");
      setDuration("Month");
      setShowModal(false);
    } catch (error) {
      console.error("Error updating subscription:", error);
      alert("Failed to update subscription.");
    }
  };

  return (
    <div className={styles.UserAccount}>
      <SuperSidebar />
      <Header />
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h2>Subscription Plan & Pricing</h2>
        </div>

        <div style={{ marginTop: "50px" }}>
          <div className={styles.card}>
            <img src={SubscribeImg} alt="Subscribe" width="60px" />
            <div className={styles.tag}>Popular</div>
            <h4 className={styles.title}>
              <span>Pro</span>
            </h4>
            <div className={styles.price}>
              <span className={styles.currency}>Star Count: {data.starCountRequired}</span><br />
              <span className={styles.currency}>Duration: {data.subscriptionDurationDays} days</span>
              {/* <span className={styles.period}>/ Monthly</span> */}
            </div>
            <div className={styles.liststyle}>
              <ul>
                <li><img src={CheckMark} width="20px" />{" "}Helloo</li>
                <li><img src={CheckMark} width="20px" />{" "}Helloo</li>
                <li><img src={CheckMark} width="20px" />{" "}Helloo</li>
                <li><img src={CheckMark} width="20px" />{" "}Helloo</li>
                <li><img src={CheckMark} width="20px" />{" "}Helloo</li>

              </ul>
            </div>
            <button className={styles.changeBtn} onClick={() => setShowModal(true)}>
              Change
            </button>
          </div>
        </div>

        {showModal && (
          <div className={styles.modalBackdrop}>
            <div className={styles.modal}>
              <h3>Change Subscription Price</h3>
              <label>
                Change Current Subscription Charge:
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className={styles.inputField}
                  placeholder="Enter new amount"
                />
              </label>
              <label>
                Duration:
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className={styles.inputField}
                >
                  <option value="Week">Week</option>
                  <option value="Month">Month</option>
                  <option value="Year">Year</option>
                </select>
              </label>
              <div className={styles.modalActions}>
                <button onClick={() => setShowModal(false)}>Cancel</button>
                <button onClick={handleSubmit}>Save</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SubscritionPlan;
