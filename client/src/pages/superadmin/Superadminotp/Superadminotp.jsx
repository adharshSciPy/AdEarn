import { React, useState } from "react";
import logo from "../../../assets/Logo.png";
import styles from "./Superadminotp.module.css";
import { useNavigate,useParams } from "react-router-dom";
import axios from "axios";
import baseUrl from "../../../baseurl";

function Superadminotp() {
  const navigate = useNavigate();
  const { email } = useParams(); 
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");

  const handleChange = (e, index) => {
    const { value } = e.target;

    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 6) {
      setError("Please enter a 6-digit OTP.");
      return;
    }

    try {
      console.log(email);

      const response = await axios.post(
        `${baseUrl}/api/v1/super-admin/forgot-password/verify-otp`, // ⬅️ admin endpoint
        {
          email: email, // ⬅️ changed from phoneNumber
          otp: enteredOtp,
        }
      );

      if (response.status === 200) {
        navigate(`/resetPassSuper/${email}`); // ⬅️ redirect to admin password reset
      }
    } catch (error) {
      console.log(error);
      setError("OTP verification failed. Please try again.");
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
                  <img src={logo} alt="Logo" />
                </div>
              </div>
              <div className={styles.contentsContainerLeft}>
                <div className={styles.contentsMainLeft}>
                  <div className={styles.headingMain}>
                    <h2>Enter OTP</h2>
                  </div>
                  <div className={styles.paraContent}>
                    <p>We've sent a 6-digit OTP to your email.</p>
                  </div>
                  <div className={styles.formContainer}>
                    <form className="form" onSubmit={handleSubmit}>
                      <div className={styles.formContents}>
                        {otp.map((digit, index) => (
                          <input
                            key={index}
                            id={`otp-${index}`}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleChange(e, index)}
                            className={styles.otpInput}
                          />
                        ))}
                      </div>
                      {error && <p className={styles.errorText}>{error}</p>}
                      <div className={styles.buttonContainer}>
                        <button type="submit">Submit</button>
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

export default Superadminotp;
