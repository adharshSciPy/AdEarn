import React, { useState, useEffect } from "react";
import styles from "./Publishad.module.css";
import Header from "../../../components/Header/Header";
import SuperSidebar from "../../../components/SuperAdminSideBar/SuperSidebar";
import axios from "axios";
import baseUrl from "../../../baseurl";
import tickAd from "../../../assets/tickAd.png";
import { useRef } from "react";

function PublishAds() {
  const [form, setForm] = useState({
    state: [],
    city: [],
    viewPlan: "",
    adName: "",
    adPeriod: "",
    adCategory: "",
  });
  const [image, setImage] = useState(null);
  const [audio, setAudio] = useState(null);
  const [preview, setPreview] = useState(null);
  const [previewaudio, setPreviewaudio] = useState(null);

  const fileInputRef = useRef(null);
  const fileInputAudioRef = useRef(null);
  const handleFileChangeaudio = (e) => {
    const file = e.target.files[0];
    setAudio(file);
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPreviewaudio(previewUrl);
    }
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "state" ? { city: [] } : {}),
    }));
  };
  return (
    <div className={styles.verifiedpayouts}>
      <div className={styles.verifiedpayoutsmain}>
        <div style={{display:'flex'}}>
          <SuperSidebar />
          <div className={styles.adFormMain}>
            {/* Ad Name */}
            <div className={styles.adName}>
              <div className={styles.labelContainer}>
                <div className={styles.labelImg}>
                  <img src={tickAd} alt="tick" />
                </div>
                <div className={styles.AdNameHead}>
                  <h2>Ad Name</h2>
                  <input
                    className={styles.AdInput}
                    type="text"
                    placeholder="Name of your Ad"
                    name="adName"
                    value={form.adName}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className={styles.adName}>
              <div className={styles.labelContainer}>
                <div className={styles.labelImg}>
                  <img src={tickAd} alt="tick" />
                </div>
                <div className={styles.AdNameHead}>
                  <h2>Your Ad Photo</h2>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  {preview && (
                    <img
                      src={preview}
                      alt="Preview"
                      className={styles.previewImg}
                    />
                  )}
                </div>
              </div>
            </div>
            <div className={styles.adName}>
              <div className={styles.labelContainer}>
                <div className={styles.labelImg}>
                  <img src={tickAd} alt="tick" />
                </div>
                <div className={styles.AdNameHead}>
                  <h2>Your Voice Not</h2>
                  <input
                    type="file"
                    ref={fileInputAudioRef}
                    accept="audio/*"
                    onChange={handleFileChangeaudio}
                  />
                  {previewaudio && (
                    <audio controls>
                      <source src={previewaudio} />
                      Your browser does not support the audio element.
                    </audio>
                  )}
                </div>
              </div>
            </div>
            {/* View Required */}
            <div className={styles.buttondiv}>
                      <div className={styles.mobdiv}>
                        <button
                          style={{
                            backgroundColor: "#3563E9",
                            border: "none",
                            color: "white",
                          }}
                        >
                          Submit
                        </button>
                      </div>
                    </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PublishAds;
