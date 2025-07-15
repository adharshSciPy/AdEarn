import React, { useState } from "react";
import styles from "./contestpage.module.css";
import SuperSidebar from "../../../components/SuperAdminSideBar/SuperSidebar";
import Header from "../../../components/Header/Header";
import axios from "axios";
import baseUrl from "../../../baseurl";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
    if (updated[index].file) return; // Prevent typing if image exists
    updated[index].value = value.replace(/\D/g, "");
    setWinners(updated);
  };

  const handleFileChange = (index, file) => {
    const updated = [...winners];
    updated[index].file = file;
    updated[index].value = ""; // Clear stars if image is selected
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

    const rewardStructure = [];
    let invalid = false;

    for (let i = 0; i < winners.length; i++) {
      const winner = winners[i];
      const stars = Number(winner.value);
      const hasStars = !isNaN(stars) && stars > 0;
      const hasFile = !!winner.file;

      if (!hasStars && !hasFile) {
        invalid = true;
        break;
      }

      if (hasStars && hasFile) {
        toast.error(`Winner ${i + 1} cannot have both stars and an image.`);
        return;
      }

      rewardStructure.push({
        position: i + 1,
        stars: hasStars ? stars : 0,
      });
    }

    if (invalid) {
      toast.error("Each winner must have either a prize image or valid stars.");
      return;
    }

    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    data.append("rewardStructure", JSON.stringify(rewardStructure));

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

      toast.success("🎉 Contest created successfully!");
      console.log("Contest created:", response.data);
      handleCancel(); // Reset form
    } catch (error) {
      console.error("Error creating contest:", error);
      if (error.response?.data?.message) {
        toast.error(`❌ Failed: ${error.response.data.message}`);
      } else {
        toast.error("❗ An unexpected error occurred");
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
                  <p>Enter stars or upload a prize image</p>
                  <input
                    type="text"
                    value={winner.value}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    placeholder="Enter stars (e.g., 100)"
                    className={styles.prizeInput}
                    disabled={winner.file !== null}
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
                      disabled={!!winner.value}
                    />
                  </label>
                  {winner.file && <span>{winner.file.name}</span>}
                </div>
              ))}
              <button type="button" className={styles.addbtn} onClick={addWinner}>
                Add Winner
              </button>
            </div>

            <div className={styles.buttons}>
              <button
                type="button"
                className={styles.cancel}
                onClick={handleCancel}
              >
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
