import React, { useEffect, useState } from "react";
import styles from "./SurveyAd.module.css";
import axios from "axios";
import baseUrl from "../../../baseurl";
import { useParams } from "react-router-dom";
import Navbar from "../NavBar/Navbar";

const SurveyAdPreview = () => {
  const [selectedOptions, setSelectedOptions] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [ad, setad] = useState({});
  const { id, adId } = useParams();

  const handleSelect = (questionId, option) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const handleSubmit = () => {
    console.log("User responses:", selectedOptions);
    setSubmitted(true);
  };
  const getSurvey = async () => {
    try {
      const respone = await axios.get(
        `${baseUrl}/api/v1/ads/single-verified/${adId}`
      );
      // console.log(respone);
      setad(respone.data.ad.surveyAd);
    } catch (error) {}
  };
  useEffect(() => {
    getSurvey();
  }, []);
  console.log(ad);

  return (
    <>
      <Navbar />
      <div className={styles.surveyCard}>
        <img
          src={`${baseUrl}${ad.imageUrl}` || ""}
          alt="Survey Banner"
          className={styles.banner}
        />
        <div className={styles.content}>
          <h2 className={styles.title}>{ad.title}</h2>

          {ad.questions?.map((q, idx) => (
            <div key={q.id} className={styles.questionBlock}>
              <p className={styles.questionText}>
                {idx + 1}. {q.questionText}
              </p>

              <div className={styles.options}>
                {q.options.map((opt) => (
                  <button
                    key={opt}
                    className={`${styles.optionButton} ${
                      selectedOptions[q.id] === opt ? styles.selected : ""
                    }`}
                    onClick={() => handleSelect(q.id, opt)}
                    disabled={submitted}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {!submitted && (
            <button className={styles.submitButton} onClick={handleSubmit}>
              Submit Survey
            </button>
          )}

          {submitted && (
            <p className={styles.thankYou}>Thank you for your feedback!</p>
          )}
        </div>
      </div>
    </>
  );
};

export default SurveyAdPreview;
