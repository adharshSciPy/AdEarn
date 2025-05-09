import { React, useState } from "react";
import logo from "../../../assets/Logo.png";
import styles from "./referalpage.module.css";
import { Link } from "react-router-dom";

function ReferalCode() {
  const [coupon, setCoupon] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const value = e.target.value.toUpperCase();
    setCoupon(value);
    setError("");
    setMessage("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = coupon.trim();
    const codePattern = /^[A-Z0-9@#$%&*]{6}$/;

    if (!codePattern.test(trimmed)) {
      setError("Invalid coupon code. Must be 6 characters: A-Z, 0-9, @#$%&*");
      return;
    }

    // Proceed with valid code
    console.log("Coupon code is valid:", trimmed);
    setCoupon("");
    setError("");
  };

  return (
    <div>
      <div className={styles.containerOneUser}>
        <div className={styles.containerSubUser}>
          <div className={styles.containerTwoLeft}>
            <div className={styles.leftMain}>
              <div className={styles.logoContainer}>
                <div className={styles.logo}>
                  <img src={logo} alt="Logo" />
                </div>
              </div>
              <div className={styles.contentsContainerLeft}>
                <div className={styles.contentsMainLeft}>
                  <div className={styles.headingMain}>
                    <h2>Enter Referral Code</h2>
                  </div>
                  <div className={styles.paraContent}>
                    <p>If you have a referral or promo code, enter it below.</p>
                  </div>
                  <div className={styles.formContainer}>
                    <form onSubmit={handleSubmit}>
                      <div className={styles.formContents}>
                        <label className={styles.label}>Coupon Code</label>
                        <div className={styles.inputFlex}>
                          <input
                            id="coupon"
                            name="coupon"
                            value={coupon}
                            onChange={handleChange}
                            required
                            className={styles.input}
                            placeholder="#EDED231"
                          />
                        </div>
                        {error && <p className={styles.errorText}>{error}</p>}
                        {message && (
                          <p className={styles.successText}>{message}</p>
                        )}
                      </div>
                      <div className={styles.buttonContainer}>
                        <button type="submit">Submit</button>
                      </div>
                    </form>
                  </div>
                </div>
              <div className={styles.skipContainer}>
                <button>skip</button>
              </div>

              </div>
            </div>
            <div className={styles.bgContainer}></div>
          </div>
          <div className={styles.containerTwoRight}>
            <div className={styles.rightMain}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReferalCode;
