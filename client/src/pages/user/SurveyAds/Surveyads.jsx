import React, { useState, useRef } from "react";
import styles from "./Surveyads.module.css";
import tickAd from "../../../assets/tickAd.png";

function Surveyads() {
  const [questionType, setQuestionType] = useState("yesno");

  const [yesNoQuestionInput, setYesNoQuestionInput] = useState("");
  const [yesNoQuestions, setYesNoQuestions] = useState([]);

  const [mcQuestionInput, setMcQuestionInput] = useState("");
  const [mcOptions, setMcOptions] = useState(["", "", "", ""]);
  const [multipleChoiceQuestions, setMultipleChoiceQuestions] = useState([]);

  const [editState, setEditState] = useState(null);

  const [editYesNoQuestion, setEditYesNoQuestion] = useState("");
  const [editMcQuestion, setEditMcQuestion] = useState("");
  const [editMcOptions, setEditMcOptions] = useState(["", "", "", ""]);

  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  // Handlers
  const handleYesNoAdd = () => {
    if (yesNoQuestionInput.trim()) {
      setYesNoQuestions([...yesNoQuestions, yesNoQuestionInput.trim()]);
      setYesNoQuestionInput("");
    }
  };

  const handleMcAdd = () => {
    if (mcQuestionInput.trim() && mcOptions.every((opt) => opt.trim())) {
      setMultipleChoiceQuestions([
        ...multipleChoiceQuestions,
        {
          question: mcQuestionInput.trim(),
          options: [...mcOptions],
        },
      ]);
      setMcQuestionInput("");
      setMcOptions(["", "", "", ""]);
    }
  };

  const handleDelete = (type, index) => {
    if (type === "yesno") {
      setYesNoQuestions(yesNoQuestions.filter((_, i) => i !== index));
    } else {
      setMultipleChoiceQuestions(
        multipleChoiceQuestions.filter((_, i) => i !== index)
      );
    }
    if (editState?.type === type && editState.index === index) {
      setEditState(null);
    }
  };

  const handleEditStart = (type, index) => {
    setEditState({ type, index });
    if (type === "yesno") {
      setEditYesNoQuestion(yesNoQuestions[index]);
    } else {
      setEditMcQuestion(multipleChoiceQuestions[index].question);
      setEditMcOptions([...multipleChoiceQuestions[index].options]);
    }
  };

  const handleEditCancel = () => {
    setEditState(null);
  };

  const handleEditSave = () => {
    if (editState.type === "yesno") {
      if (!editYesNoQuestion.trim()) return;
      const updated = [...yesNoQuestions];
      updated[editState.index] = editYesNoQuestion.trim();
      setYesNoQuestions(updated);
    } else {
      if (!editMcQuestion.trim() || editMcOptions.some((opt) => !opt.trim()))
        return;
      const updated = [...multipleChoiceQuestions];
      updated[editState.index] = {
        question: editMcQuestion.trim(),
        options: [...editMcOptions],
      };
      setMultipleChoiceQuestions(updated);
    }
    setEditState(null);
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const previewURL = URL.createObjectURL(file);
      setImagePreview(previewURL);
    }
  };

  return (
    <div>
      <div className={styles.adFormMain}>
        {/* Ad Text */}
        <div className={styles.adName}>
          <div className={styles.labelContainer}>
            <div className={styles.labelImg}>
              <img src={tickAd} alt="" />
            </div>
            <div className={styles.AdNameHead}>
              <h2>Ad Text</h2>
              <input
                className={styles.AdInput}
                type="text"
                placeholder="Name Primary Text"
              />
            </div>
          </div>
        </div>

        {/* Ad Description */}
        <div className={styles.adName}>
          <div className={styles.labelContainer}>
            <div className={styles.labelImg}>
              <img src={tickAd} alt="" />
            </div>
            <div className={styles.AdNameHead}>
              <h2>Ad Description</h2>
              <textarea
                rows={6}
                className={styles.AdInput}
                placeholder="Enter Ad Description"
                style={{ marginTop: "20px" }}
              />
            </div>
          </div>
        </div>

        {/* Question Type Selection */}
        <div className={styles.adName}>
          <div className={styles.labelContainer}>
            <div className={styles.labelImg}>
              <img src={tickAd} alt="" />
            </div>
            <div className={styles.AdNameHead}>
              <h2>Survey Question Type</h2>
              <div className={styles.questionContainerSurvey}>
                <input
                  type="radio"
                  name="questionType"
                  checked={questionType === "yesno"}
                  onChange={() => setQuestionType("yesno")}
                  id="yesno"
                />
                <label htmlFor="yesno" style={{ marginLeft: "10px", cursor: "pointer" }}>
                  Yes or No Questions
                </label>
              </div>

              <div className={styles.questionContainerSurvey}>
                <input
                  type="radio"
                  name="questionType"
                  checked={questionType === "mc"}
                  onChange={() => setQuestionType("mc")}
                  id="mc"
                />
                <label htmlFor="mc" style={{ marginLeft: "10px", cursor: "pointer" }}>
                  Multiple Choice Questions
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Yes/No Questions Section */}
        {questionType === "yesno" && (
          <div className={styles.adName}>
            <h3>Yes/No Question</h3>
            <input
              type="text"
              className={styles.AdInput}
              placeholder="Enter your Yes/No question"
              value={yesNoQuestionInput}
              onChange={(e) => setYesNoQuestionInput(e.target.value)}
            />
            <button className={styles.searchBtn} onClick={handleYesNoAdd} style={{ marginTop: "10px" }}>
              Add Question
            </button>

            {yesNoQuestions.length > 0 && (
              <div style={{ marginTop: "20px" }}>
                <h4 style={{ marginBottom: "20px" }}>Added Yes/No Questions:</h4>
                {yesNoQuestions.map((q, idx) => (
                  <div className={styles.questionContainer} key={idx}>
                    {editState?.type === "yesno" && editState.index === idx ? (
                      <div className={styles.questionContainerspanEdit}>
                        <input
                          type="text"
                          value={editYesNoQuestion}
                          onChange={(e) => setEditYesNoQuestion(e.target.value)}
                          className={styles.AdInput}
                        />
                      </div>
                    ) : (
                      <span className={styles.questionContainerspan}>{q}</span>
                    )}

                    <div className={styles.editDelete}>
                      {editState?.type === "yesno" && editState.index === idx ? (
                        <>
                          <button className={styles.editButton} onClick={handleEditSave} style={{ marginRight: "8px" }}>
                            Save
                          </button>
                          <button className={styles.deleteButton} onClick={handleEditCancel}>
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button className={styles.editButton} onClick={() => handleEditStart("yesno", idx)} style={{ marginRight: "8px" }}>
                            Edit
                          </button>
                          <button className={styles.deleteButton} onClick={() => handleDelete("yesno", idx)}>
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Multiple Choice Section */}
        {questionType === "mc" && (
          <div className={styles.adName}>
            <h3>Multiple Choice Question</h3>
            <input
              type="text"
              className={styles.AdInput}
              placeholder="Enter your multiple choice question"
              value={mcQuestionInput}
              onChange={(e) => setMcQuestionInput(e.target.value)}
            />
            {mcOptions.map((opt, index) => (
              <input
                key={index}
                type="text"
                className={styles.AdInput}
                placeholder={`Option ${index + 1}`}
                style={{ marginTop: "10px" }}
                value={opt}
                onChange={(e) => {
                  const newOptions = [...mcOptions];
                  newOptions[index] = e.target.value;
                  setMcOptions(newOptions);
                }}
              />
            ))}
            <button className={styles.searchBtn} onClick={handleMcAdd} style={{ marginTop: "10px" }}>
              Add Question
            </button>

            {multipleChoiceQuestions.length > 0 && (
              <div style={{ marginTop: "20px" }}>
                <h4>Added Multiple Choice Questions:</h4>
                {multipleChoiceQuestions.map((q, idx) => (
                  <div
                    key={idx}
                    style={{
                      border: "1px solid #ccc",
                      padding: "10px",
                      marginBottom: "10px",
                      borderRadius: "6px",
                      backgroundColor: "#f0f8ff",
                      marginTop: "20px",
                    }}
                  >
                    {editState?.type === "mc" && editState.index === idx ? (
                      <>
                        <input
                          type="text"
                          value={editMcQuestion}
                          onChange={(e) => setEditMcQuestion(e.target.value)}
                          className={styles.AdInput}
                          style={{ marginBottom: "10px" }}
                        />
                        {editMcOptions.map((opt, i) => (
                          <input
                            key={i}
                            type="text"
                            value={opt}
                            onChange={(e) => {
                              const newOptions = [...editMcOptions];
                              newOptions[i] = e.target.value;
                              setEditMcOptions(newOptions);
                            }}
                            placeholder={`Option ${i + 1}`}
                            className={styles.AdInput}
                            style={{ marginBottom: "8px" }}
                          />
                        ))}
                        <div>
                          <button className={styles.backButton} onClick={handleEditSave} style={{ marginRight: "8px" }}>
                            Save
                          </button>
                          <button className={styles.backButton} onClick={handleEditCancel} style={{ backgroundColor: "#ccc" }}>
                            Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <strong>{q.question}</strong>
                        <ul style={{ marginTop: "10px" }}>
                          {q.options.map((opt, i) => (
                            <li key={i} style={{ listStyle: "none", paddingTop: "10px" }}>
                              {opt}
                            </li>
                          ))}
                        </ul>
                        <div style={{ marginTop: "20px" }}>
                          <button className={styles.editButton} onClick={() => handleEditStart("mc", idx)} style={{ marginRight: "8px" }}>
                            Edit
                          </button>
                          <button className={styles.deleteButton} onClick={() => handleDelete("mc", idx)} style={{ backgroundColor: "#e74c3c", color: "white" }}>
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Upload Image Section */}
        <div className={styles.adName}>
          <div className={styles.labelContainer}>
            <div className={styles.labelImg}>
              <img src={tickAd} alt="" />
            </div>
            <div className={styles.AdNameHead}>
              <h2>Upload Picture</h2>
            </div>
          </div>
          <div className={styles.fileUpload}>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              accept="image/*"
              onChange={handleFileChange}
            />
            <button onClick={handleButtonClick} className={styles.uploadButton}>
              Upload File
            </button>

            
          </div>
          {imagePreview && (
              <div style={{ marginTop: "20px" }} className={styles.previewContainer}>
                <img
                  src={imagePreview}
                  alt="Preview"
                />
                <button
          onClick={() => {
            setImagePreview(null);
            fileInputRef.current.value = null;
          }}
          style={{
            position: "absolute",
            top: "-10px",
            right: "10px",
            backgroundColor: "#e74c3c",
            color: "#fff",
            border: "none",
            borderRadius: "50%",
            width: "24px",
            height: "24px",
            cursor: "pointer",
          }}
          title="Remove Image"
        >
          ×
        </button>
              </div>
              
            )}
        </div>
        <div className={styles.nextButton}>
        <button>Next</button>
      </div>
      </div>
      
    </div>
  );
}

export default Surveyads;
