import React, { useEffect, useState } from "react";
import styles from "./SurveyAd.module.css";
import axios from "axios";
import baseUrl from "../../../baseurl";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../NavBar/Navbar";
import { Modal, Button } from "antd";
import ScratchCard from "../AdPreview/ScratchComponent/ScratchCom";
import { useSelector } from "react-redux";

const SurveyAdPreview = () => {
  const [selectedOptions, setSelectedOptions] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [reward, setReward] = useState({});
  const userToken=useSelector((state)=>state.user.token)
  const [showScratchModal, setShowScratchModal] = useState(false);
  const [scratchCompleted, setScratchCompleted] = useState(false);
  const [ad, setAd] = useState({});
  const { adId } = useParams();
  const { id } = useParams();
  const navigate = useNavigate();
  const handleSelect = (questionId, option) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [questionId]: option, // Only one option per question
    }));
  };

  const handleSubmit = async () => {
    const allAnswered = ad.questions?.every((q) => selectedOptions[q._id]);

    if (!allAnswered) {
      alert("Please answer all questions before submitting.");
      return;
    }

    const formattedResponses = ad.questions.map((q) => ({
      selectedOption: selectedOptions[q._id],
    }));

    const payload = {
      surveyAdId: ad._id,
      userId: id,
      responses: formattedResponses,
    };
    try {
      const response = await axios.post(
        `${baseUrl}/api/v1/ads/survey-response/submit`,
        payload,{
          headers:{
            Authorization:`Bearer ${userToken}`,
          }
        }
      );
      console.log(response);
      setSubmitted(true);
      if (response.status === 200) {
        setShowScratchModal(true);
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert("Something went wrong. Please try again later.");
    }
  };
  const getAddContribution = async () => {
    try {
      const response = await axios.post(
        `${baseUrl}/api/v1/ads/view-ads/${id}/${adId}`,{},{headers:{
            Authorization:`Bearer ${userToken}`,
          }}
      );
      setReward(response.data);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  const handleScratchComplete = async () => {
    setScratchCompleted(true);
    await getAddContribution();
  };
  const getSurvey = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/ads/single-verified/${adId}`
      );
      setAd(response.data.ad.surveyAd);
    } catch (error) {
      console.error("Error fetching survey:", error);
    }
  };

  useEffect(() => {
    getSurvey();
  }, []);
  const handleModalClose = () => {
    navigate(`/userhome/${id}`);
    setShowScratchModal(false);
    setScratchCompleted(false);
  };
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
            <div key={q._id} className={styles.questionBlock}>
              <p className={styles.questionText}>
                {idx + 1}. {q.questionText}
              </p>

              <div className={styles.options}>
                {q.options.map((opt) => (
                  <button
                    key={opt}
                    className={`${styles.optionButton} ${
                      selectedOptions[q._id] === opt ? styles.selected : ""
                    }`}
                    onClick={() => handleSelect(q._id, opt)}
                    disabled={submitted}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {!submitted && (
            <button
              className={styles.submitButton}
              onClick={handleSubmit}
              disabled={ad.questions?.some((q) => !selectedOptions[q._id])}
            >
              Submit Survey
            </button>
          )}

          {submitted && (
            <p className={styles.thankYou}>Thank you for your feedback!</p>
          )}
        </div>
        <Modal
          open={showScratchModal}
          footer={null}
          closable={scratchCompleted}
          centered
          onCancel={handleModalClose}
          width={380}
          bodyStyle={{ textAlign: "center" }}
        >
          <h2 style={{ marginBottom: 12, color: "#ff9900" }}>
            Scratch to Reveal Your Reward!
          </h2>
          <ScratchCard onComplete={handleScratchComplete} reward={reward} />
          {scratchCompleted && (
            <Button
              type="primary"
              onClick={handleModalClose}
              style={{ marginTop: 16 }}
            >
              Close
            </Button>
          )}
        </Modal>
      </div>
    </>
  );
};

export default SurveyAdPreview;
