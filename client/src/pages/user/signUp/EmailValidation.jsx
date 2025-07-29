import React, { useState } from 'react'
import styles from "./EmailValidation.module.css"
import logo from "../../../assets/Logo.png";
import axios from 'axios';
import baseUrl from '../../../baseurl';
import { useNavigate, useParams } from 'react-router-dom';


function EmailValidation() {
    const [coupon, setCoupon] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [form, setForm] = useState({ email: "" })


    const navigate = useNavigate()
    const { id } = useParams()

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${baseUrl}/api/v1/user/send-email/otp`, {
                email: form.email,
                userId: id
            })
            navigate(`/emailotp/${id}`)
            setMessage(response.data.message)
            console.log(response)
        } catch (error) {
            console.log(error)
            setError(error.message)
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
                                        <h2>Enter Your Email</h2>
                                    </div>
                                    <div className={styles.paraContent}>
                                        <p>If you have a email id, enter it below.</p>
                                    </div>
                                    <div className={styles.formContainer}>
                                        <form onSubmit={handleSubmit}>
                                            <div className={styles.formContents}>
                                                <label className={styles.label}>Your Email</label>
                                                <div className={styles.inputFlex}>
                                                    <input
                                                        id="coupon"
                                                        name="email"
                                                        value={form.email}
                                                        onChange={handleChange}
                                                        required
                                                        className={styles.input}
                                                        placeholder="example@gmail.com"
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

export default EmailValidation

