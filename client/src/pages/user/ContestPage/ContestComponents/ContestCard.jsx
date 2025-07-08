import React from "react";
import { FaLock } from "react-icons/fa";

const ContestCard = ({ data }) => {
  return (
    <div style={{ width: "200px", background: "#f2e9ff", borderRadius: "12px", padding: "1rem", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <FaLock />
        <span>{data.date}</span>
      </div>
      <h2 style={{ fontSize: "24px", fontWeight: "bold", margin: "1rem 0" }}>{data.entry}</h2>
      <p style={{ margin: "0.2rem 0" }}>Entry details</p>
      <p style={{ fontWeight: "500" }}>{data.type}</p>
      <button style={{ marginTop: "1rem", padding: "5px 10px", background: "white", border: "1px solid purple", borderRadius: "6px", cursor: "pointer" }}>
        Enter
      </button>
    </div>
  );
};

export default ContestCard;
