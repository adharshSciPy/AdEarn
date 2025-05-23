import { React } from "react";
import { Link } from "react-router-dom";
import Sidebar from"../../../components/sidebar/Sidebar"
import styles from "./userhome.module.css";
import logo from "../../../assets/Logo.png";
import Navbar from "../NavBar/Navbar";

function UserHome() {
  return (
    <div>
      <Navbar/>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserHome;
