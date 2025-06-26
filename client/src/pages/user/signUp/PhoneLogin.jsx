import { React, useState } from "react";
import logo from "../../../assets/Logo.png";
import styles from "./phonelogin.module.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import baseUrl from "../../../baseurl";
import { useDispatch } from "react-redux";
import { setUser } from "../../../components/features/slice";


function PhoneLogin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const validatePhone = (value) => {
    const regex = /^\d{10}$/;
    return regex.test(value);
  };

  const handleChange = (e) => {
    setPhone(e.target.value);
    if (error) setError(""); // clear error as user types
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      console.log("phone", phone)
      if (!validatePhone(phone)) {
        setError("Enter a valid phone number starting with +91 and 10 digits.");
        return;
      }
      const response = await axios.post(`${baseUrl}/api/v1/user/send-otp`, { phoneNumber: phone });
      dispatch(setUser({ phone: phone }))
      navigate("/phoneotp")
      console.log("res", response)
      setPhone("")
    } catch (error) {
      console.log(error)
    }
  };
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
                    <p>This is a demo content</p>
                  </div>
                  <div className={styles.formContainer}>
                    <form className="form" onSubmit={handleSubmit}>
                      <div className={styles.formContents}>
                        <label htmlFor="phone" className={styles.label}>
                          Phone Number
                        </label>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <span
                            style={{
                              padding: "15px",
                              background: "#eee",
                              borderRadius: "4px 4px 4px 4px",
                            }}
                          >
                            +91
                          </span>
                          <input
                            id="phone"
                            type="tel"
                            name="phoneNumber"
                            value={phone}
                            onChange={handleChange}
                            required
                            className={styles.input}
                            placeholder="10-digit number"
                            style={{ flex: 1 }}
                          />
                        </div>
                        {error && (
                          <p style={{ color: "red", fontSize: "0.9rem", padding: "0.5rem" }}>
                            {error}
                          </p>
                        )}
                      </div>
                      <div className={styles.buttonContainer}>
                        <button type="submit">Submit</button>
                      </div>
                    </form>
                  </div>
                  <div className={styles.seperator}>
                    <div className={styles.hr}></div>
                    <p>Or</p>
                    <div className={styles.hr}></div>
                  </div>
                  <div className={styles.signup}>
                    <p>Already have an account?</p>
                    <Link className={styles.linkStyle} to={'/'}>Login  </Link>
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

export default PhoneLogin;
