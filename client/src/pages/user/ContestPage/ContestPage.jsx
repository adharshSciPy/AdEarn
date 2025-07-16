import React from "react";
import styles from "./ContestPage.module.css";
import { Link, useParams } from "react-router-dom";
import Navbar from "../NavBar/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import baseUrl from "../../../baseurl";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { toast } from 'react-toastify';


const ContestPage = () => {
  const [contest, setContest] = useState();
  const [userContest, setUserContest] = useState();
  const [selectedContest, setSelectedContest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("ongoing");

  const { id } = useParams();

  const getContest = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/v1/super-admin/contests`);
      setContest(res.data.contests);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  const getContestData = async () => {
    try {
      const res = await axios.get(
        `${baseUrl}/api/v1/user/my-contest-entries/${id}`
      );
      setUserContest(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const enterContest = async (contestNumber) => {
    try {
      const response = await axios.post(
        `${baseUrl}/api/v1/user/contest/register`,
        {
          userId: id,
          contestNumber: contestNumber,
        }
      );

      if (response.status === 200) {
        toast.success("Successfully entered the contest!");
        getContest();
        getContestData();
      }
    } catch (error) {
      console.log(error);
      const errMsg =
        error?.response?.data?.message || "Failed to enter contest. Try again.";
      toast.error(errMsg);
    }
  };

  useEffect(() => {
    getContest();
    getContestData();
  }, []);

  return (
    <>
      <Navbar />
      <div className={styles.pageWrapper}>
        <div className={styles.headerContent}>
          <div className={styles.logContainer}>
            <div className={styles.twoButtons}>
              <h3
                onClick={() => setActiveTab("ongoing")}
                className={activeTab === "ongoing" ? styles.activeTab : ""}
              >
                Ongoing Contest
              </h3>
              <h3
                onClick={() => setActiveTab("all")}
                className={activeTab === "all" ? styles.activeTab : ""}
              >
                All Contest Details
              </h3>
            </div>
          </div>
        </div>

        {activeTab === "ongoing" && (
          <>
            <div className={styles.cardContainer}>
              {contest
                ?.filter((item) => item.status === "Active")
                .map((item, index) => {
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
                        {prizeImages.map((img, i) => (
                          <SwiperSlide key={`prize-${i}`}>
                            <img
                              src={`${baseUrl}${img}`}
                              alt={`Prize ${i + 1}`}
                              className={styles.prizeImage}
                            />
                          </SwiperSlide>
                        ))}
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
                        <p>
                          <strong>Remaining Slot:</strong> {item.slotsLeft}
                        </p>
                        <div className={styles.buttonWrapper}>
                          <button
                            className={styles.enterButton}
                            onClick={() => enterContest(item.contestNumber)}
                          >
                            Enter
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </>
        )}

        {activeTab === "all" && (
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
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {userContest?.map((contest) => (
                  <tr key={contest.id}>
                    <td>
                      <div className={styles.nameCell}>
                        <span>{contest.contestName}</span>
                      </div>
                    </td>
                    <td>{contest.entryStars}</td>
                    <td>
                      {new Date(contest.entryDate).toLocaleString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </td>
                    <td>{contest.totalEntry}</td>
                    <td className={styles.ongoing}>{contest.status}</td>
                    <td>Running</td>
                    <td className={styles.editIcons}>
                      <button
                        className={styles.iconBtn}
                        onClick={() => {
                          setSelectedContest(contest);
                          setShowModal(true);
                        }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {showModal && selectedContest && (
          <div className={styles.modalBackdrop}>
            <div className={styles.modal}>
              <h2 className={styles.modalTitle}>
                🎉 {selectedContest.contestName}
              </h2>

              <div className={styles.modalRow}>
                <span>
                  ⭐ <strong>Entry Stars:</strong>
                </span>
                <span>{selectedContest.entryStars}</span>
              </div>
              <div className={styles.modalRow}>
                <span>
                  📅 <strong>Entry Date:</strong>
                </span>
                <span>
                  {new Date(selectedContest.entryDate).toLocaleDateString(
                    "en-GB"
                  )}
                </span>
              </div>
              <div className={styles.modalRow}>
                <span>
                  👥 <strong>Total Entries:</strong>
                </span>
                <span>{selectedContest.totalEntry}</span>
              </div>
              <div className={styles.modalRow}>
                <span>
                  📌 <strong>Status:</strong>
                </span>
                <span>{selectedContest.status}</span>
              </div>

              <div className={styles.modalRow}>
                <span>
                  🏆 <strong>Winners:</strong>
                </span>
                <span>
                  {selectedContest.winners?.length > 0 ? (
                    <div className={styles.winnerList}>
                      {selectedContest.winners.map((a, i) => {
                        const getOrdinal = (num) => {
                          const s = ["th", "st", "nd", "rd"];
                          const v = num % 100;
                          return num + (s[(v - 20) % 10] || s[v] || s[0]);
                        };
                        const medals = ["🥇", "🥈", "🥉"];
                        const place = getOrdinal(i + 1);
                        const medal = medals[i] || "🏅";
                        return (
                          <span key={i} className={styles.winnerItem}>
                            {medal} <strong>{place}</strong> - {a.name}
                          </span>
                        );
                      })}
                    </div>
                  ) : (
                    "Not declared yet"
                  )}
                </span>
              </div>

              <button
                className={styles.closeBtn}
                onClick={() => setShowModal(false)}
              >
                ✖ Close
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ContestPage;
