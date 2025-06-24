import { React, useState } from "react";
import logo from "../../../assets/Logo.png";
import styles from "./AdminSignup.module.css";
import { Link } from "react-router-dom";
import axios from "axios";
import baseUrl from "../../../baseurl";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAdmin } from "../../../components/features/adminSlice";
import { useSelector } from "react-redux";

function AdminUpdate() {
    const adminId = useSelector((state) => state.admin.id)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [error, setError] = useState("");
    const [form, setForm] = useState(
        {
            adminEmail: "",
            password: "",
            username: "",
            address: ""
        }
    )
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
            const response = await axios.post(`${baseUrl}/api/v1/admin/admin-edit/${adminId}`, form)
            const adminres = form.adminEmail;
            console.log("mail form adminemail", adminres)
           
        } catch (error) {
            console.log(error)
            setError("Something went wrong. Please try again.");
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
                                        <h2>Welcome Admin</h2>
                                    </div>
                                    <div className={styles.formContainer}>
                                        <form className="form" onSubmit={handleSubmit}>
                                            <div className={styles.formContents}>
                                                <label htmlFor="phone" className={styles.label}>
                                                    Admin Name
                                                </label>
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "4px",
                                                    }}
                                                >
                                                    <input
                                                        id="phone"
                                                        name="username"
                                                        type="text"
                                                        value={form.username}
                                                        onChange={handleChange}
                                                        required
                                                        className={styles.input}
                                                        placeholder="Enter your Admin Name"
                                                        style={{ flex: 1 }}
                                                    />
                                                </div>
                                                <label htmlFor="phone" className={styles.label}>
                                                    Address
                                                </label>
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "4px",
                                                    }}
                                                >
                                                    <input
                                                        id="phone"
                                                        name="address"
                                                        type="text"
                                                        value={form.address}
                                                        onChange={handleChange}
                                                        required
                                                        className={styles.input}
                                                        placeholder="Enter your Address"
                                                        style={{ flex: 1 }}
                                                    />
                                                </div>
                                                <label htmlFor="phone" className={styles.label}>
                                                    Email
                                                </label>
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "4px",
                                                    }}
                                                >
                                                    <input
                                                        id="phone"
                                                        name="adminEmail"
                                                        type="text"
                                                        value={form.adminEmail}
                                                        onChange={handleChange}
                                                        required
                                                        className={styles.input}
                                                        placeholder="Enter your Email"
                                                        style={{ flex: 1 }}
                                                    />
                                                </div>
                                                <label htmlFor="phone" className={styles.label}>
                                                    Password
                                                </label>
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "4px",
                                                    }}
                                                >
                                                    <input
                                                        id="phone"
                                                        name="password"
                                                        type="text"
                                                        value={form.password}
                                                        onChange={handleChange}
                                                        required
                                                        className={styles.input}
                                                        placeholder="Enter your Password"
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
                                        <Link className={styles.linkStyle} to={'/Adminlogin'}>Login  </Link>
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

export default AdminUpdate
