import { React, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Sidebar from "../../../components/sidebar/Sidebar";
import styles from "./userhome.module.css";
import logo from "../../../assets/Logo.png";
import Navbar from "../NavBar/Navbar";
import axios from "axios";
import baseUrl from "../../../baseurl";

function UserHome() {
  const [imageAdData, setImageAd] = useState([]);
  const { id } = useParams();

  const getImageAdData = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/v1/ads/image-ads/${id}`);
      setImageAd(response.data.ads);
      console.log(response.data.ads);
    } catch (error) {
      console.log(error);
    }
  };
  console.log("jhaii", imageAdData[0]?.imageAd.description);

  const getVideoAdData = async () => {
    try {
      const response = await axios.get(``);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };
  const getSurveuData = async () => {
    try {
      const response = await axios.get(``);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getImageAdData();
  }, []);
  const viewAd = async (adId) => {
    const response = await axios.post(`${baseUrl}/api/v1/ads/view-ads/${id}`,{adId:adId});
    console.log(response);
    
  };

  return (
    <div>
      <Navbar />
      <div className={styles.mainContainer}>
        <div className={styles.homeMainContainer}>
          {/* <Sidebar/> */}
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
                      <button>Place Ads</button>
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
            <div className={styles.adContainerMain}>
              <div className={styles.imageAdHead}>
                <h2>Image Ads</h2>
              </div>
              <div className={styles.adcontainerSub}>
                {imageAdData.map((item, index) => (
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
                  <button>See All</button>
                </div>
              </div>
            </div>
            {/* <div className={styles.adContainerMain}>
              <div className={styles.imageAdHead}>
                <h2>Video Ads</h2>
              </div>
              <div className={styles.adcontainerSub}>
                <div className={styles.adCard}>
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
                <div className={styles.adCard}>
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
                <div className={styles.adCard}>
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
                <div className={styles.adCard}>
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
                <div className={styles.seeAllContainer}>
                  <button>See All</button>
                </div>
              </div>
            </div>
            <div className={styles.adContainerMain}>
              <div className={styles.imageAdHead}>
                <h2>Surveys</h2>
              </div>
              <div className={styles.adcontainerSub}>
                <div className={styles.adCard}>
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
                <div className={styles.adCard}>
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
                <div className={styles.adCard}>
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
                <div className={styles.adCard}>
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
                <div className={styles.seeAllContainer}>
                  <button>See All</button>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserHome;
