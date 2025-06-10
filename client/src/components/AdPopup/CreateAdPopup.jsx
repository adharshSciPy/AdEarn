import React, { useState } from "react";
import styles from "./CreateAdPopup.module.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const adOptions = [
  { label: "Video Ads", value: "video" },
  { label: "Image Ads", value: "image" },
  { label: "Survey Ads", value: "survey" },
];

const CreateAdPopup = ({ isOpen, onClose }) => {
  const userId = useSelector((state) => state.user.id);
  const [selectedAd, setSelectedAd] = useState("video");
  const navigate = useNavigate();

  if (!isOpen) return null;
  const handleCreate = () => {
    switch (selectedAd) {
      case "image":
        navigate(`/adform/${userId}`);
        break;
      case "video":
        navigate(`/videoform/${userId}`);
        break;
      case "survey":
        navigate("/create-survey-ad");
        break;
      default:
        break;
    }
  };
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>Create new ads</h2>

        <div className={styles.cardContainer}>
          {adOptions.map((ad) => (
            <div
              key={ad.value}
              className={`${styles.card} ${
                selectedAd === ad.value ? styles.active : ""
              }`}
              onClick={() => setSelectedAd(ad.value)}
            >
              <input
                type="radio"
                name="adType"
                value={ad.value}
                checked={selectedAd === ad.value}
                onChange={() => setSelectedAd(ad.value)}
                className={styles.radio}
              />
              <p className={styles.cardLabel}>{ad.label}</p>
              <p className={styles.cardText}>Create Your Ads</p>
            </div>
          ))}
        </div>

        <div className={styles.buttonRow}>
          <button onClick={onClose} className={styles.cancelButton}>
            Cancel
          </button>
          <button onClick={handleCreate} className={styles.createButton}>
            Create Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateAdPopup;
