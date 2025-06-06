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
  const { adId } = useParams();
const navigate=useNavigate()
  const getUnVerifyAd = async () => {
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

    getUnVerifyAd();
  }, []);
  const handleVerify = (id) => {
    setSelectedAd(id);
    setIsModalVisible(true);
  };
  const handleApprove=async()=>{
    try {
      const response=await axios.post(`${baseUrl}/api/v1/admin/verify-ad`,{ adId: selectedAd } )
      if(response.status===200){
        navigate('/AdminAds')
      }
      console.log(response);
      
    } catch (error) {
      console.log(error);
      
    }
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
                <img
                  className={styles.image}
                  src={`${baseUrl}${unverifiedAd?.imageAd.imageUrl}`}
                  alt=""
                />
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
                      <p>Ads Status</p>
                    </div>
                    <div>
                      <p>Not Verified</p>
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

            <div className={styles.approvalbuttons}>
              <Button style={{ backgroundColor: "#5d32b9", color: "white" }}>
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
    </div>
  );
}

export default VerifyAds;
