import { React, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import styles from "./userhome.module.css";
import logo from "../../../assets/Logo.png";
import Navbar from "../NavBar/Navbar";
import axios from "axios";
import baseUrl from "../../../baseurl";
import CreateAdPopup from "../../../components/AdPopup/CreateAdPopup";
import socket from "../../../components/Socket/socket.js";

function UserHome() {
  const navigate = useNavigate();
  const [imageAdData, setImageAd] = useState([]);
  const [videAdData, setVideoAd] = useState([]);
  const { id } = useParams();
  const [showPopup, setShowPopup] = useState(false);

  const getImageAdData = async () => {
    try {
      let lat = null;
      let lng = null;

      // Try to get location if permitted
      try {
        const getPosition = () =>
          new Promise((resolve, reject) =>
            navigator.geolocation.getCurrentPosition(resolve, reject)
          );
        const position = await getPosition();
        lat = position.coords.latitude;
        lng = position.coords.longitude;
      } catch (locationError) {
        console.log("Location access denied or failed:", locationError.message);
        // Proceed without lat/lng
      }

      // Build URL conditionally
      let url = `${baseUrl}/api/v1/ads/image-ads/${id}`;
      if (lat && lng) {
        url += `?lat=${lat}&lng=${lng}`;
      }

      const response = await axios.get(url);
      console.log("url", url);

      setImageAd(response.data.ads);
    } catch (error) {
      if (error.response) {
        console.log("API error:", error.response.data.message);
      } else {
        console.log("Error fetching ad data:", error.message);
      }
    }
  };

  const getVideoAdData = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/v1/ads/video-ads/${id}`);
      setVideoAd(response.data.ads);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getImageAdData();
    getVideoAdData();
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
    navigate(`/adspreview/${id}/${adId}`);
  };

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
                      <button onClick={() => setShowPopup(true)}>
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
            <div className={styles.adContainerMain}>
              <div className={styles.imageAdHead}>
                <h2>Image Ads</h2>
              </div>
              <div className={styles.adcontainerSub}>
                {imageAdData.slice(0, 4).map((item, index) => (
                  <div
                    className={styles.adCard}
                    key={index}
                    onClick={() => viewAd(item._id)}
                  >
                    <div className={styles.adHeading}>
                      <p>{item?.imageAd?.title || "nil"}</p>
                    </div>
                    <div className={styles.adContentDes}>
                      <div className={styles.adCardbottom}>
                        <div className={styles.adEarnLogoCont}>
                          <img src={logo} alt="" />
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
            {/* VIDEO ADS */}
            <div className={styles.adContainerMain}>
              <div className={styles.imageAdHead}>
                <h2>Video Ads</h2>
              </div>
              <div className={styles.adcontainerSub}>
                {videAdData.slice(0, 4).map((item, index) => (
                  <div
                    className={styles.adCard}
                    key={index}
                    onClick={() => viewAd(item._id)}
                  >
                    <div className={styles.adHeading}>
                      <p>{item?.videoAd?.title || "nil"}</p>
                    </div>
                    <div className={styles.adContentDes}>
                      <div className={styles.adCardbottom}>
                        <div className={styles.adEarnLogoCont}>
                          <img src={logo} alt="" />
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
            {/* SURVEY ADS: replace with real data if available */}
            <div className={styles.adContainerMain}>
              <div className={styles.imageAdHead}>
                <h2>Surveys</h2>
              </div>
              <div className={styles.adcontainerSub}>
                {[1, 2, 3, 4].map((_, idx) => (
                  <div className={styles.adCard} key={idx}>
                    <div className={styles.adHeading}>
                      <p>Addprimary text</p>
                    </div>
                    <div className={styles.adContentDes}>
                      <div className={styles.adCardbottom}>
                        <div className={styles.adEarnLogoCont}>
                          <img src={logo} alt="" />
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
            {/* END */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserHome;
