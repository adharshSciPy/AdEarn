import { React, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./adsmanager.module.css";
import edit from "../../../assets/edit.png";
import Duplicate from "../../../assets/copy.png";
import report from "../../../assets/report.png";
import Delete from "../../../assets/delete.png";
import generatePdf from "../Pdfgenerator/PdfGenerator";
import Navbar from "../NavBar/Navbar";
import axios from "axios";
import baseUrl from "../../../baseurl";
import { useSelector } from "react-redux";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";


function Adsmanager() {
  const [toggleStates, setToggleStates] = useState({});
  const [userads, setUserads] = useState([]);
  const userId = useSelector((state) => state.user.id);
const handleToggle = async (adId) => {
  try {
    console.log("Toggling ad ID:", adId);

    // Toggle ad in backend
    const response = await axios.post(`${baseUrl}/api/v1/ads/toggle-ad`, { adId });
    console.log("Toggle response:", response);

    // Re-fetch all ads after toggle
    const updatedResponse = await axios.get(
      `${baseUrl}/api/v1/user/my-all-ads/${userId}`
    );
    const ads = updatedResponse.data.data.ads;
    

    setUserads(ads);

    const updatedToggleStates = {};
    ads.forEach((ad) => {
      const ref = ad.imgAdRef || ad.videoAdRef || ad.surveyAdRef;
      updatedToggleStates[ad._id] = ref?.isAdOn || false;
    });
    setToggleStates(updatedToggleStates);
    console.log("Updated toggle states after toggle:", updatedToggleStates);

  } catch (error) {
    console.error("Error toggling ad:", error);
  }
};


  useEffect(() => {
    const fetchAds = async () => {
      try {
        console.log("User ID from store:", userId);
        const response = await axios.get(
          `${baseUrl}/api/v1/user/my-all-ads/${userId}`
        );
        const ads = response.data.data.ads;
        console.log("abc",ads);
        
        setUserads(ads);

        const initialToggleStates = {};
        ads.forEach((ad) => {
          const ref = ad.imgAdRef || ad.videoAdRef || ad.surveyAdRef;
          initialToggleStates[ad._id] = ref?.isAdOn || false;
        });

        setToggleStates(initialToggleStates);
        console.log(
          "Fetched ads and initialized toggle states:",
          initialToggleStates
        );
      } catch (error) {
        console.error("Error fetching ads:", error);
      }
    };

    if (userId) {
      fetchAds();
    }
  }, [userId]);

const generatePdf = (row) => {
  const ref = row.imgAdRef || row.videoAdRef || row.surveyAdRef;

  if (!ref) {
    console.error("No ad data found in row:", row);
    return;
  }

  const doc = new jsPDF();

  // Title
  doc.setFontSize(16);
  doc.text("Ad Report", 20, 20);

  // Info Table
  const adType = row.imgAdRef
    ? "Image Ad"
    : row.videoAdRef
    ? "Video Ad"
    : "Survey Ad";

  const tableData = [
    ["Ad Title", ref.title || "Untitled"],
    ["Ad Type", adType],
    ["Total Reach", ref.userViewsNeeded ?? "N/A"],
    ["Total Views", ref.totalViewCount ?? "N/A"],
    ["Status", ref.isAdOn ? "Ongoing" : "Outgoing"],
  ];

  autoTable(doc, {
    startY: 30,
    head: [["Field", "Value"]],
    body: tableData,
    theme: "striped",
    styles: { halign: "left" },
    headStyles: { fillColor: [22, 160, 133] },
  });

  doc.save(`${ref.title || "ad"}_report.pdf`);
};

  return (
    <div>
      <Navbar />
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
                        <th>Edit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userads.map((row) => {
                        // Detect ad type and title from dynamic reference
                        let adType = "Unknown";
                        let adTitle = "Untitled";
                        let totalReach = "Unknown";
                        let totalViews = "Unknown";
                        const ref =
                          row.imgAdRef || row.videoAdRef || row.surveyAdRef;

                        if (row.imgAdRef) {
                          adType = "Image Ad";
                          adTitle = row.imgAdRef.title || "Untitled";
                          totalReach =
                            row.imgAdRef.userViewsNeeded || "Unknown";
                          totalViews = row.imgAdRef.totalViewCount || "0";
                        } else if (row.videoAdRef) {
                          adType = "Video Ad";
                          adTitle = row.videoAdRef.title || "Untitled";
                          totalReach =
                            row.videoAdRef.userViewsNeeded || "Unknown";
                          totalViews = row.videoAdRef.totalViewCount || "0";
                        } else if (row.surveyAdRef) {
                          adType = "Survey Ad";
                          adTitle = row.surveyAdRef.title || "Untitled";
                          totalReach =
                            row.surveyAdRef.userViewsNeeded || "Unknown";
                          totalViews = row.surveyAdRef.totalViewCount || "0";
                        }

                        return (
                          <tr key={row._id}>
                            <td>
                              <input type="checkbox" className={styles.tick} />
                            </td>
                            <td className={styles.tdBorder}>
                              <div
                                className={`${styles.switchContainer} ${
                                  toggleStates[row._id] ? styles.on : ""
                                }`}
                                onClick={() => handleToggle(row._id)}
                              >
                                <div
                                  className={`${styles.switchButton} ${
                                    toggleStates[row._id] ? styles.on : ""
                                  }`}
                                ></div>
                              </div>
                            </td>
                            <td>{adTitle}</td>
                            <td>{adType}</td>
                            <td>{totalReach}</td>
                            <td>{totalViews}</td>
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
                                color: ref?.isAdOn ? "green" : "red",
                                fontWeight: "bold",
                                textAlign: "center",
                              }}
                            >
                              {ref?.isAdOn ? "Ongoing" : "Outgoing"}
                            </td>
                            <td>
                              <Link
                                to={
                                  row?.imgAdRef
                                    ? `/adedit/${row._id}`
                                    : row?.videoAdRef
                                    ? `/videoadedit/${row._id}`
                                    : `/adedit/${row._id}` // fallback
                                }
                                className={styles.editBtn}
                              >
                                <img
                                  src={edit}
                                  alt="Edit"
                                  className={styles.img}
                                  style={{
                                    objectFit: "cover",
                                    height: "15px",
                                    width: "15px",
                                  }}
                                />
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
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
