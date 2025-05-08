import React from 'react'
import logo from "../../../assets/Logo.png";
import styles from "./phonelogin.module.css";
import { Link } from "react-router-dom";

function PhoneLogin() {
    return (
        <div>
          <div className={styles.containerOneUser}>
            <div className={styles.containerSubUser}>
              <div className={styles.containerTwoLeft}>
                <div className={styles.leftMain}>
                  <div className={styles.logoContainer}>
                    <div className={styles.logo}>
                      <img src={logo} alt="" />
                    </div>
                  </div>
                  <div className={styles.contentsContainerLeft}>
                    <div className={styles.contentsMainLeft}>
                    <div className={styles.headingMain}>
                      <h2>Welcome Back</h2>
                    </div>
                    <div className={styles.paraContent}>
                      <p>
                        This is a demo content
                      </p>
                    </div>
                    <div className={styles.formContainer}>
                      <form className="form">
                        <div>
                          <label htmlFor="email1" className={styles.label}>
                            Your email
                          </label>
                          <input
                            id="email1"
                            type="email"
                            placeholder="Email@example.com"
                            required
                            className={styles.input}
                          />
                        </div>
    
                        <div>
                          <label
                            htmlFor="password1"
                            className={styles.label}
                            style={{ marginTop: "20px" }}
                          >
                            Your password
                          </label>
                          <input
                            id="password1"
                            type="password"
                            required
                            className={styles.input}
                            placeholder="Enter Your Password"
                          />
                        </div>
                      </form>
                    </div>
                    <div className={styles.forgotPassContainer}>
                      <Link className={styles.linkStyle}>Forgot Password?</Link>
                    </div>
                    <div className={styles.buttonContainer}>
                      <button> Submit</button>
                    </div>
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

export default PhoneLogin
