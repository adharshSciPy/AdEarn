import React, { useEffect, useState } from "react";
import styles from "./ContestGamification.module.css";
import SuperSidebar from "../../../components/SuperAdminSideBar/SuperSidebar";
import Header from "../../../components/Header/Header";
import confetti from "canvas-confetti";
import axios from "axios";
import { useParams } from "react-router-dom";
import baseUrl from "../../../baseurl";
import { toast } from "react-toastify";

function ContestGamification() {
  const [popupUserId, setPopupUserId] = useState(null);
  const [selectedWinners, setSelectedWinners] = useState([]);
  const [users, setUsers] = useState([]);
  const [rewardStructure, setRewardStructure] = useState([]);

  const fireConfetti = () => {
    // Left side cannon
    confetti({
      particleCount: 60,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.6 },
    });

    // Right side cannon
    confetti({
      particleCount: 60,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.6 },
    });
  };

  const { id } = useParams();

  const toggleSelection = async (user) => {
    const alreadySelected = selectedWinners.find(
      (u) => u.userId._id === user.userId._id
    );

    if (alreadySelected) {
      // ❌ Prevent unselecting
      toast.error("This winner is already selected and cannot be removed.");
      return;
    }

    if (selectedWinners.length >= rewardStructure.length) {
      toast.error(`❌ Only ${rewardStructure.length} winners allowed.`);
      return;
    }

    const newWinners = [...selectedWinners, user];
    setSelectedWinners(newWinners);
    setPopupUserId(user.userId._id);
    fireConfetti();
    setTimeout(() => setPopupUserId(null), 1500);

    const position = newWinners.length;

    try {
      const res = await axios.post(
        `${baseUrl}/api/v1/super-admin/assign-winner`,
        {
          contestId: id,
          userId: user.userId._id,
          position,
        }
      );
      console.log(res);
    } catch (err) {
      console.error("Error saving winner:", err);
    }
  };

  const getWinnerPosition = (userId) => {
    const index = selectedWinners.findIndex((u) => u.userId._id === userId);
    return index !== -1
      ? `${index + 1}${["st", "nd", "rd"][index] || "th"} Place`
      : null;
  };

  const getData = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/v1/super-admin/manual/${id}`);
      setUsers(res.data.contest.participants);
      setRewardStructure(res.data.contest.rewardStructure || []);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getData();
  }, [id]);
  return (
    <div className={styles.game}>
      <div className={styles.gamesmain}>
        <SuperSidebar />
        <Header />
        <div className={styles.gamecontainer}>
          <div
            style={{
              width: "100%",
              maxWidth: "1550px",
              height: "600px",
              padding: "30px",
            }}
            className={styles.contestimage}
          >
            <h1>Select Contest Winners</h1>
            <div className={styles.cardGrid}>
              {users.map((user) => {
                const isSelected = selectedWinners.find(
                  (u) => u.userId._id === user.userId._id
                );

                return (
                  <div
                    key={user.userId._id}
                    className={`${styles.userCard} ${
                      isSelected ? styles.selected : ""
                    } ${
                      selectedWinners.length >= rewardStructure.length &&
                      !isSelected
                        ? styles.disabled
                        : ""
                    }`}
                    onClick={() => toggleSelection(user)}
                  >
                    <h2>{user.userId.firstName}</h2>
                    <p>{user.userId.email}</p>
                    {isSelected && (
                      <span className={styles.winnerBadge}>
                        {getWinnerPosition(user.userId._id)}
                      </span>
                    )}

                    {popupUserId === user.userId._id && (
                      <div className={styles.giftPopup}>🎁 Winner!</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContestGamification;
