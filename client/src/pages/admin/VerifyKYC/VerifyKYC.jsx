import React, { useState, useEffect } from 'react'
import styles from "./VerifyKYC.module.css"
import Header from '../../../components/Header/Header'
import Sidebar from '../../../components/sidebar/Sidebar'
import UserImage from "../../../assets/cardBack.jpg"
import Idproof from "../../../assets/cardbackground.jpg"
import baseUrl from '../../../baseurl'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Button, Modal } from 'antd';
import { Input } from 'antd';
import { useNavigate } from 'react-router-dom'
const { TextArea } = Input;


function VerifyKYC() {

  const navigate = useNavigate()
  const { id } = useParams()
  const [kycData, setKycData] = useState({})
  const adminId = useSelector((state) => state.admin.id)

  const [rejectionReason, setRejectionReason] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = async () => {
    if (!rejectionReason.trim()) {
      return Modal.warning({
        title: "Missing Reason",
        content: "Please enter a rejection reason before submitting.",
      });
    }

    try {
      const id = kycData.userId
      await rejectKyc(id, rejectionReason);
      console.log("userId", id)
      console.log("reason", rejectionReason)
      setIsModalOpen(false);
      setRejectionReason("");
    } catch (error) {
      console.error("Rejection failed:", error);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };


  function formatDate(isoString) {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  useEffect(() => {
    const verifyKyc = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/v1/admin/kyc-requested-single-user`, { params: { id } })
        console.log("response", response)
        setKycData(response.data.data)
        console.log("kyc state", kycData)
      } catch (error) {
        console.log(error)
      }
    }
    if (id) {
      verifyKyc()
    }

  }, [id])

  useEffect(() => {
    console.log("kycData updated:", kycData);
  }, [kycData]);

  const approveKyc = async () => {
    try {
      console.log("approve userid", id)
      console.log("approve admin id", adminId)
      const approveres = await axios.post(`${baseUrl}/api/v1/admin/kyc-approval`, {
        id: id,
        adminId: adminId
      })
      navigate("/AdminKYC")
      console.log("approveres", approveres)
    } catch (error) {
      console.log(error)
    }
  }

  const rejectKyc = async (userId) => {
    try {
      const rejectres = await axios.post(`${baseUrl}/api/v1/admin/kyc-rejection`, {
        id: userId,
        adminId: adminId,
        rejectionReason: rejectionReason,
      })
      navigate("/AdminKYC")
      console.log("reject res", rejectres)
    } catch (error) {
      console.log(error)
    }
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
                <p>Document Type : {kycData.documentType}</p>
              </div>
            </div>

            <h3 style={{ padding: "10px", marginTop: "15px" }}>Id Proof</h3>
            <div className={styles.Idproof}>
              <div className={styles.Iddetails}>
                <img src={`${baseUrl}${kycData.documentFile}`} />
              </div>
            </div>

            <h3 style={{ padding: "10px", marginTop: "15px" }}>Banking Partner Name *</h3>
            <div className={styles.bankpartner}>
              <div className={styles.bankpartnerdetails}>
                <p>{kycData.bankName}</p>
              </div>
            </div>
            <h3 style={{ padding: "10px", marginTop: "15px" }}>Account Number</h3>
            <div className={styles.bankpartner}>
              <div className={styles.bankpartnerdetails}>
                <p>{kycData.accountNumber}</p>
              </div>
            </div>
            <h3 style={{ padding: "10px", marginTop: "15px" }}>IFSC Code</h3>
            <div className={styles.bankpartner}>
              <div className={styles.bankpartnerdetails}>
                <p>{kycData.ifscCode}</p>
              </div>
            </div>

            <div className={styles.buttons}>
              <Button style={{ backgroundColor: "#693bb8", color: "white" }} onClick={() => {
                showModal();

              }}>Reject</Button>
              <Button onClick={() => approveKyc()}>Approve</Button>
            </div>
            <Modal
              title="Rejection Modal"
              closable={{ 'aria-label': 'Custom Close Button' }}
              open={isModalOpen}
              onOk={handleOk}
              onCancel={handleCancel}
            >
              <TextArea rows={4}
                placeholder="Reject Message"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
            </Modal>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VerifyKYC