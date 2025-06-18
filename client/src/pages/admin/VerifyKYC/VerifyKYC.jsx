import React, { useState, useEffect } from 'react'
import styles from "./VerifyKYC.module.css"
import Header from '../../../components/Header/Header'
import Sidebar from '../../../components/sidebar/Sidebar'
import UserImage from "../../../assets/cardBack.jpg"
import Idproof from "../../../assets/cardbackground.jpg"
import { Button } from 'antd'
import baseUrl from '../../../baseurl'
import axios from 'axios'
import { useLocation } from "react-router-dom";


function VerifyKYC() {

  const { state } = useLocation();
  const kycData = state?.kycData;

  useEffect(() => {
    try {
      console.log("vada", kycData)
    } catch (error) {
      console.log(error)
    }
  }, [])

  function formatDate(isoString) {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }


  return (
    <div className={styles.KYCDetails}>
      <div className={styles.KYCdetailsmain}>
        <Header />
        <Sidebar />
        <div className={styles.Kyccontainer}>
          <div style={{ width: '100%', maxWidth: '1550px', height: '600px', padding: '30px' }} className={styles.kycimage}>
            <h1>KYC Details</h1>
            <div className={styles.logbutton}>
              <Button>Log</Button>
            </div>
            <div className={styles.kycuserdetails}>
              {/* <div className={styles.userimage}>
                <img src={UserImage} />
              </div> */}
              <div className={styles.usernamedetails}>
                <p>Name : {kycData.fullName}</p>
                <p>Email : {kycData.email}</p>
                <p>Date : {formatDate(kycData.createdAt)}</p>
                <p>Phone : {kycData.phoneNumber}</p>
              </div>
            </div>

            <h3 style={{ padding: "10px", marginTop: "15px" }}>Id Proof</h3>
            <div className={styles.Idproof}>
              <div className={styles.Iddetails}>
                <img src={kycData.documentFile} />
              </div>
            </div>

            <h3 style={{ padding: "10px", marginTop: "15px" }}>Banking Partner Name *</h3>
            <div className={styles.bankpartner}>
              <div className={styles.bankpartnerdetails}>
                <p>State Bank Of India</p>
              </div>
            </div>
            <h3 style={{ padding: "10px", marginTop: "15px" }}>Account Number</h3>
            <div className={styles.bankpartner}>
              <div className={styles.bankpartnerdetails}>
                <p>7896 4582 1561 4545</p>
              </div>
            </div>
            <h3 style={{ padding: "10px", marginTop: "15px" }}>IFSC Code</h3>
            <div className={styles.bankpartner}>
              <div className={styles.bankpartnerdetails}>
                <p>IFSC Code</p>
              </div>
            </div>

            <div className={styles.buttons}>
              <Button style={{ backgroundColor: "#693bb8", color: "white" }}>Reject</Button>
              <Button>Approve</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VerifyKYC