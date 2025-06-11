import React, { useState, useEffect } from 'react'
import styles from '../Home/userhome.module.css'
import { Link, useNavigate, useParams } from "react-router-dom"
import axios from 'axios'
import baseUrl from "../../../baseurl"
import { useSelector } from 'react-redux'
import logo from "../../../assets/Logo.png";
import Navbar from "../NavBar/Navbar";

function Adspage() {
    const { type } = useParams();
    const [ads, setAds] = useState([])

    const navigate = useNavigate()
    const userId = useSelector((state) => state.user.id)
    const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);

    useEffect(() => {
        const fetchAds = async () => {
            try {
                console.log("userid from store", userId)
                const response = await axios.get(`${baseUrl}/api/v1/ads/${type}-ads/${userId}`)
                setAds(response.data.ads)
                console.log("response", response)
            } catch (error) {
                console.log(error)
            }
        }
        fetchAds();
    }, [type])

    const viewAd = async (adId) => {
        navigate(`/adspreview/${userId}/${adId}`);
    };

    return (
        <>
            <div>
                 <Navbar />
                {/* ADS */}
                <div div className={styles.adContainerMain} >
                    <div className={styles.imageAdHead}>
                        <h2>{capitalizedType} Ads</h2>
                    </div>
                    <div className={styles.adcontainerSub}>
                        {ads.map((item, index) => (
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
                    </div>
                </div>
            </div>
        </>
    )
}

export default Adspage