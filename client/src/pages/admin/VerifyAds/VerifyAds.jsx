import React, { useEffect, useState } from "react";
import styles from "./VerifyAds.module.css";
import Sidebar from "../../../components/sidebar/Sidebar";
import Header from "../../../components/Header/Header";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Button, Modal } from "antd";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import baseUrl from "../../../baseurl";

function VerifyAds() {
  const [unverifiedAd, setUnVerifiedAd] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedAd, setSelectedAd] = useState(null);
  const [IsModalVisibleReject, setIsModalVisibleReject] = useState(false);
  const [reason, setReason] = useState("");
  const { adId } = useParams();
  const navigate = useNavigate();

  const getUnVerifyAd = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/v1/ads/unverified-ads/${adId}`);
      setUnVerifiedAd(response.data.ads);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUnVerifyAd();
  }, []);

  const handleVerify = (id) => {
    setSelectedAd(id);
    setIsModalVisible(true);
  };

  const handleReject = (id) => {
    setSelectedAd(id);
    setIsModalVisibleReject(true);
  };

  const handleApprove = async () => {
    try {
      const response = await axios.post(`${baseUrl}/api/v1/admin/verify-ad`, { adId: selectedAd });
      if (response.status === 200) navigate("/AdminAds");
    } catch (error) {
      console.log(error);
    }
  };

  const handleRejection = async () => {
    try {
      const response = await axios.post(`${baseUrl}/api/v1/admin/reject-ad`, {
        adId: selectedAd,
        reason,
      });
      if (response.status === 200) navigate("/AdminAds");
    } catch (error) {
      console.log(error);
    }
  };

  const adData = unverifiedAd?.imageAd || unverifiedAd?.videoAd || unverifiedAd?.surveyAd;

  return (
    <div className={styles.verifyadsmain}>
      <div className={styles.verifyadscontainer}>
        <Sidebar />
        <Header />
        <div className={styles.adscontainer}>
          <div className={styles.adsimage}>
            <h1>Ads Preview</h1>
            <div className={styles.adspreview}>
              <div className={styles.previewone}>
                {unverifiedAd?.videoAd?.videoUrl ? (
                  <video className={styles.image} src={`${baseUrl}${unverifiedAd.videoAd.videoUrl}`} controls />
                ) : unverifiedAd?.imageAd?.imageUrl ? (
                  <img className={styles.image} src={`${baseUrl}${unverifiedAd.imageAd.imageUrl}`} alt="" />
                ) : (
                  <div>
                    <h3>Survey Questions</h3>
                    {unverifiedAd?.surveyAd?.questions?.map((q, idx) => (
                      <div key={idx} style={{ marginBottom: "15px" }}>
                        <p><strong>Q{idx + 1}:</strong> {q.question}</p>
                        <ul>
                          {q.options?.map((opt, i) => (
                            <li key={i}>{opt}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className={styles.previewtwo}>
                <div style={{ position: "relative", width: 200, height: 200 }}>
                  <CircularProgressbar
                    value={75}
                    styles={buildStyles({ pathColor: "#fff", trailColor: "rgba(255, 255, 255, 0.2)", textColor: "#fff" })}
                  />
                  <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center", color: "white" }}>
                    <div style={{ fontSize: 16 }}>Total views</div>
                    <div style={{ fontSize: 32, fontWeight: "bold" }}>{adData?.userViewsNeeded || 0}</div>
                  </div>
                </div>
                <div className={styles.adsitems}>
                  <div className={styles.listitems}><p>Ad</p></div>
                  <div className={styles.listitems}><p>Total Views</p><p>{adData?.userViewsNeeded}</p></div>
                  <div className={styles.listitems}><p>Total Stars</p><p>{adData?.totalStarsAllocated}</p></div>
                  <div className={styles.listitems}><p>Ads Status</p><p>Not Verified</p></div>
                  <div className={styles.listitems}><p>Start Date</p><p>{adData?.createdAt}</p></div>
                </div>
              </div>
            </div>
            <div className={styles.adsdatamain}>
              <div className={styles.adsname}>
                <div className={styles.adsnametext}><h1>Ad Heading</h1><p>{adData?.title}</p></div>
                <div className={styles.adsnametext}><h1>Ads Category</h1><p>{adData?.description}</p></div>
                {adData?.audioUrl && (
                  <div className={styles.adsnametext}>
                    <h1>Audio</h1>
                    <audio controls><source src={`${baseUrl}${adData.audioUrl}`} /></audio>
                  </div>
                )}
              </div>
            </div>
            <div className={styles.approvalbuttons}>
              <Button style={{ backgroundColor: "#5d32b9", color: "white" }} onClick={() => handleReject(unverifiedAd?._id)}>Reject</Button>
              <Button style={{ color: "#5d32b9" }} onClick={() => handleVerify(unverifiedAd?._id)}>Approve</Button>
            </div>
          </div>
        </div>
      </div>
      <Modal
        title="Verify Ad ?"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalVisible(false)}>Cancel</Button>,
          <Button key="approve" type="primary" onClick={handleApprove}>Approve</Button>
        ]}
      />
      <Modal
        title="Reason for Ad Rejection?"
        visible={IsModalVisibleReject}
        onCancel={() => setIsModalVisibleReject(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalVisibleReject(false)}>Cancel</Button>,
          <Button key="reject" type="primary" onClick={handleRejection}>Reject</Button>
        ]}
      >
        <textarea style={{ width: "100%", minHeight: "100px", padding: "10px" }} value={reason} onChange={(e) => setReason(e.target.value)} />
      </Modal>
    </div>
  );
}

export default VerifyAds;
