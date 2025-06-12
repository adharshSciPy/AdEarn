import React, { useState } from "react";
import styles from "./Surveyads.module.css";
import Navbar from "../NavBar/Navbar";
import axios from "axios";
const SurveyAds = () => {
  const [questionType, setQuestionType] = useState("yesno");

  const [adText, setAdText] = useState("");
  const [adDescription, setAdDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);

  // Yes/No
  const [yesNoQuestion, setYesNoQuestion] = useState("");
  const [allYesNoQuestions, setAllYesNoQuestions] = useState([]);

  // Multiple choice
  const [mcQuestion, setMcQuestion] = useState("");
  const [mcOptions, setMcOptions] = useState([]);
  const [allMCQuestions, setAllMCQuestions] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);

const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }
};
  // Option change
  const handleOptionChange = (index, value) => {
    const updatedOptions = [...mcOptions];
    updatedOptions[index] = value;
    setMcOptions(updatedOptions);
  };

  const addOption = () => {
    setMcOptions([...mcOptions, ""]);
  };

  const removeOption = (index) => {
    const updatedOptions = mcOptions.filter((_, i) => i !== index);
    setMcOptions(updatedOptions);
  };

  const addMCQuestion = () => {
    if (mcQuestion.trim() && mcOptions.every((opt) => opt.trim())) {
      const newQuestion = {
        question: mcQuestion,
        options: mcOptions,
      };
      setAllMCQuestions([...allMCQuestions, newQuestion]);
      setMcQuestion("");
      setMcOptions([]);
    }
  };

  const deleteMCQuestion = (index) => {
    setAllMCQuestions(allMCQuestions.filter((_, i) => i !== index));
  };

  const addYesNoQuestion = () => {
    if (yesNoQuestion.trim()) {
      setAllYesNoQuestions([...allYesNoQuestions, yesNoQuestion]);
      setYesNoQuestion("");
    }
  };

  const deleteYesNoQuestion = (index) => {
    setAllYesNoQuestions(allYesNoQuestions.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("adText", adText);
    formData.append("adDescription", adDescription);
    formData.append("questionType", questionType);

    formData.append("yesNoQuestions", JSON.stringify(allYesNoQuestions));
    formData.append("multipleChoiceQuestions", JSON.stringify(allMCQuestions));

    if (imageFile) {
      formData.append("adImage", imageFile);
    }

    // try {
    //   const res = await axios.post(`${baseUrl}/api/survey-ads`, formData, {
    //     headers: {
    //       "Content-Type": "multipart/form-data",
    //     },
    //   });
    //   alert("Survey Ad submitted successfully!");
    // } catch (err) {
    //   console.error("Submission error:", err);
    //   alert("Failed to submit survey ad.");
    // }
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
  };

  return (
    <div className={styles.mainContainer}>
      <Navbar />
      <div className={styles.container}>
        <h2 className={styles.title}>Survey Ads</h2>

        {/* Ad Text Input */}
        <div className={styles.section}>
          <label className={styles.label}>✅ Ad Text</label>
          <input
            type="text"
            value={adText}
            onChange={(e) => setAdText(e.target.value)}
            placeholder="Name Primary Text"
            className={styles.input}
          />
        </div>

        {/* Ad Description */}
        <div className={styles.section}>
          <label className={styles.label}>✅ Ad Description</label>
          <textarea
            value={adDescription}
            onChange={(e) => setAdDescription(e.target.value)}
            placeholder="Enter Ad Description"
            className={styles.textarea}
          ></textarea>
        </div>

        {/* Survey Type Radio */}
        <div className={styles.section}>
          <label className={styles.label}>✅ Survey Question Type</label>
          <div className={styles.radioGroup}>
            <label>
              <input
                type="radio"
                checked={questionType === "yesno"}
                onChange={() => setQuestionType("yesno")}
              />
              Yes or No Questions
            </label>
            <label>
              <input
                type="radio"
                checked={questionType === "multiple"}
                onChange={() => setQuestionType("multiple")}
              />
              Multiple Choice Questions
            </label>
          </div>
        </div>

        {/* Yes/No UI */}
        {questionType === "yesno" && (
          <div className={styles.section}>
            <label className={styles.label}>Yes/No Question</label>
            <input
              type="text"
              value={yesNoQuestion}
              onChange={(e) => setYesNoQuestion(e.target.value)}
              placeholder="Enter your Yes/No question"
              className={styles.input}
            />
            <button onClick={addYesNoQuestion} className={styles.button}>
              Add Question
            </button>
            <p className={styles.note}>
              <strong>Note:</strong> Yes/No questions do not require options.
            </p>

            <div style={{ marginTop: "20px" }}>
              {allYesNoQuestions.map((q, i) => (
                <div key={i} className={styles.questionContainer}>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <div>
                      <strong>Q{i + 1}:</strong> {q}
                    </div>
                    <button
                      onClick={() => deleteYesNoQuestion(i)}
                      className={styles.deleteButton}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MCQ UI */}
        {questionType === "multiple" && (
          <div className={styles.section}>
            <label className={styles.label}>Multiple Choice Question</label>
            <input
              type="text"
              value={mcQuestion}
              onChange={(e) => setMcQuestion(e.target.value)}
              placeholder="Enter your multiple choice question"
              className={styles.input}
            />
            {mcOptions.map((opt, idx) => (
              <div
                key={idx}
                style={{ display: "flex", gap: "10px", marginTop: "10px" }}
              >
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => handleOptionChange(idx, e.target.value)}
                  placeholder={`Option ${idx + 1}`}
                  className={styles.input}
                  style={{ flex: 1 }}
                />
                <button
                  onClick={() => removeOption(idx)}
                  className={styles.deleteButton}
                >
                  Remove
                </button>
              </div>
            ))}
            <button onClick={addOption} className={styles.addOptionButton}>
              ➕ Add Option
            </button>

            <button onClick={addMCQuestion} className={styles.button}>
              Add Question
            </button>

            <div style={{ marginTop: "20px" }}>
              {allMCQuestions.map((q, i) => (
                <div key={i} className={styles.questionContainer}>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <div>
                      <strong>Q{i + 1}:</strong> {q.question}
                    </div>
                    <button
                      onClick={() => deleteMCQuestion(i)}
                      className={styles.deleteButton}
                    >
                      Delete
                    </button>
                  </div>
                  <ul style={{ marginTop: "5px" }}>
                    {q.options.map((o, j) => (
                      <li key={j}>- {o}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* File Upload */}
        <div className={styles.section}>
  <label className={styles.label}>Ad Image Upload</label>
  <input type="file" accept="image/*" onChange={handleImageChange} />
  {imagePreview && (
    <div style={{ marginTop: "10px" }}>
      <img
        src={imagePreview}
        alt="Preview"
        style={{ width: "200px", borderRadius: "8px" }}
      />
    </div>
  )}
</div>

        {/* Submit */}
        <div className={styles.section}>
          <button
            onClick={handleSubmit}
            className={styles.button}
            style={{ width: "100%", padding: "20px" }}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default SurveyAds;
