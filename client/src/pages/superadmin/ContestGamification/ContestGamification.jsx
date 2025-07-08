import React, { useState } from 'react'
import styles from "./ContestGamification.module.css"
import SuperSidebar from "../../../components/SuperAdminSideBar/SuperSidebar"
import Header from '../../../components/Header/Header'
import confetti from 'canvas-confetti';

const dummyUsers = [
  { id: 1, name: "User One", email: "user1@example.com" },
  { id: 2, name: "User Two", email: "user2@example.com" },
  { id: 3, name: "User Three", email: "user3@example.com" },
  { id: 4, name: "User Four", email: "user4@example.com" },
  { id: 5, name: "User Five", email: "user5@example.com" },
  { id: 6, name: "User Six", email: "user6@example.com" },
  { id: 7, name: "User Seven", email: "user7@example.com" },
  { id: 8, name: "User Eight", email: "user8@example.com" },
  { id: 9, name: "User Nine", email: "user9@example.com" },
  { id: 10, name: "User Ten", email: "user10@example.com" },

];

function ContestGamification() {

  const [popupUserId, setPopupUserId] = useState(null);
  const [selectedWinners, setSelectedWinners] = useState([]);

  const fireConfetti = () => {
    // Left side cannon
    confetti({
      particleCount: 60,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.6 }
    });

    // Right side cannon
    confetti({
      particleCount: 60,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.6 }
    });
  };



  const toggleSelection = (user) => {
    const alreadySelected = selectedWinners.find(u => u.id === user.id);

    if (alreadySelected) {
      // Remove from selection
      setSelectedWinners(prev => prev.filter(u => u.id !== user.id));
    } else {
      // Add to selection
      setSelectedWinners(prev => [...prev, user]);
      setPopupUserId(user.id);
      fireConfetti();
      setTimeout(() => setPopupUserId(null), 1500);
    }
  };

  const getWinnerPosition = (userId) => {
    const index = selectedWinners.findIndex(u => u.id === userId);
    return index !== -1 ? `${index + 1}${['st', 'nd', 'rd'][index] || 'th'} Place` : null;
  };

  return (
    <div className={styles.game}>
      <div className={styles.gamesmain}>
        <SuperSidebar />
        <Header />
        <div className={styles.gamecontainer}>
          <div style={{ width: '100%', maxWidth: '1550px', height: '600px', padding: '30px' }} className={styles.contestimage}>
            <h1>Select Contest Winners</h1>
            <div className={styles.cardGrid}>
              {dummyUsers.map(user => {
                const isSelected = selectedWinners.find(u => u.id === user.id);
                return (
                  <div
                    key={user.id}
                    className={`${styles.userCard} ${isSelected ? styles.selected : ''}`}
                    onClick={() => toggleSelection(user)}
                  >
                    <h2>{user.name}</h2>
                    <p>{user.email}</p>
                    {isSelected && (
                      <span className={styles.winnerBadge}>
                        {getWinnerPosition(user.id)}
                      </span>
                    )}

                    {popupUserId === user.id && (
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
  )
}

export default ContestGamification