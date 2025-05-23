import React from "react";
import styles from "./ContestPage.module.css";
import { Link } from "react-router-dom";
import Navbar from "../NavBar/Navbar";


const contests = [
  {
    id: 1,
    title: "Contest 1",
    date: "02/03/2025",
    entry: "1200/1500",
    entrydetails:"entry details",
    details: "Manual Selection",
  },
  {
    id: 2,
    title: "Contest 2",
    date: "02/03/2025",
    entry: "1200/1500",
    entrydetails:"entry details",
    details: "Machine Selection",
  },
  {
    id: 3,
    title: "Contest 3",
    date: "02/03/2025",
    entry: "1200/1500",
    entrydetails:"entry details",
    details: "Machine Selection",
  },
  {
    id: 4,
    title: "Contest 3",
    date: "02/03/2025",
    entry: "1200/1500",
    entrydetails:"entry details",
    details: "Machine Selection",
  },
];

const ContestPage = () => {
  return (
    <>
    <Navbar/>
    <div className={styles.pageWrapper}>
        <div className={styles.headerContent}>
            <div className={styles.logContainer}>
                <div className={styles.twoButtons}>
                    <h3>Contest</h3>
                </div>
                <div className={styles.seeAll}>
                    <Link className={styles.link}>Contest Winners</Link>
                </div>
            </div>
            <div className={styles.buttonLog}>
                <button>Log</button>
            </div>

        </div>
      <div className={styles.header}>
        <span className={styles.title}>Contest</span>
        <span className={styles.tag}>200</span>
      </div>

      <div className={styles.cardContainer}>
        {contests.map((contest) => (
          <div className={styles.card} key={contest.id}>
            <div className={styles.cardHeader}>{contest.title}</div>
            <div className={styles.cardContent}>
              <div className={styles.lockIcon}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M4 6C4 3.79086 5.79086 2 8 2H14V6C14 8.20914 15.7909 10 18 10H20V18C20 20.2091 18.2091 22 16 22H8C5.79086 22 4 20.2091 4 18V6ZM8 11C7.44772 11 7 11.4477 7 12C7 12.5523 7.44772 13 8 13H10C10.5523 13 11 12.5523 11 12C11 11.4477 10.5523 11 10 11H8ZM8 15C7.44772 15 7 15.4477 7 16C7 16.5523 7.44772 17 8 17H12C12.5523 17 13 16.5523 13 16C13 15.4477 12.5523 15 12 15H8ZM16.6818 4.19879L16.5509 6.16288C16.5106 6.76656 17.0115 7.26743 17.6152 7.22718L19.5792 7.09624C20.4365 7.03909 20.8274 5.99887 20.2198 5.39135L18.3867 3.5582C17.7792 2.95068 16.7389 3.34153 16.6818 4.19879Z"
                    fill="orange"
                  />
                </svg>
              </div>
              <div className={styles.date}>{contest.date}</div>
              <div className={styles.entry}>{contest.entry}</div>
              <div className={styles.entryDetails}>{contest.entrydetails}</div>
              <div className={styles.details}>{contest.details}</div>

              <div className={styles.buttonContainer}>
                <button className={styles.enterButton}>Enter</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{ textAlign: "left" }}>Contest name</th>
              <th>Entry stars</th>
              <th>Entry date</th>
              <th>Total Entry</th>
              <th>Status</th>
              <th>Winner</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>
            {contests.map((contest) => (
              <tr key={contest.id}>
                <td>
                  <div className={styles.nameCell}>
                    <img
                      className={styles.avatar}
                      src={`/images/contest${contest.id}.png`}
                      alt=""
                    />
                    <span>{contest.title}</span>
                  </div>
                </td>
                <td>4</td>
                <td>02/06/2025</td>
                <td>1200/1200</td>
                <td className={styles.ongoing}>Ongoing</td>
                <td>Running</td>
                <td className={styles.editIcons}>
                  <button className={styles.iconBtn}>✏️</button>
                  <button className={styles.iconBtn}>🔍</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </>
  );
};

export default ContestPage;
