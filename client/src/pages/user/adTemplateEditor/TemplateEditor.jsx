import React, { useState } from "react";
import styles from "./TemplateEditor.module.css";
import adTemplate from "../../../assets/adTemp1.png"; // adjust path as needed

const TemplateEditor = () => {
  const [formData, setFormData] = useState({
    title: "BECOME A DATA SCIENTIST IN 3 MONTHS!",
    subtitle: "ADMISSION CLOSES SOON",
    features: [
      "Experience with Live Projects",
      "Gen - AI Training",
      "Internship",
      "Interview Training",
      "100% Placement",
      "700+ Placement completed",
    ],
    footer: "Limited Seats Available – Register Today",
    buttonText: "Apply Now",
  });

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleFeatureChange = (index, value) => {
    const updated = [...formData.features];
    updated[index] = value;
    setFormData({ ...formData, features: updated });
  };

  return (
    <div className={styles.container}>
      <div className={styles.editor}>
        <h2>Edit Ad Content</h2>
        <label>Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => handleInputChange("title", e.target.value)}
        />
        <label>Subtitle</label>
        <input
          type="text"
          value={formData.subtitle}
          onChange={(e) => handleInputChange("subtitle", e.target.value)}
        />

        <label>Features</label>
        {formData.features.map((feat, i) => (
          <input
            key={i}
            type="text"
            value={feat}
            onChange={(e) => handleFeatureChange(i, e.target.value)}
          />
        ))}

        <label>Footer Text</label>
        <input
          type="text"
          value={formData.footer}
          onChange={(e) => handleInputChange("footer", e.target.value)}
        />

        <label>Button Text</label>
        <input
          type="text"
          value={formData.buttonText}
          onChange={(e) => handleInputChange("buttonText", e.target.value)}
        />
      </div>

      <div className={styles.preview}>
        <div className={styles.adContainer}>
            <div className={styles.adContents}>
                <div className={styles.logoAd}>
                    <img src="" alt="" />
                </div>
                <div className={styles.contentsFirstAd}>
                    <h1>BECOME A</h1>
                </div>
                <div className={styles.secondContentAd}>
                    <h2>ADMISSION CLOSES SOON</h2>
                </div>
                <div className={styles.thirdContentAd}>
                    <p><span></span>Experience with Live Projects</p>
                    <p><span></span>Experience with Live Projects</p>
                    <p><span></span>Experience with Live Projects</p>
                    <p><span></span>Experience with Live Projects</p>
                    <p><span></span>Experience with Live Projects</p>
                    <p><span></span>Experience with Live Projects</p>
                </div>
                <div className={styles.lastContent}>
                    <p>Limited Seats Available - Register Today</p>
                    <div className={styles.backgroundDiv}></div>
                </div>
                <div className={styles.adFooter}>
                    <button>Apply Now</button>
                </div>
            </div>
            <div className={styles.adHead}>
                <h2>Data Science</h2>
            </div>
        </div>
        <div className={styles.imageContainerAd}>
            <img src="" alt="" />
        </div>
      </div>
    </div>
  );
};

export default TemplateEditor;
