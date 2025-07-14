import React from "react";
import styles from "./ContestPage.module.css";
import { Link } from "react-router-dom";
import Navbar from "../NavBar/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import baseUrl from "../../../baseurl";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";

const contests = [
  {
    id: 1,
    title: "Contest 1",
    date: "02/03/2025",
    entry: "1200/1500",
    entrydetails: "entry details",
    details: "Manual Selection",
  },
  {
    id: 2,
    title: "Contest 2",
    date: "02/03/2025",
    entry: "1200/1500",
    entrydetails: "entry details",
    details: "Machine Selection",
  },
  {
    id: 3,
    title: "Contest 3",
    date: "02/03/2025",
    entry: "1200/1500",
    entrydetails: "entry details",
    details: "Machine Selection",
  },
  {
    id: 4,
    title: "Contest 3",
    date: "02/03/2025",
    entry: "1200/1500",
    entrydetails: "entry details",
    details: "Machine Selection",
  },
];

const ContestPage = () => {
  const [contest, setContest] = useState();

  const getContest = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/v1/super-admin/contests`);
      console.log(res);
      setContest(res.data.contests);
    } catch (error) {}
  };
  useEffect(() => {
    getContest();
  }, []);
  return (
    <>
      <Navbar />
      <div className={styles.pageWrapper}>
        <div className={styles.headerContent}>
          <div className={styles.logContainer}>
            <div className={styles.twoButtons}>
              <h3>Contest</h3>
            </div>
            <div className={styles.seeAll}>
              <Link className={styles.link}>Contest Winners</Link>
            </div>
          </div>
          <div className={styles.buttonLog}>
            <button>Log</button>
          </div>
        </div>
        <div className={styles.header}>
          <span className={styles.title}>Contest</span>
          <span className={styles.tag}>200</span>
        </div>

       <div className={styles.cardContainer}>
      {contest?.map((item, index) => {
        const prizeImages = item.prizeImages || [];
        const rewardSlides =
          item.rewardStructure?.map((reward) => ({
            position: reward.position,
            stars: reward.stars,
          })) || [];

        const totalPrizes = prizeImages.length + rewardSlides.length;

        return (
          <div className={styles.card} key={index}>
            <Swiper
              spaceBetween={10}
              slidesPerView={1}
              className={styles.carousel}
            >
              {/* Prize Image Slides */}
              {prizeImages.map((img, i) => (
                <SwiperSlide key={`prize-${i}`}>
                  <img
                    src={`${baseUrl}${img}`}
                    alt={`Prize ${i + 1}`}
                    className={styles.prizeImage}
                  />
                </SwiperSlide>
              ))}

              {/* Reward Structure Slides */}
              {rewardSlides.map((reward, i) => (
                <SwiperSlide key={`reward-${i}`}>
                  <div className={styles.rewardSlide}>
                    <div className={styles.rewardText}>
                      🏅 <strong>Position:</strong> {reward.position}
                      <br />⭐ <strong>Stars:</strong> {reward.stars}
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            <div className={styles.cardContent}>
              <h2 className={styles.title}>{item.contestName}</h2>
              <p>
                <strong>Total Prizes:</strong> 🎁 {totalPrizes}
              </p>
              <p>
                <strong>Max Entries:</strong> {item.maxParticipants}
              </p>
              <p>
                <strong>Entry Stars:</strong> ⭐ {item.entryStars}
              </p>
              {item.startDate && (
                <p>
                  <strong>Start Date:</strong>{" "}
                  {new Date(item.startDate).toLocaleDateString()}
                </p>
              )}
              <p>
                <strong>Status:</strong> {item.status}
              </p>
              <div className={styles.buttonWrapper}>
                <button className={styles.enterButton}>Enter</button>
              </div>
            </div>
          </div>
        );
      })}
    </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>Contest name</th>
                <th>Entry stars</th>
                <th>Entry date</th>
                <th>Total Entry</th>
                <th>Status</th>
                <th>Winner</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {contests.map((contest) => (
                <tr key={contest.id}>
                  <td>
                    <div className={styles.nameCell}>
                      <img
                        className={styles.avatar}
                        src={`/images/contest${contest.id}.png`}
                        alt=""
                      />
                      <span>{contest.title}</span>
                    </div>
                  </td>
                  <td>4</td>
                  <td>02/06/2025</td>
                  <td>1200/1200</td>
                  <td className={styles.ongoing}>Ongoing</td>
                  <td>Running</td>
                  <td className={styles.editIcons}>
                    <button className={styles.iconBtn}>✏️</button>
                    <button className={styles.iconBtn}>🔍</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ContestPage;
