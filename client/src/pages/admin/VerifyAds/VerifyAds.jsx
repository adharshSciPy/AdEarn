import React, { useEffect, useState } from "react";
import styles from "./VerifyAds.module.css";
import Sidebar from "../../../components/sidebar/Sidebar";
import Header from "../../../components/Header/Header";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Button } from "antd";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import baseUrl from "../../../baseurl";
import { Modal } from "antd";

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
      console.log("iidd", adId)
      const response = await axios.get(
        `${baseUrl}/api/v1/ads/unverified-ads/${adId}`
      );
      setUnVerifiedAd(response.data.ad);
      console.log(response);
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
      const response = await axios.post(`${baseUrl}/api/v1/admin/verify-ad`, {
        adId: selectedAd,
      });
      if (response.status === 200) {
        navigate("/AdminAds");
      }
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };
  const handleRejection = async () => {
    try {
      const response = await axios.post(`${baseUrl}/api/v1/admin/reject-ad`, {
        adId: selectedAd,
        reason: reason,
      });
      if (response.status === 200) {
        navigate("/AdminAds");
      }
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  function formatDate(isoString) {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  return (
    <div className={styles.verifyadsmain}>
      <div className={styles.verifyadscontainer}>
        <Sidebar />
        <Header />
        <div className={styles.adscontainer}>
          <div
            style={{
              width: "100%",
              maxWidth: "1550px",
              height: "600px",
              padding: "30px",
            }}
            className={styles.adsimage}
          >
            <h1>Ads Preview</h1>
            <div className={styles.adspreview}>
              <div className={styles.previewone}>
                {unverifiedAd?.videoAd?.videoUrl ? (
                  <video
                    className={styles.image}
                    src={`${baseUrl}${unverifiedAd.videoAd.videoUrl}`}
                    controls
                  />
                ) : unverifiedAd?.imageAd?.imageUrl ? (
                  <img
                    className={styles.image}
                    src={`${baseUrl}${unverifiedAd.imageAd.imageUrl}`}
                    alt=""
                  />
                ) : unverifiedAd?.surveyAd?.imageUrl ? (
                  <img
                    className={styles.image}
                    src={`${baseUrl}${unverifiedAd.surveyAd.imageUrl}`}
                    alt=""
                  />
                ) : null}
              </div>

              <div className={styles.previewtwo}>
                <div
                  style={{
                    position: "relative",
                    width: 200,
                    height: 200,
                  }}
                >
                  <CircularProgressbar
                    value={75}
                    styles={buildStyles({
                      pathColor: "#fff",
                      trailColor: "rgba(255, 255, 255, 0.2)",
                      textColor: "#fff",
                    })}
                  />

                  {/* Centered Custom Text */}
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      textAlign: "center",
                      color: "white",
                      pointerEvents: "none",
                    }}
                  >
                    <div style={{ fontSize: 16, fontWeight: 400 }}>
                      Total views
                    </div>
                    <div style={{ fontSize: 32, fontWeight: "bold" }}>
                      {unverifiedAd?.imageAd?.userViewsNeeded ? (
                        <p>{unverifiedAd?.imageAd?.userViewsNeeded}</p>
                      ) : unverifiedAd?.videoAd?.userViewsNeeded ? (
                        <p>{unverifiedAd?.videoAd?.userViewsNeeded}</p>
                      ) : unverifiedAd?.surveyAd?.userViewsNeeded ? (
                        <p>{unverifiedAd?.surveyAd?.userViewsNeeded}</p>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className={styles.adsitems}>
                  <div className={styles.listitems}>
                    <div>
                      <p>Ad</p>
                    </div>
                    <div>
                      {unverifiedAd?.imageAd?.title ? (
                        <p>{unverifiedAd?.imageAd?.title}</p>
                      ) : unverifiedAd?.videoAd?.title ? (
                        <p>{unverifiedAd?.videoAd?.title}</p>
                      ) : unverifiedAd?.surveyAd?.title ? (
                        <p>{unverifiedAd?.surveyAd?.title}</p>
                      ) : null}
                    </div>
                  </div>
                  <div className={styles.listitems}>
                    <div>
                      <p>Total Views</p>
                    </div>
                    <div>
                      {unverifiedAd?.imageAd?.userViewsNeeded ? (
                        <p>{unverifiedAd?.imageAd?.userViewsNeeded}</p>
                      ) : unverifiedAd?.videoAd?.userViewsNeeded ? (
                        <p>{unverifiedAd?.videoAd?.userViewsNeeded}</p>
                      ) : unverifiedAd?.surveyAd?.userViewsNeeded ? (
                        <p>{unverifiedAd?.surveyAd?.userViewsNeeded}</p>
                      ) : null}
                    </div>
                  </div>
                  <div className={styles.listitems}>
                    <div>
                      <p>Total stars</p>
                    </div>
                    <div>
                      {unverifiedAd?.imageAd?.totalStarsAllocated ? (
                        <p>{unverifiedAd?.imageAd?.totalStarsAllocated}</p>
                      ) : unverifiedAd?.videoAd?.totalStarsAllocated ? (
                        <p>{unverifiedAd?.videoAd?.totalStarsAllocated}</p>
                      ) : unverifiedAd?.surveyAd?.totalStarsAllocated ? (
                        <p>{unverifiedAd?.surveyAd?.totalStarsAllocated}</p>
                      ) : null}
                    </div>
                  </div>
                  <div className={styles.listitems}>
                    <div>
                      <p>Needed View Count</p>
                    </div>
                    <div>
                      {unverifiedAd?.imageAd?.userViewsNeeded !== undefined ? (
                        <p>{unverifiedAd.imageAd.userViewsNeeded}</p>
                      ) : unverifiedAd?.videoAd?.userViewsNeeded !== undefined ? (
                        <p>{unverifiedAd.videoAd.userViewsNeeded}</p>
                      ) : unverifiedAd?.surveyAd?.userViewsNeeded !== undefined ? (
                        <p>{unverifiedAd.surveyAd.userViewsNeeded}</p>
                      ) : (
                        <p>Not available</p>
                      )}
                    </div>
                  </div>
                  <div className={styles.listitems}>
                    <div>
                      <p>Start Date</p>
                    </div>
                    <div>
                      {unverifiedAd?.imageAd?.createdAt ? (
                        <p>{formatDate(unverifiedAd.imageAd.createdAt)}</p>
                      ) : unverifiedAd?.videoAd?.createdAt ? (
                        <p>{formatDate(unverifiedAd.videoAd.createdAt)}</p>
                      ) : unverifiedAd?.surveyAd?.createdAt ? (
                        <p>{formatDate(unverifiedAd.surveyAd.createdAt)}</p>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.adsdatamain}>
              <div className={styles.adsname}>
                <div className={styles.adsnametext}>
                  <div>
                    <h1>Ad Heading</h1>
                  </div>
                  <div>
                    {unverifiedAd?.imageAd?.title ? (
                      <p>{unverifiedAd?.imageAd?.title}</p>
                    ) : unverifiedAd?.videoAd?.title ? (
                      <p>{unverifiedAd?.videoAd?.title}</p>
                    ) : unverifiedAd?.surveyAd?.title ? (
                      <p>{unverifiedAd?.surveyAd?.title}</p>
                    ) : null}
                  </div>
                </div>
                <div className={styles.adsnametext}>
                  <div>
                    <h1>Ads Category</h1>
                  </div>
                  <div>
                    {unverifiedAd?.imageAd?.description ? (
                      <p>{unverifiedAd?.imageAd?.description}</p>
                    ) : unverifiedAd?.videoAd?.description ? (
                      <p>{unverifiedAd?.videoAd?.description}</p>
                    ) : unverifiedAd?.surveyAd?.description ? (
                      <p>{unverifiedAd?.surveyAd?.description}</p>
                    ) : null}
                  </div>
                </div>
                {(unverifiedAd?.imageAd?.audioUrl ||
                  unverifiedAd?.videoAd?.audioUrl) && (
                    <div className={styles.adsnametext}>
                      <div>
                        <h1>Audio</h1>
                      </div>
                      <div>
                        {unverifiedAd?.imageAd?.audioUrl ? (
                          <audio controls>
                            <source
                              src={`${baseUrl}${unverifiedAd.imageAd.audioUrl}`}
                            />
                            Your browser does not support the audio element.
                          </audio>
                        ) : (
                          <audio controls>
                            <source
                              src={`${baseUrl}${unverifiedAd.videoAd.audioUrl}`}
                            />
                            Your browser does not support the audio element.
                          </audio>
                        )}
                      </div>
                    </div>
                  )}
                <div className={styles.adsnametext}>
                  <div>
                    <h1>Ads Question</h1>
                  </div>
                  <div>
                    <div>
                      {unverifiedAd?.surveyAd?.questions?.map((item, index) => (
                        <div key={index} style={{ marginBottom: "15px" }}>
                          <p style={{ fontSize: "20px", fontWeight: "bold" }}>
                            {item.questionText}
                          </p>
                          <div style={{ display: "flex" }}>
                            {item.options?.map((ans, i) => (
                              <div className="" >
                                <label
                                  key={i}
                                  style={{ display: "block", marginTop: "10px", marginLeft: "10px" }}
                                >
                                  <input
                                    type="checkbox"
                                    disabled
                                    style={{
                                      marginRight: "8px",
                                      marginTop: "10px",
                                    }}
                                  />
                                  {ans}
                                </label>
                              </div>
                            ))}
                          </div>

                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.approvalbuttons}>
              <Button
                style={{ backgroundColor: "#5d32b9", color: "white" }}
                onClick={() => handleReject(unverifiedAd?._id)}
              >
                Reject
              </Button>
              <Button
                style={{ color: "#5d32b9" }}
                onClick={() => handleVerify(unverifiedAd?._id)}
              >
                Approve
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Modal
        title="Verify Ad ?"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalVisible(false)}>
            Cancel
          </Button>,
          <Button
            key="approve"
            type="primary"
            onClick={() => handleApprove(selectedAd)}
          >
            Approve
          </Button>,
        ]}
      ></Modal>
      <Modal
        title="Reason for Ad Rejection?"
        visible={IsModalVisibleReject}
        onCancel={() => setIsModalVisibleReject(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalVisibleReject(false)}>
            Cancel
          </Button>,
          <Button
            key="Reject"
            type="primary"
            onClick={() => handleRejection(selectedAd)}
          >
            Reject
          </Button>,
        ]}
      >
        <textarea
          style={{ width: "100%", minHeight: "100px", padding: "10px" }}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </Modal>
    </div>
  );
}

export default VerifyAds;
