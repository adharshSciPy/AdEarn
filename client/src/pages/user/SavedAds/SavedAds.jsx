import { React, useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import styles from "./SavedAds.module.css";
import logo from "../../../assets/Logo.png";
import Navbar from "../NavBar/Navbar";
import axios from "axios";
import baseUrl from "../../../baseurl";
import Driver from "driver.js";
import "driver.js/dist/driver.min.css";
import Lottie from "lottie-react";
import noAdsAnimation from "../../../assets/loading.json";
import socket from "../../../components/Socket/socket.js";
import CreateAdPopup from "../../../components/AdPopup/CreateAdPopup";
import { useSelector } from "react-redux";

function SavedAds() {
  const navigate = useNavigate();
  const [imageAdData, setImageAd] = useState([]);
  const [videAdData, setVideoAd] = useState([]);
  const [surveyData, setSurveyData] = useState([]);
  const userToken = useSelector((state) => state.user.token);

  const { id } = useParams();
  const [showPopup, setShowPopup] = useState(false);


  useEffect(() => {
    savedAds()
  }, []);
  useEffect(() => {
    if (!socket.connected) socket.connect();

    socket.emit("register", id);

    socket.on("notification", (data) => {
      console.log("🔔 Notification received on frontend:", data);
    });

    return () => {
      socket.off("notification");
    };
  }, []);

  const viewAd = async (adId) => {
    navigate(`/savedAdsPreview/${id}/${adId}`);
  };
  const viewSurveyAd = async (adId) => {
    navigate(`/surveyadspreview/${id}/${adId}`);
  };

  //driver.js

  useEffect(() => {
    const hasSeenTour = localStorage.getItem(`userHomeTourSeen_${id}`);

    if (!hasSeenTour) {
      let attempts = 0;

      const interval = setInterval(() => {
        const selectors = [
          "#place-ads-btn",
          "#image-ads-section",
          "#video-ads-section",
          "#survey-ads-section",
        ];

        const allExist = selectors.every((sel) => document.querySelector(sel));
        if (allExist || attempts > 5) {
          clearInterval(interval);

          if (allExist) {
            const driver = new Driver({
              animate: true,
              opacity: 0.5,
              stageBackground: "rgba(0, 0, 0, 0.5)",
              allowClose: true,
              doneBtnText: "Finish",
              closeBtnText: "Skip",
              nextBtnText: "Next",
              prevBtnText: "Previous",
              onReset: () => {
                localStorage.setItem(`userHomeTourSeen_${id}`, "true");
              },
            });

            driver.defineSteps([
              {
                element: "#place-ads-btn",
                popover: {
                  title: "Place Your Ad",
                  description: "Click here to place a new advertisement.",
                  position: "bottom",
                },
              },
              {
                element: "#image-ads-section",
                popover: {
                  title: "Image Ads",
                  description: "View image ads to earn stars.",
                  position: "top",
                },
              },
              {
                element: "#video-ads-section",
                popover: {
                  title: "Video Ads",
                  description: "Watch short videos to earn more stars.",
                  position: "top",
                },
              },
              {
                element: "#survey-ads-section",
                popover: {
                  title: "Surveys",
                  description: "Complete surveys for additional rewards.",
                  position: "top",
                },
              },
            ]);

            driver.start();
          } else {
            console.warn("Some tour elements not found.");
          }
        }

        attempts++;
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [id]);
const savedAds = async () => {
  try {
    const res = await axios.get(`${baseUrl}/api/v1/user/view/saved-ads`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });

    if (res.status === 200) {
      const allAds = res.data.savedAds;

      // Initialize arrays
      const imageAds = [];
      const videoAds = [];
      const surveyAds = [];

      allAds.forEach((item) => {
        const ad = item.ad;

        if (ad?.imgAdRef) {
          imageAds.push(item);
        } else if (ad?.videoAdRef) {
          videoAds.push(item);
        } else if (ad?.surveyAdRef) {
          surveyAds.push(item);
        }
      });

      setImageAd(imageAds);
      setVideoAd(videoAds);
      setSurveyData(surveyAds);
    }
  } catch (error) {
    console.error("Error fetching saved ads:", error);
  }
};

  console.log(imageAdData);
  console.log(videAdData);
  
  
  return (
    <div>
      <Navbar />
      <CreateAdPopup isOpen={showPopup} onClose={() => setShowPopup(false)} />
      <div className={styles.mainContainer}>
        <div className={styles.homeMainContainer}>
          <div className={styles.homeContainer}>
            <div className={styles.contentsContainer}>
              <div className={styles.firstContent}>
                <div className={styles.firstMain}>
                  <div className={styles.firstMainleftContainer}>
                    <div className={styles.firstMainHeader}>
                      <h2>Place Your Ads</h2>
                    </div>
                    <div className={styles.firstMainp}>
                      <p>
                        Providing cheap car rental services and safe and
                        comfortable facilities.
                      </p>
                    </div>
                    <div className={styles.firstMainbutton}>
                      <button
                        id="place-ads-btn"
                        onClick={() => setShowPopup(true)}
                      >
                        Place Ads
                      </button>
                    </div>
                  </div>
                  <div className={styles.firstMainrightContainer}>
                    <div className={styles.firstImageContainer}>
                      <div className={styles.firstImageContainerMain}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* IMAGE ADS */}
            {imageAdData.length > 0 && (
              <div className={styles.adContainerMain} id="image-ads-section">
                <div className={styles.imageAdHead}>
                  <h2>Image Ads</h2>
                </div>
                <div className={styles.adcontainerSub}>
                  {imageAdData.map((item, index) => (
                    <div
                      className={styles.adCard}
                      key={index}
                      onClick={() => viewAd(item.ad?._id)}
                    >
                      <div className={styles.adHeading}>
                        <p>{item?.ad?.imgAdRef?.title || "nil"}</p>
                      </div>
                      <div className={styles.adContentDes}>
                        <div className={styles.adCardbottom}>
                          <div className={styles.adEarnLogoCont}>
                            <img src={logo} alt="logo" />
                          </div>
                        </div>
                      </div>
                      <div className={styles.adCardButton}>
                        <div className={styles.watchAd}>
                          <Link className={styles.watchAdLink}>Watch Ad</Link>
                        </div>
                        <div className={styles.adStar}>
                          5<span style={{ color: "red" }}>⭐</span>
                        </div>
                      </div>
                      <div className={styles.adCardBackground}></div>
                    </div>
                  ))}
                  <div className={styles.seeAllContainer}>
                    <button onClick={() => navigate("/ads/image")}>
                      See All
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* VIDEO ADS */}
            {videAdData.length > 0 && (
              <div className={styles.adContainerMain} id="video-ads-section">
                <div className={styles.imageAdHead}>
                  <h2>Video Ads</h2>
                </div>
                <div className={styles.adcontainerSub}>
                  {videAdData.map((item, index) => (
                    <div
                      className={styles.adCard}
                      key={index}
                      onClick={() => viewAd(item.ad?._id)}
                    >
                      <div className={styles.adHeading}>
                        <p>{item?.ad?.videoAdRef?.title || "nil"}</p>
                      </div>
                      <div className={styles.adContentDes}>
                        <div className={styles.adCardbottom}>
                          <div className={styles.adEarnLogoCont}>
                            <img src={logo} alt="logo" />
                          </div>
                        </div>
                      </div>
                      <div className={styles.adCardButton}>
                        <div className={styles.watchAd}>
                          <Link className={styles.watchAdLink}>Watch Ad</Link>
                        </div>
                        <div className={styles.adStar}>
                          5<span style={{ color: "red" }}>⭐</span>
                        </div>
                      </div>
                      <div className={styles.adCardBackground}></div>
                    </div>
                  ))}
                  <div className={styles.seeAllContainer}>
                    <button onClick={() => navigate("/ads/video")}>
                      See All
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* SURVEY ADS */}
            {surveyData.length > 0 && (
              <div className={styles.adContainerMain} id="survey-ads-section">
                <div className={styles.imageAdHead}>
                  <h2>Surveys</h2>
                </div>
                <div className={styles.adcontainerSub}>
                  {surveyData.map((ad, idx) => (
                    <div
                      className={styles.adCard}
                      key={idx}
                      onClick={() => viewSurveyAd(ad._id)}
                    >
                      <div className={styles.adHeading}>
                        <p>{ad.surveyAd.title}</p>
                      </div>
                      <div className={styles.adContentDes}>
                        <div className={styles.adCardbottom}>
                          <div className={styles.adEarnLogoCont}>
                            <img src={logo} alt="logo" />
                          </div>
                        </div>
                      </div>
                      <div className={styles.adCardButton}>
                        <div className={styles.watchAd}>
                          <Link className={styles.watchAdLink}>Watch Ad</Link>
                        </div>
                        <div className={styles.adStar}>
                          5<span style={{ color: "red" }}>⭐</span>
                        </div>
                      </div>
                      <div className={styles.adCardBackground}></div>
                    </div>
                  ))}
                  <div className={styles.seeAllContainer}>
                    <button onClick={() => navigate("/ads/survey")}>
                      See All
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* NO ADS */}
            {imageAdData.length === 0 &&
              videAdData.length === 0 &&
              surveyData.length === 0 && (
                <div className={styles.noAdsContainer}>
                  <Lottie
                    animationData={noAdsAnimation}
                    loop
                    autoplay
                    style={{ width: 250, height: 250 }}
                  />
                  <h3>No Ads For You Right Now</h3>
                  <p>Check back later to earn by watching ads!</p>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SavedAds;
