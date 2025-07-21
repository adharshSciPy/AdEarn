import React, { useEffect, useState, useRef } from "react";
import styles from "./SavedAdsPreview.module.css";
import Navbar from "../NavBar/Navbar";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import baseUrl from "../../../baseurl";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
function SavedAdsPreview() {
  const { id, adId } = useParams();
  const [unverifiedAd, setUnVerifiedAd] = useState(null);
  const [reward, setReward] = useState({});
  const [showScratchModal, setShowScratchModal] = useState(false);
  let initiallyLiked = false;
  const [liked, setLiked] = useState(initiallyLiked);
  const navigate = useNavigate();
  // For video timer management
  const videoTimerRef = useRef(null);
  const [videoAdReady, setVideoAdReady] = useState(false);
  const [videoLogicApplied, setVideoLogicApplied] = useState(false);
  const userToken = useSelector((state) => state.user.token);

  // Fetch ad details
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

  // Fetch ad on mount/ad change
  useEffect(() => {
    getAddDetails();
    setVideoLogicApplied(false);
    setVideoAdReady(false);
    if (videoTimerRef.current) {
      clearTimeout(videoTimerRef.current);
      videoTimerRef.current = null;
    }
  }, [adId, id]);

  // Close modal handler
  const handleModalClose = () => {
    setVideoLogicApplied(false);
    setVideoAdReady(false);
    if (videoTimerRef.current) {
      clearTimeout(videoTimerRef.current);
      videoTimerRef.current = null;
    }
  };

  // VIDEO LOGIC
  const handleVideoLoaded = (e) => {
    setVideoAdReady(true);
  };

  const handleVideoPlay = (e) => {
    if (!videoAdReady || videoLogicApplied) return;
    const video = e.target;
    const duration = video.duration;
    // Apply only once per ad view
    setVideoLogicApplied(true);
  };

  // On unmount/cleanup, clear timers
  useEffect(() => {
    return () => {
      if (videoTimerRef.current) {
        clearTimeout(videoTimerRef.current);
      }
    };
  }, []);
  const handleLikeClick = async () => {
    try {
      setLiked((prev) => !prev);
      const response = await axios.post(
        `${baseUrl}/api/v1/user/save-ad`,
        { adId }, // <-- Send adId in request body
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      console.log(response);
    } catch (error) {
      console.error("Failed to like the ad", error);
      setLiked((prev) => !prev); // revert UI on error
    }
  };

  return (
    <div className={styles.verifyadsmain}>
      <Navbar />
      <div className={styles.verifyadscontainer}>
        <div className={styles.adscontainer}>
          <div
            style={{ width: "100%", height: "maxContent" }}
            className={styles.adsimage}
          >
            <div
              className=""
              style={{
                display: "flex",
                justifyContent: "space-between ",
                alignItems: "center",
                paddingRight: "40px",
              }}
            >
              <h1 style={{ padding: "20px" }}>Ads Preview</h1>
              <div className={styles.likeWrapper} onClick={handleLikeClick}>
                {liked ? (
                  <HeartFilled className={styles.likedIcon} />
                ) : (
                  <HeartOutlined className={styles.unlikedIcon} />
                )}
              </div>
            </div>
            <div className={styles.adspreview}>
              <div className={styles.previewone}>
                {unverifiedAd?.videoAd?.videoUrl ? (
                  <video
                    className={styles.image}
                    src={`${baseUrl}${unverifiedAd.videoAd.videoUrl}`}
                    controls
                    onLoadedMetadata={handleVideoLoaded}
                    onPlay={handleVideoPlay}
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
                      {unverifiedAd?.imageAd?.userViewsNeeded ??
                        unverifiedAd?.videoAd?.userViewsNeeded}
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
                {(unverifiedAd?.imageAd?.audioUrl ||
                  unverifiedAd?.videoAd?.audioUrl) && (
                  <div className={styles.adsnametext}>
                    <div>
                      <h1>Audio</h1>
                    </div>
                    <div>
                      {unverifiedAd?.imageAd?.audioUrl ? (
                        <audio controls autoPlay>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SavedAdsPreview;
