import React from 'react'
import styles from "./VerifyKYC.module.css"
import Header from '../../../components/Header/Header'
import Sidebar from '../../../components/sidebar/Sidebar'
import UserImage from "../../../assets/cardBack.jpg"
import Idproof from "../../../assets/cardbackground.jpg"
import { Button } from 'antd'


function VerifyKYC() {
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
              <div className={styles.userimage}>
                <img src={UserImage} />
              </div>
              <div className={styles.usernamedetails}>
                <p>Name : John Doe</p>
                <p>UserId : #78964</p>
                <p>Date : 20/10/2025</p>
                <p>Payout Status : Not Started</p>
              </div>
            </div>

            <h3 style={{ padding: "10px", marginTop: "15px" }}>Id Proof</h3>
            <div className={styles.Idproof}>
              <div className={styles.Iddetails}>
                <img src={Idproof} />
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
            <h3 style={{ padding: "10px", marginTop: "15px" }}>Your Bank Details</h3>
            <div className={styles.Idproof}>
              <div className={styles.Iddetails}>
                <img src={Idproof} />
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