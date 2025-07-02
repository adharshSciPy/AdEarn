import { React, useState } from "react";
import logo from "../../../assets/Logo.png";
import styles from "./Adminemailregister.module.css";
import { Link } from "react-router-dom";
import axios from "axios";
import baseUrl from "../../../baseurl";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAdmin } from "../../../components/features/adminSlice";
import { Modal, Input, message } from "antd";

function Adminemailregister() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const showModal = () => setIsModalOpen(true);

  const handleCancel = () => setIsModalOpen(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    adminEmail: "",
    password: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${baseUrl}/api/v1/admin/admin-login`,
        form
      );
      const adminres = response.data;
      console.log("res", response.data);
      dispatch(setAdmin(adminres));

      setForm({
        adminEmail: "",
        password: "",
      });
      navigate("/admindashboard");
    } catch (error) {
      console.log(error);
    }
  };
  const handleForgotSubmit = async () => {
    if (!email ) {
      message.error("Please enter a valid email .");
      return;
    }
    try {
      console.log(email);
      
      const response = await axios.post(
        `${baseUrl}/api/v1/admin/forgot-password/send-otp`,
        {
          adminEmail: email,
        }
      );
      if (response.status === 200) {
        navigate(`/resendOtpAdmin/${email}`);
      }
    } catch (error) {
      console.log(error);
    }
    setIsModalOpen(false);
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
                    <p>Admin Login</p>
                  </div>
                  <div className={styles.formContainer}>
                    <form className="form" onSubmit={handleSubmit}>
                      <div>
                        <label htmlFor="email1" className={styles.label}>
                          Your email
                        </label>
                        <input
                          id="email1"
                          name="adminEmail"
                          type="email"
                          placeholder="Email@example.com"
                          required
                          className={styles.input}
                          value={form.adminEmail}
                          onChange={handleChange}
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
                          name="password"
                          type="password"
                          required
                          className={styles.input}
                          placeholder="Enter Your Password"
                          value={form.password}
                          onChange={handleChange}
                        />
                      </div>

                      <div className={styles.forgotPassContainer}>
                        <Link className={styles.linkStyle} onClick={showModal}>
                          Forgot Password?
                        </Link>
                      </div>

                      <div className={styles.buttonContainer}>
                        <button type="submit">Login</button>
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
      <Modal
        title="Reset Password"
        open={isModalOpen}
        onOk={handleForgotSubmit}
        onCancel={handleCancel}
        okText="Send Reset Link"
      >
        <Input
          placeholder="Enter your email number"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Modal>
    </div>
  );
}

export default Adminemailregister;
