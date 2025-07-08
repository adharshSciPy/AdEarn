import React, { useState } from "react";
import styles from "./contestpage.module.css";
import SuperSidebar from "../../../components/SuperAdminSideBar/SuperSidebar";
import Header from "../../../components/Header/Header";
import axios from "axios";
import baseUrl from "../../../baseurl";

function SuperAdminContestPage() {
  const [formData, setFormData] = useState({
    contestName: "",
    contestNumber: "",
    startDate: "",
    entryStars: "",
    maxParticipants: "",
    winnerSelectionType: "Manual",
  });

  const [winners, setWinners] = useState([
    { label: "1st winner", value: "", file: null },
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const numberToOrdinal = (n) => {
    const s = ["th", "st", "nd", "rd"],
      v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  const handleInputChange = (index, value) => {
    const updated = [...winners];
    // Allow only digits
    updated[index].value = value.replace(/\D/g, "");
    setWinners(updated);
  };

  const handleFileChange = (index, file) => {
    const updated = [...winners];
    updated[index].file = file;
    setWinners(updated);
  };

  const addWinner = () => {
    const nextIndex = winners.length + 1;
    const newLabel = `${numberToOrdinal(nextIndex)} winner`;
    setWinners([...winners, { label: newLabel, value: "", file: null }]);
  };

  const handleCancel = () => {
    setFormData({
      contestName: "",
      contestNumber: "",
      startDate: "",
      entryStars: "",
      maxParticipants: "",
      winnerSelectionType: "Manual",
    });

    setWinners([{ label: "1st winner", value: "", file: null }]);
  };

  const submitHandle = async (e) => {
    e.preventDefault();

    // Validate stars
    const rewardStructure = winners.map((winner, index) => ({
      position: index + 1,
      stars: Number(winner.value),
    }));

    const hasInvalidStars = rewardStructure.some(
      (item) => isNaN(item.stars) || item.stars <= 0
    );

    if (hasInvalidStars) {
      alert("Please enter valid stars (number > 0) for all winners.");
      return;
    }

    const data = new FormData();

    // Append contest data
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    data.append("rewardStructure", JSON.stringify(rewardStructure));

    // Append prize images
    winners.forEach((winner) => {
      if (winner.file) {
        data.append("prizeImages", winner.file);
      }
    });

    try {
      const response = await axios.post(
        `${baseUrl}/api/v1/super-admin/create-contest`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Contest created successfully!");
      console.log("Contest created:", response.data);
      handleCancel(); // Reset form
    } catch (error) {
      console.error("Error creating contest:", error);
      if (error.response?.data?.message) {
        alert(`Failed: ${error.response.data.message}`);
      } else {
        alert("An unexpected error occurred");
      }
    }
  };

  return (
    <div className={styles.UserAccount}>
      <SuperSidebar />
      <Header />
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h2>Create Contest</h2>
        </div>
        <div className={styles.container}>
          <form className={styles.form} onSubmit={submitHandle}>
            <label>Enter Contest Name</label>
            <input
              type="text"
              name="contestName"
              value={formData.contestName}
              onChange={handleChange}
              placeholder="Enter Contest Name"
              required
            />

            <label>Enter Contest Number</label>
            <input
              type="text"
              name="contestNumber"
              value={formData.contestNumber}
              onChange={handleChange}
              placeholder="Enter Contest Number"
              required
            />

            <label>Enter Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
            />

            <label>Enter Entry Stars</label>
            <input
              type="text"
              name="entryStars"
              value={formData.entryStars}
              onChange={handleChange}
              placeholder="Enter Entry Stars"
              required
            />

            <label>Total Entry</label>
            <input
              type="text"
              name="maxParticipants"
              value={formData.maxParticipants}
              onChange={handleChange}
              placeholder="Total Entry"
              required
            />

            <label>Winner Selection</label>
            <div className={styles.radioGroup}>
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <input
                  type="radio"
                  name="winnerSelectionType"
                  value="Automatic"
                  checked={formData.winnerSelectionType === "Automatic"}
                  onChange={handleChange}
                />
                <label>Automatic</label>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <input
                  type="radio"
                  name="winnerSelectionType"
                  value="Manual"
                  checked={formData.winnerSelectionType === "Manual"}
                  onChange={handleChange}
                />
                <label>Manual</label>
              </div>
            </div>

            <div className={styles.prizecontainer}>
              <h3>Prize Distribution</h3>
              <p className={styles.note}>
                *Image size must be width: 10cm, height: 8cm
              </p>
              {winners.map((winner, index) => (
                <div className={styles.winnerrow} key={index}>
                  <span className={styles.label}>{winner.label}</span>
                  <p>Enter stars or other prizes</p>
                  <input
                    type="text"
                    value={winner.value}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    placeholder="Enter prize (e.g., 100 stars)"
                    className={styles.prizeInput}
                    required
                  />
                  <label className={styles.uploadbutton}>
                    Upload
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={(e) =>
                        handleFileChange(index, e.target.files[0])
                      }
                    />
                  </label>
                </div>
              ))}
              <button type="button" className={styles.addbtn} onClick={addWinner}>
                Add Winner
              </button>
            </div>

            <div className={styles.buttons}>
              <button type="button" className={styles.cancel} onClick={handleCancel}>
                Cancel
              </button>
              <button type="submit" className={styles.submit}>
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SuperAdminContestPage;
