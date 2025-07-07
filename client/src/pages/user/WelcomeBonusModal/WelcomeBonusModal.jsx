import React from 'react';
import styles from './WelcomeBonusModal.module.css';
import baseUrl from '../../../baseurl';

const WelcomeBonusModal = ({ onClose, sponsorData }) => {
    console.log("this",sponsorData);
    
  if (!sponsorData) return null;

  const dynamicBonusText = `You've received ${sponsorData.starsGiven} free stars!`;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>

        <div className={styles.sponsorHeader}>
          <p className={styles.sponsoredBy}>Sponsored by</p>
          <div className={styles.sponsorLogoContainer}>
            <img
              src={`${baseUrl}${sponsorData.imageUrl}`}
              alt="sponsor"
              className={styles.sponsorLogo}
            />
          </div>
        </div>

        <div className={styles.bonusContent}>
          <div className={styles.bonusBadge}>WELCOME BONUS</div>
          <h2 className={styles.bonusTitle}>{dynamicBonusText}</h2>
          <p className={styles.bonusDescription}>
            Thank you for joining {sponsorData.companyName}!
          </p>
          <button className={styles.claimButton} onClick={onClose}>
            CLAIM NOW
          </button>
        </div>
      </div>
    </div>
  );
};


export default WelcomeBonusModal;