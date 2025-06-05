import React, { useState } from "react";
import styles from "./contestpage.module.css";
import SuperSidebar from "../../../components/SuperAdminSideBar/SuperSidebar";
import Header from "../../../components/Header/Header"


function SuperAdminContestPage() {
  const [formData, setFormData] = useState({
    couponNumber: "",
    couponCount: "",
    starCount: "",
    date: "",
    expiryDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    // You can call your API here
  };

  const [winners, setWinners] = useState([
    { label: "1st winner", value: "", file: null }
  ]);

  const numberToOrdinal = (n) => {
    const s = ["th", "st", "nd", "rd"],
      v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };


  const handleInputChange = (index, value) => {
    const updated = [...winners];
    updated[index].value = value;
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

  const submitHandle = () => {
    console.log(winners);
    alert("Submitted! Check console for data.");
  };

  const handleCancel = () => {
    setWinners([
      { label: "1st winner", value: "", file: null },
      { label: "2nd winner", value: "", file: null },
      { label: "3rd winner", value: "", file: null },
      { label: "4th winner", value: "", file: null },
    ]);
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
          <form className={styles.form} onSubmit={handleSubmit}>
            <label>Enter Contest Name</label>
            <input
              type="text"
              name="contestName"
              value={formData.contestName}
              onChange={handleChange}
              placeholder="Enter Contest Name"
            />

            <label>Enter Contest Number</label>
            <input
              type="text"
              name="contestNumber"
              value={formData.contestNumber}
              onChange={handleChange}
              placeholder="Enter Contest Number"
            />

            <label>Enter Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              placeholder="Enter Start Date"
            />

            <label>Enter End Date</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              placeholder="Enter End Date"
            />

            <label>Enter Entry Stars</label>
            <input
              type="text"
              name="entryStars"
              value={formData.entryStars}
              onChange={handleChange}
              placeholder="Enter Entry Stars"
            />

            <label>Total Entry</label>
            <input
              type="text"
              name="totalEntry"
              value={formData.totalEntry}
              onChange={handleChange}
              placeholder="Total Entry"
            />

            <label>Result</label>
            <input
              type="text"
              name="result"
              value={formData.result}
              onChange={handleChange}
              placeholder="Result"
            />

            <div className={styles.prizecontainer}>
              <h3>Price distribution</h3>
              <p className={styles.note}>*image size must be width : 10cm, height : 8cm</p>
              {winners.map((winner, index) => (
                <div className={styles.winnerrow} key={index}>
                  <span className={styles.label}>{winner.label}</span>
                  <p>Enter stars or other prices</p>
                  <label className={styles.uploadbutton}>
                    Upload
                    <input
                      type="file"
                      hidden
                      onChange={(e) => handleFileChange(index, e.target.files[0])}
                    />
                  </label>
                </div>
              ))}
              <button className={styles.addbtn} onClick={addWinner}>
                Add Winners
              </button>
            </div>

            <div className={styles.buttons}>
              <button type="button" className={styles.cancel}>
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
  )
}

export default SuperAdminContestPage
