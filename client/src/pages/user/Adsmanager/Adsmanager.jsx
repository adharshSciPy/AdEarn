import { React, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./adsmanager.module.css";
import edit from "../../../assets/edit.png";
import Duplicate from "../../../assets/copy.png";
import report from "../../../assets/love.jpg";
import Delete from "../../../assets/delete.png";
import generatePdf from "../Pdfgenerator/PdfGenerator";
import Navbar from "../NavBar/Navbar";
import axios from "axios";
import baseUrl from "../../../baseurl";
import { useSelector } from "react-redux";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { EyeOutlined } from "@ant-design/icons";
import CreateAdPopup from "../../../components/AdPopup/CreateAdPopup";
import { toast } from "react-toastify";
import Driver from "driver.js";
import "driver.js/dist/driver.min.css";

function Adsmanager() {
  const navigate = useNavigate();
  const [toggleStates, setToggleStates] = useState({});
  const [userads, setUserads] = useState([]);
  const userId = useSelector((state) => state.user.id);
  const [selectedAdId, setSelectedAdId] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [tourState, setTourState] = useState({
    navbarCompleted: false,
    homeCompleted: false
  });

  const handleToggle = async (adId) => {
    try {
      console.log("Toggling ad ID:", adId);

      // Toggle ad in backend
      const response = await axios.post(`${baseUrl}/api/v1/ads/toggle-ad`, {
        adId,
      });
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
        console.log("abc", ads);

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
  const fetchAds = async () => {
    try {
      console.log("User ID from store:", userId);
      const response = await axios.get(
        `${baseUrl}/api/v1/user/my-all-ads/${userId}`
      );
      const ads = response.data.data.ads;
      console.log("abc", ads);

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
  const handleDuplicate = () => {
    const selectedAd = userads.find((ad) => ad._id === selectedAdId);

    if (!selectedAd) {
      alert("Please select an ad to duplicate.");
      return;
    }

    if (selectedAd.imgAdRef) {
      navigate("/adduplicate", {
        state: { duplicatedAd: selectedAd },
      });
    } else if (selectedAd.videoAdRef) {
      navigate("/videoduplicate", {
        state: { duplicatedAd: selectedAd },
      });
    } else if (selectedAd.surveyAdRef) {
      navigate("/surveyedit", {
        state: { duplicatedAd: selectedAd },
      });
    } else {
      // fallback route, maybe show alert or navigate to default create ad page
      alert("Selected ad type not supported for duplication.");
    }
  };
  const handleLikeClick = () => {
    navigate(`/savedAds/${userId}`);
  };

  const handleDelete = async () => {
    console.log(selectedAdId);

    try {
      const res = await axios.delete(
        `${baseUrl}/api/v1/user/delete-ad/${userId}`,
        {
          data: { adId: selectedAdId },
        }
      );
      console.log(res);
      if (res.status === 200) {
        fetchAds()
      }
      toast.success("Ad successfully deleted");
    } catch (error) {
      toast.error("Cannot Delete the Ad");
      console.log(error);
    }
  };

  // Handle tour completion
  const handleTourComplete = (tourType) => {
    setTourState(prev => ({
      ...prev,
      [tourType === 'navbar' ? 'navbarCompleted' : 'homeCompleted']: true
    }));
  };

  //driver.js

  // Start home tour when navbar tour is completed
  useEffect(() => {
    const navbarTourDone = localStorage.getItem(`navbarTourDone_${userId}`);
    const adsmanagertourCompleted = localStorage.getItem(`adsmanagerTourCompleted_${userId}`);

    // Start home tour if navbar is done but full tour isn't complete
    if (navbarTourDone && !adsmanagertourCompleted) {
      // Add a small delay to ensure all elements are rendered
      setTimeout(() => {
        startHomeTour();
      }, 500);
    }
  }, [userId]); // Remove tourState.navbarCompleted dependency

  // Also trigger when navbar completes via callback
  useEffect(() => {
    if (tourState.navbarCompleted) {
      setTimeout(() => {
        startHomeTour();
      }, 500);
    }
  }, [tourState.navbarCompleted]);


  const startHomeTour = () => {
    // Check again to prevent duplicate tours
    const tourCompleted = localStorage.getItem(`adsmanagerTourCompleted_${userId}`);
    if (tourCompleted) return;

    let attempts = 0;

    const interval = setInterval(() => {
      const selectors = [
        "#place-ads-btn",
        "#get-duplicate",
        "#delete-ads",
        "#liked-ads"
      ];

      const existingSelectors = selectors.filter(sel => document.querySelector(sel));

      // Start tour if at least the place-ads-btn exists (main requirement)
      const canStartTour = document.querySelector("#place-ads-btn");

      if (canStartTour || attempts > 10) {
        clearInterval(interval);

        if (canStartTour) {
          // Use only existing selectors for the tour
          const tourSteps = [];

          if (document.querySelector("#place-ads-btn")) {
            tourSteps.push({
              element: "#place-ads-btn",
              popover: {
                title: "Place Your Ad",
                description: "Click here to place a new advertisement.",
                position: "bottom",
              },
            });
          }

          if (document.querySelector("#get-duplicate")) {
            tourSteps.push({
              element: "#get-duplicate",
              popover: {
                title: "Get Duplicate of Ads",
                description: "Select here to get duplicate of your ad.",
                position: "top",
              },
            });
          }

          if (document.querySelector("#delete-ads")) {
            tourSteps.push({
              element: "#delete-ads",
              popover: {
                title: "Delete Your Ads",
                description: "Click here to delete your ad.",
                position: "top",
              },
            });
          }

          if (document.querySelector("#liked-ads")) {
            tourSteps.push({
              element: "#liked-ads",
              popover: {
                title: "Liked Ads",
                description: "Click here to see liked ads.",
                position: "top",
              },
            });
          }

          const driver = new Driver({
            animate: true,
            opacity: 0.5,
            stageBackground: "rgba(0, 0, 0, 0.1)",
            allowClose: true,
            doneBtnText: "Finish Tour",
            closeBtnText: "Skip",
            nextBtnText: "Next",
            prevBtnText: "Previous",
            onReset: () => {
              // Mark both tours as completed
              localStorage.setItem(`adsmanagerTourCompleted_${userId}`, "true");
              setTourState(prev => ({
                ...prev,
                homeCompleted: true
              }));
            },
          });

          driver.defineSteps(tourSteps);
          driver.start();
        } else {
          console.warn("Place ads button not found, completing tour anyway.");
          // Still mark as completed if main element not found
          localStorage.setItem(`adsmanagerTourCompleted_${userId}`, "true");
        }
      }

      attempts++;
    }, 1000);
  };


  return (
    <div>
      <Navbar onTourComplete={handleTourComplete} />
      <CreateAdPopup isOpen={showPopup} onClose={() => setShowPopup(false)} />
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
                      <button
                        onClick={() => setShowPopup(true)}
                        style={{ overflow: "hidden" }}
                      >
                        Place Ads
                      </button>
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
                  <div className={styles.createButtonContainer} id="place-ads-btn">
                    <button
                      style={{ display: "flex", alignItems: "center" }}
                      onClick={() => setShowPopup(true)}
                    >
                      <span style={{ fontSize: "20px", paddingRight: "10px" }}>
                        +
                      </span>
                      Create
                    </button>
                  </div>
                  <div className={styles.duplicateButtonContainer} id="get-duplicate">
                    <button
                      onClick={handleDuplicate}
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <span style={{ height: "20px", width: "35px" }}>
                        <img src={Duplicate} alt="" className={styles.img} />
                      </span>
                      Duplicate
                    </button>
                  </div>

                  <div className={styles.deleteButtonContainer} id="delete-ads">
                    <button
                      style={{ display: "flex", alignItems: "center" }}
                      onClick={handleDelete}
                    >
                      <span style={{ height: "20px", width: "35px" }}>
                        <img src={Delete} alt="" className={styles.img} />
                      </span>
                      Delete
                    </button>
                  </div>
                  <div className={styles.reportButtonContainer} id="liked-ads">
                    <button
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      onClick={handleLikeClick}
                    >
                      <span style={{ height: "20px", width: "35px" }}>
                        <img src={report} alt="" className={styles.img} />
                      </span>
                      Liked Ads
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
                        <th>more</th>
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
                              <input
                                type="checkbox"
                                className={styles.tick}
                                checked={selectedAdId === row._id}
                                onChange={() =>
                                  setSelectedAdId(
                                    selectedAdId === row._id ? null : row._id
                                  )
                                }
                              />
                            </td>
                            <td className={styles.tdBorder}>
                              <div
                                className={`${styles.switchContainer} ${toggleStates[row._id] ? styles.on : ""
                                  }`}
                                onClick={() => handleToggle(row._id)}
                              >
                                <div
                                  className={`${styles.switchButton} ${toggleStates[row._id] ? styles.on : ""
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
                                      : `/surveyadedit/${row._id}` // fallback
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
                            <td>
                              {row.surveyAdRef ? (
                                <Link
                                  to={`/surveyaddetails/${row.surveyAdRef._id}/${userId}`}
                                  className={styles.iconBtn}
                                >
                                  <EyeOutlined
                                    style={{
                                      fontSize: "18px",
                                      color: "#1890ff",
                                    }}
                                  />
                                </Link>
                              ) : (
                                " "
                              )}
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
