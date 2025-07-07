import React from "react";
import { FaEdit } from "react-icons/fa";

const tableData = [
  { name: "Contest 1", stars: 4, date: "02/06/2025", total: "1200/1200", status: "Ended", winner: "Username" },
  { name: "Contest 2", stars: 4, date: "02/06/2025", total: "1200/1200", status: "Ongoing", winner: "Running" },
  { name: "Contest 3", stars: 4, date: "02/06/2025", total: "1200/1200", status: "Ongoing", winner: "Running" },
  { name: "Contest 4", stars: 4, date: "02/06/2025", total: "1200/1200", status: "Ongoing", winner: "Running" },
];

export default function ContestTable() {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
      <thead>
        <tr style={{ background: "#f5f5f5", textAlign: "left" }}>
          <th>Contest name</th>
          <th>Entry stars</th>
          <th>Entry date</th>
          <th>Total Entry</th>
          <th>Status</th>
          <th>Winner</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {tableData.map((row, index) => (
          <tr key={index} style={{ borderBottom: "1px solid #ddd" }}>
            <td style={{ display: "flex", alignItems: "center", gap: "10px", padding: "0.5rem" }}>
              <img src={`https://placehold.co/30x30?text=${index + 1}`} alt="icon" style={{ borderRadius: "50%" }} />
              {row.name}
            </td>
            <td>{row.stars}</td>
            <td>{row.date}</td>
            <td>{row.total}</td>
            <td>{row.status}</td>
            <td>{row.winner}</td>
            <td>
              <FaEdit style={{ cursor: "pointer" }} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
