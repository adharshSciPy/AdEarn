import React, { useState, useEffect } from 'react'
import styles from './PayoutPage.module.css'
import Header from '../../../components/Header/Header'
import SuperSidebar from "../../../components/SuperAdminSideBar/SuperSidebar"
import axios from "axios"
import baseUrl from "../../../baseurl"
import { useParams, useNavigate } from 'react-router-dom'
import { Button, Input, Modal } from 'antd'
const { TextArea } = Input;

function PayoutPage() {

    const [form, setForm] = useState({
        reason: ""
    });


    const [data, setData] = useState({});
    const [user, setUser] = useState({});
    const [kyc, setKyc] = useState({})

    const paramsid = useParams()
    const navigate = useNavigate()

    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
        handleReject()
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        const singlepayout = async () => {
            try {
                console.log("idid", paramsid)
                const id = paramsid.id;
                const response = await axios.get(`${baseUrl}/api/v1/payout/single-unverified/request/${id}`);
                setData(response.data)
                setUser(response.data.user)
                setKyc(response.data.user.kycDetails)
                console.log(response)
            } catch (error) {
                console.log(error)
            }
        }
        singlepayout()
    }, [])

    const handleApprove = async () => {
        try {
            const id = paramsid.id;
            const approve = await axios.patch(`${baseUrl}/api/v1/payout/verify/request/${id}`);
            navigate("/superadminuseraccount")
            console.log(approve)
        } catch (error) {
            console.log(error)
        }
    }

    const handleReject = async () => {
        try {
            const id = paramsid.id;
            const reject = await axios.patch(`${baseUrl}/api/v1/payout/reject/request/${id}`, {
                reason: form.reason,
            });
            navigate("/superadminuseraccount")
            console.log(reject)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className={styles.payoutmain}>
            <div className={styles.payoutsection}>
                <Header />
                <SuperSidebar />
                <div className={styles.payoutcontainer}>
                    <div style={{ width: '100%', maxWidth: '1550px', height: '600px', padding: '30px' }} className={styles.SuperCard}>
                        <div className={styles.payoutdata}>
                            <div className={styles.datalist}>
                                <h1 style={{ display: "flex", justifyContent: "center" }}>Verify payouts</h1>
                            </div>
                            <div className={styles.payouts}>
                                <div className={styles.form}>
                                    <div>Name: {user.firstName}{" "}{user.lastName}</div>
                                    <div>Gender: {user.gender}</div>
                                    <div>Email: {user.email}</div>
                                    <div>Education: {user.highestEducation}</div>
                                    <div>Location: {user.location},{user.city}</div>
                                </div>
                                <div className={styles.form}>
                                    <div>Amount: {data.amount}</div>
                                    <div>Star Count: {data.starCount}</div>
                                    <div>Employed In: {user.employedIn}</div>
                                    <div>Profession: {user.profession}</div>
                                    <div>Referral Code: {user.myReferalCode}</div>
                                </div>

                            </div>

                            <div className={styles.datalist}>
                                <h1 style={{ display: "flex", justifyContent: "center" }}>Kyc Details</h1>
                            </div>
                            <div className={styles.payouts}>
                                <div className={styles.form}>
                                    <div>Name: {kyc.fullName}</div>
                                    <div>Gender: {kyc.gender}</div>
                                    <div>Phone : {kyc.phoneNumber}</div>
                                    <div>IFSC Code: {kyc.ifscCode}</div>
                                    <div>Guardian: {kyc.guardianName}</div>
                                    <div>Email: {kyc.email}</div>

                                </div>
                                <div className={styles.form}>
                                    <div>Bank Name: {kyc.bankName}</div>
                                    <div>KYC Status: {kyc.kycStatus}</div>
                                    <div>Document No: {kyc.documentNumber}</div>
                                    <div>Account No: {kyc.accountNumber}</div>
                                    <div>Document Type: {kyc.documentType}</div>
                                    <div>Address: {kyc.currentAddress}</div>
                                </div>

                            </div>
                            <div className={styles.documentpreview}>
                                <h2 style={{ marginBottom: "12px", textAlign: "center" }}>Document Preview</h2>

                                {kyc.documentFile ? (
                                    <div style={{ display: "flex", justifyContent: "center" }}>
                                        <img
                                            src={`${baseUrl}${kyc.documentFile}`}
                                            alt="KYC Document"
                                            style={{
                                                width: '300px',
                                                maxHeight: '500px',
                                                objectFit: 'contain',
                                                border: '1px solid #ccc',
                                                borderRadius: '8px',
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <p style={{ textAlign: "center", color: "gray" }}>No document uploaded.</p>
                                )}
                            </div>


                            <div className={styles.btngroup}>
                                <Button className={styles.approvebtn} onClick={() => handleApprove()}>Approve</Button>
                                <Button onClick={showModal}>Reject</Button>
                            </div>
                        </div>
                        <Modal
                            title="Payout Rejection"
                            closable={{ 'aria-label': 'Custom Close Button' }}
                            open={isModalOpen}
                            onOk={handleOk}
                            onCancel={handleCancel}
                        >
                            <TextArea rows={4} placeholder="Reasons" value={form.reason}
                                onChange={(e) => setForm({ ...form, reason: e.target.value })} />
                        </Modal>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PayoutPage