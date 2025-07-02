import React, { useState } from "react";
import logo from "../../../assets/Logo.png";
import styles from "../../user/signUp/form1.module.css";
import baseUrl from "../../../baseurl";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function ResetPassAdmin() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { email } = useParams(); // ✅ changed from phone to email

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password) return alert("Please enter a new password");

    try {
      setLoading(true);
      const response = await axios.post(
        `${baseUrl}/api/v1/admin/forgot-password/reset-password`, // ✅ use correct admin endpoint
        {
          adminEmail: email, // ✅ changed from phoneNumber
          newPassword: password,
        }
      );

      alert("Password reset successful");
      navigate("/adminemail"); // ✅ or wherever your admin login page is
    } catch (err) {
      alert(err?.response?.data?.message || "Password reset failed");
    } finally {
      setLoading(false);
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
                  <img src={logo} alt="logo" />
                </div>
              </div>
              <div className={styles.contentsContainerLeft}>
                <div className={styles.contentsMainLeft}>
                  <div className={styles.headingMain}>
                    <h2>Admin Password Reset</h2>
                  </div>
                  <div className={styles.formContainer}>
                    <form className="form" onSubmit={handleSubmit}>
                      <div>
                        <label
                          htmlFor="password"
                          className={styles.label}
                          style={{ marginTop: "20px" }}
                        >
                          New Password
                        </label>
                        <input
                          style={{ width: "100%", marginTop: "10px" }}
                          type="password"
                          id="password"
                          name="password"
                          placeholder="Enter new password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>

                      <div className={styles.buttonContainer}>
                        <button type="submit" disabled={loading}>
                          {loading ? "Resetting..." : "Continue"}
                        </button>
                      </div>
                    </form>
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

export default ResetPassAdmin;
