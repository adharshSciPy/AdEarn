import React, { useEffect, useState } from "react";
import styles from "./AdPreview.module.css";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Button } from "antd";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import baseUrl from "../../../baseurl";
import { Modal } from "antd";

function VerifyAds() {
    const {adId}=useParams()
  const [unverifiedAd, setUnVerifiedAd] = useState();
  const [selectedAd, setSelectedAd] = useState(null);
  const [reason, setReason] = useState("");
  const getAddDetails = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/ads/unverified-ads/${adId}`
      );
      setUnVerifiedAd(response.data.ad);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // getUnVerifyAd();
  }, []);

  return (
    <div className={styles.verifyadsmain}>
      <div className={styles.verifyadscontainer}>
        <div className={styles.adscontainer}>
          <div
            style={{
              width: "100%",
              height: "maxContent"
            }}
            className={styles.adsimage}
          >
            <h1 style={{padding:"20px"}}>Ads Preview</h1>
            <div className={styles.adspreview}>
              <div className={styles.previewone}>
                <img
                  className={styles.image}
                  src={`${baseUrl}${unverifiedAd?.imageAd.imageUrl}`}
                  alt=""
                />
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
                      {unverifiedAd?.imageAd.userViewsNeeded}
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
                      <p>{unverifiedAd?.imageAd.userViewsNeeded}</p>
                    </div>
                  </div>
                  <div className={styles.listitems}>
                    <div>
                      <p>Total stars</p>
                    </div>
                    <div>
                      <p>{unverifiedAd?.imageAd.totalStarsAllocated}</p>
                    </div>
                  </div>
                  
                  <div className={styles.listitems}>
                    <div>
                      <p>Start Date</p>
                    </div>
                    <div>
                      <p>{unverifiedAd?.imageAd.createdAt}</p>
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
                    <p>{unverifiedAd?.imageAd.title}</p>
                  </div>
                </div>
                <div className={styles.adsnametext}>
                  <div>
                    <h1>Ads Category</h1>
                  </div>
                  <div>
                    <p>{unverifiedAd?.imageAd.description}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerifyAds;
