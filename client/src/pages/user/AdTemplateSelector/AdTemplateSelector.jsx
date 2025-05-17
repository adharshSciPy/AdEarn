import React, { useState } from "react";
import Template1 from "./Templates/Template1";
import Template2 from "./Templates/Template2";
import Template3 from "./Templates/Template3";
import styles from "./adtemplate.module.css"; // Add borders, selected highlight, etc.
import padam from "../../../assets/adTemp1.png";


const AdTemplateSelector = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const templates = [
    { id: 1, name: "Template One", image: `${padam}` },
    { id: 2, name: "Template Two", image: `${padam}` },
    { id: 3, name: "Template Three", image: `${padam}` },
  ];

  return (
    <div>
      <div>
        <div className={styles.contentsContainer}>
          <div className={styles.firstContent}>
            <div className={styles.firstMain}>
              <div className={styles.firstMainleftContainer}>
                <div className={styles.firstMainHeader}>
                  <h2>Place Your Ads</h2>
                </div>
                <div className={styles.firstMainp}>
                  <p>
                    Providing cheap car rental services and safe and comfortable
                    facilities.
                  </p>
                </div>
                <div className={styles.firstMainbutton}>
                  <button>Place Ads</button>
                </div>
              </div>

              <div className={styles.firstMainrightContainer}>
                <div className={styles.firstImageContainer}>
                  <div className={styles.firstImageContainerMain}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.wrapper}>
        <h2 className={styles.heading}>Choose Your Ad Plan</h2>

        <div className={styles.planContainer}>
          <div
            className={`${styles.planCard} ${
              selectedPlan === "manual" ? styles.active : ""
            }`}
            onClick={() => setSelectedPlan("manual")}
          >
            <h3>Manual Ad Upload</h3>
            <p>Upload your custom ad manually with full control.</p>
            <button>Select</button>
          </div>

          <div
            className={`${styles.planCard} ${
              selectedPlan === "template" ? styles.active : ""
            }`}
            onClick={() => setSelectedPlan("template")}
          >
            <h3>Use Admin Templates</h3>
            <p>Choose from 3 beautiful templates designed for you.</p>
            <button>Select</button>
          </div>
        </div>

        {selectedPlan === "template" && (
          <div className={styles.templateSection}>
            <h3>Select a Template</h3>
            <div className={styles.templates}>
              {templates.map((temp) => (
                <div
                  key={temp.id}
                  className={`${styles.templateCard} ${
                    selectedTemplate === temp.id ? styles.selected : ""
                  }`}
                  onClick={() => setSelectedTemplate(temp.id)}
                >
                  <img src={temp.image} alt={temp.name} />
                  <p>{temp.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedPlan && (
          <div className={styles.confirmButton}>
            <button onClick={() => alert("Plan submitted!")}>Continue</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdTemplateSelector;
