import React, { useEffect, useState } from "react";
import styles from "./AdPreview.module.css";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Modal, Button } from "antd";
import axios from "axios";
import { useParams } from "react-router-dom";
import baseUrl from "../../../baseurl";
import ScratchCom from "./ScratchComponent/ScratchCom";

function AdPreview() {
  const { id, adId } = useParams();
  const [unverifiedAd, setUnVerifiedAd] = useState(null);
  const [reward, setReward] = useState({});
  const [showScratchModal, setShowScratchModal] = useState(false);
  const [scratchCompleted, setScratchCompleted] = useState(false);

  // Fetch ad details immediately
  const getAddDetails = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/ads/single-verified/${adId}`
      );
      setUnVerifiedAd(response.data.ad);
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch reward after scratch completed
  const getAddContribution = async () => {
    try {
      const response = await axios.post(
        `${baseUrl}/api/v1/ads/view-ads/${id}/${adId}`
      );
      setReward(response.data);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Show scratch card modal after 6 seconds
  useEffect(() => {
    getAddDetails();
    const timer = setTimeout(() => setShowScratchModal(true), 6000);
    return () => clearTimeout(timer);
  }, [adId, id]);

  // Handler after scratch card is completed
  const handleScratchComplete = async () => {
    setScratchCompleted(true);
    await getAddContribution();
  };

  // Close modal handler
  const handleModalClose = () => {
    setShowScratchModal(false);
    setScratchCompleted(false);
  };

  return (
    <div className={styles.verifyadsmain}>
      <div className={styles.verifyadscontainer}>
        <div className={styles.adscontainer}>
          <div
            style={{ width: "100%", height: "maxContent" }}
            className={styles.adsimage}
          >
            <h1 style={{ padding: "20px" }}>Ads Preview</h1>
            <div className={styles.adspreview}>
              <div className={styles.previewone}>
                {unverifiedAd?.videoAd?.videoUrl ? (
                  <video
                    className={styles.image}
                    src={`${baseUrl}${unverifiedAd.videoAd.videoUrl}`}
                    controls
                  />
                ) : (
                  <img
                    className={styles.image}
                    src={`${baseUrl}${unverifiedAd?.imageAd?.imageUrl || ""}`}
                    alt=""
                  />
                )}
              </div>
              <div className={styles.previewtwo}>
                <div
                  className={styles.bar}
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
                      {unverifiedAd?.imageAd?.userViewsNeeded}
                    </div>
                  </div>
                </div>
                <div className={styles.adsitems}>
                  <div className={styles.listitems}>
                    <div>
                      <p>Ad</p>
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
                      ) : null}
                    </div>
                  </div>
                  <div className={styles.listitems}>
                    <div>
                      <p>Start Date</p>
                    </div>
                    <div>
                      {unverifiedAd?.imageAd?.createdAt ? (
                        <p>
                        {new Date(
                          unverifiedAd?.imageAd?.createdAt
                        ).toLocaleDateString()}
                      </p>
                      ) : unverifiedAd?.videoAd?.createdAt ? (
                       <p>
                        {new Date(
                          unverifiedAd?.videoAd?.createdAt
                        ).toLocaleDateString()}
                      </p>
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
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Single Modal to handle scratch and reward */}
      <Modal
        open={showScratchModal}
        footer={null}
        closable={scratchCompleted}
        centered
        onCancel={handleModalClose}
        width={380}
        bodyStyle={{ textAlign: "center" }}
      >
        <h2 style={{ marginBottom: 12, color: "#ff9900" }}>
          Scratch to Reveal Your Reward!
        </h2>
        <ScratchCom onComplete={handleScratchComplete} reward={reward} />
        {scratchCompleted && (
          <Button
            type="primary"
            onClick={handleModalClose}
            style={{ marginTop: 16 }}
          >
            Close
          </Button>
        )}
      </Modal>
    </div>
  );
}

export default AdPreview;
