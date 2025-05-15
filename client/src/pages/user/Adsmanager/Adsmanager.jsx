import { React, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../../components/sidebar/Sidebar";
import styles from "./adsmanager.module.css";
import logo from "../../../assets/Logo.png";
import edit from "../../../assets/edit.png";
import Duplicate from "../../../assets/copy.png";
import report from "../../../assets/report.png";
import Delete from "../../../assets/delete.png";
import generatePdf from "../Pdfgenerator/PdfGenerator"

function Adsmanager() {
  const [toggleStates, setToggleStates] = useState({});
  const handleToggle = (id) => {
    setToggleStates((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const tableData = [
    {
      id: 1,
      name: "John Doe",
      age: 28,
      email: "videoAd",
      phone: "100",
      address: "2000",
      city: "New York",
      state: "300",
      country: "ongoing",
    },
    {
      id: 2,
      name: "Jane Smith",
      age: 32,
      email: "Imagead",
      phone: "1000",
      address: "2500",
      city: "Los Angeles",
      state: "200",
      country: "outgoing",
    },
  ];
  return (
    <div>
      <div className={styles.mainContainer}>
        <div className={styles.homeMainContainer}>
          {/* <Sidebar/> */}
          <div className={styles.homeContainer}>
            <div className={styles.contentsContainer}>
              <div className={styles.firstContent}>
                <div className={styles.firstMain}>
                  <div className={styles.firstMainleftContainer}>
                    <div className={styles.firstMainHeader}>
                      <h2>Place Your Ads</h2>
                    </div>
                    <div className={styles.firstMainp}>
                      <p>
                        Providing cheap car rental services and safe and
                        comfortable facilities.
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
            <div className={styles.tableContainer}>
              <div className={styles.tableMain}>
                <div className={styles.buttonsContainer}>
                  <div className={styles.tickContainer}>
                    <input type="checkbox" className={styles.tick} />
                  </div>
                  <div className={styles.createButtonContainer}>
                    <button style={{ display: "flex", alignItems: "center" }}>
                      <span style={{ fontSize: "20px", paddingRight: "10px" }}>
                        +
                      </span>
                      create
                    </button>
                  </div>
                  <div className={styles.duplicateButtonContainer}>
                    <button style={{ display: "flex", alignItems: "center" }}>
                      <span style={{ height: "20px", width: "35px" }}>
                        <img src={Duplicate} alt="" className={styles.img} />
                      </span>
                      Duplicate
                    </button>
                  </div>

                  <div className={styles.deleteButtonContainer}>
                    <button style={{ display: "flex", alignItems: "center" }}>
                      <span style={{ height: "20px", width: "35px" }}>
                        <img src={Delete} alt="" className={styles.img} />
                      </span>
                      Delete
                    </button>
                  </div>
                  <div className={styles.reportButtonContainer}>
                    <button
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <span style={{ height: "20px", width: "35px" }}>
                        <img src={report} alt="" className={styles.img} />
                      </span>
                      Reports
                    </button>
                  </div>
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table
                    style={{ borderCollapse: "collapse", width: "100%" }}
                    className={styles.tableSub}
                  >
                    <thead>
                      <tr>
                        <th></th>
                        <th>On/Off</th>
                        <th>Ads Name</th>
                        <th>Ads Type</th>
                        <th>Total Reach</th>
                        <th>Total Views</th>
                        <th>Report</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableData.map((row) => (
                        <tr key={row.id}>
                          <td>
                            <input type="checkbox" className={styles.tick} />
                          </td>
                          <td className={styles.tdBorder}>
                            <div
                              className={`${styles.switchContainer} ${
                                toggleStates[row.id] ? styles.on : ""
                              }`}
                              onClick={() => handleToggle(row.id)}
                            >
                              <div
                                className={`${styles.switchButton} ${
                                  toggleStates[row.id] ? styles.on : ""
                                }`}
                              ></div>
                            </div>
                          </td>
                          <td className={styles.tdBorder}>
                            <div className={styles.tdMainContainer}>
                              <div className={styles.topTd}>
                                <p>{row.name}</p>
                                <button
                                  style={{ display: "flex" }}
                                  className={styles.tdButton}
                                >
                                  <span
                                    style={{
                                      height: "12px",
                                      width: "10px",
                                      marginLeft: "5px",
                                    }}
                                  >
                                    <img
                                      className={styles.img}
                                      src={edit}
                                      alt=""
                                    />
                                  </span>
                                </button>
                              </div>
                              <div className={styles.bottomTd}>
                                <button className={styles.tdButton}>
                                  <p>Duplicate</p>
                                  <span
                                    style={{
                                      height: "12px",
                                      width: "8px",
                                      marginLeft: "5px",
                                    }}
                                  >
                                    <img
                                      className={styles.img}
                                      src={Duplicate}
                                      alt=""
                                    />
                                  </span>
                                </button>
                              </div>
                            </div>
                          </td>
                          <td>{row.email}</td>
                          <td>{row.phone}</td>
                          <td>{row.address}</td>
                          <td>
                            <button
                              className={styles.downloadLink}
                              onClick={() => generatePdf(row)}
                            >
                              Download
                            </button>
                          </td>
                          <td
                            style={{
                              color: toggleStates[row.id] ? "green" : "red",
                              fontWeight: "bold",
                              textAlign: "center",
                            }}
                          >
                            {toggleStates[row.id] ? "Ongoing" : "paused"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Adsmanager;
