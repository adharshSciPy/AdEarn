import React, { useEffect, useState } from 'react'
import styles from "./ContestGamification.module.css"
import SuperSidebar from "../../../components/SuperAdminSideBar/SuperSidebar"
import Header from '../../../components/Header/Header'
import confetti from 'canvas-confetti';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import baseUrl from '../../../baseurl'

function ContestGamification() {

  const [popupUserId, setPopupUserId] = useState(null);
  const [selectedWinners, setSelectedWinners] = useState([]);
  const [users,setUsers]=useState([])
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

const {id}=useParams()

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
  const getData=async()=>{
    try {
      const res=await axios.get(`${baseUrl}/api/v1/super-admin/manual/${id}`)
      console.log(res);
      setUsers(res.data.contest.participants)
      
    } catch (error) {
    console.log(error);
          
    }
  }
  useEffect(()=>{
    getData()
  },[id])
  return (
    <div className={styles.game}>
      <div className={styles.gamesmain}>
        <SuperSidebar />
        <Header />
        <div className={styles.gamecontainer}>
          <div style={{ width: '100%', maxWidth: '1550px', height: '600px', padding: '30px' }} className={styles.contestimage}>
            <h1>Select Contest Winners</h1>
            <div className={styles.cardGrid}>
              {users.map(user => {
                const isSelected = selectedWinners.find(u => u.id === user.id);
                return (
                  <div
                    key={user.id}
                    className={`${styles.userCard} ${isSelected ? styles.selected : ''}`}
                    onClick={() => toggleSelection(user)}
                  >
                    <h2>{user.userId.firstName}</h2>
                    <p>{user.userId.email}</p>
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