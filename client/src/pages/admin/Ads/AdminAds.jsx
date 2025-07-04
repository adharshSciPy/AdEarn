import React, { useEffect, useState } from "react";
import Sidebar from "../../../components/sidebar/Sidebar";
import Header from "../../../components/Header/Header";
import styles from "./AdminAds.module.css";
import { Button, Flex, Progress, Tooltip, Pagination, Select } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import baseUrl from "../../../baseurl";
import { useMemo } from "react";
import { useParams } from "react-router-dom";

function AdminAds() {
  const id = useParams()
  const [unverifiedAds, setunverifiedAds] = useState([]);
  const [verifiedAd, setVerifiedAd] = useState([]);

  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);

  const [currentAdsPage, setCurrentAdsPage] = useState(1);
  const [verifyAdsPage, setVerifyAdsPage] = useState(1);

  const [activeTab, setActiveTab] = useState("Ads");
  const tabs = ["Ads", "Verify Ads"];



  const getunverifiedAds = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/v1/ads/ads-to-verify`);
      console.log("vtoer", response);
      setunverifiedAds(response.data.ads);
    } catch (error) {
      console.log(error);
    }
  };
  const getVerifiedAd = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/v1/ads/verified-ads`);
      setVerifiedAd(response.data.ads);
      console.log("verified", response);
    } catch (error) {
      console.log(error);
    }
  };

  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const assignToadmin = async (adId) => {
    console.log("adID", adId)
    const adminId = id.id;
    console.log("adminid", adminId)
    try {
      const response = await axios.post(`${baseUrl}/api/v1/admin/assign-ads-admin/${adminId}`, { adId });
      setunverifiedAds((prevAds) => prevAds.filter((ad) => ad._id !== adId));
      console.log(response)
    } catch (error) {
      console.log(error)
    }
  };


  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };


  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const filteredVerifiedAds = useMemo(() => {
    return verifiedAd.filter((ad) => {
      const dateStr = ad.imageAd?.createdAt || ad.videoAd?.createdAt || ad.surveyAd?.createdAt;
      if (!dateStr) return false;

      const date = new Date(dateStr);
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = String(date.getFullYear());

      return (
        (!selectedMonth || selectedMonth === month) &&
        (!selectedYear || selectedYear === year)
      );
    });
  }, [verifiedAd, selectedMonth, selectedYear]);

  const filteredUnverifiedAds = useMemo(() => {
    return unverifiedAds.filter((ad) => {
      const dateStr = ad.imageAd?.createdAt || ad.videoAd?.createdAt || ad.surveyAd?.createdAt;
      if (!dateStr) return false;

      const date = new Date(dateStr);
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = String(date.getFullYear());

      return (
        (!selectedMonth || selectedMonth === month) &&
        (!selectedYear || selectedYear === year)
      );
    });
  }, [unverifiedAds, selectedMonth, selectedYear]);

  const onChange = (value) => {
    console.log(`selected ${value}`);
  };
  const onSearch = (value) => {
    console.log("search:", value);
  };

  useEffect(() => {
    getunverifiedAds();
    getVerifiedAd();
  }, []);

  useEffect(() => {
    setCurrentAdsPage(1);
    setVerifyAdsPage(1);
  }, [selectedMonth, selectedYear]);


  const paginatedVerifiedAds = useMemo(() => {
    const start = (currentAdsPage - 1) * pageSize;
    return filteredVerifiedAds.slice(start, start + pageSize);
  }, [filteredVerifiedAds, currentAdsPage]);

  const paginatedUnverifiedAds = useMemo(() => {
    const start = (verifyAdsPage - 1) * pageSize;
    return filteredUnverifiedAds.slice(start, start + pageSize);
  }, [filteredUnverifiedAds, verifyAdsPage]);


  return (
    <div className={styles.adminadsmain}>
      <div className={styles.adminadscontainermain}>
        <Sidebar />
        <Header />
        <div className={styles.Adminads}>
          <div
            style={{
              width: "100%",
              maxWidth: "1550px",
              height: "600px",
              padding: "30px",
            }}
            className={styles.AdsSection}
          >
            <nav className={styles.tabMenu}>
              <ul>
                {tabs.map((tab) => (
                  <li
                    key={tab}
                    className={activeTab === tab ? styles.active : ""}
                    onClick={() => handleTabClick(tab)}
                  >
                    {tab}
                  </li>
                ))}
              </ul>
            </nav>
            <div
              style={{ display: "flex", justifyContent: "end", gap: "20px" }}
            >
              <Button>Log</Button>
              <Select
                showSearch
                placeholder="Month"
                optionFilterProp="label"
                onChange={(value) => setSelectedMonth(value)}
                onSearch={onSearch}
                options={[
                  { value: "01", label: "January" },
                  { value: "02", label: "February" },
                  { value: "03", label: "March" },
                  { value: "04", label: "April" },
                  { value: "05", label: "May" },
                  { value: "06", label: "June" },
                  { value: "07", label: "July" },
                  { value: "08", label: "August" },
                  { value: "09", label: "September" },
                  { value: "10", label: "October" },
                  { value: "11", label: "November" },
                  { value: "12", label: "December" },
                ]}
              />
              <Select
                showSearch
                placeholder="Year"
                optionFilterProp="label"
                onChange={(value) => setSelectedYear(value)}
                onSearch={onSearch}
                options={Array.from({ length: 20 }, (_, i) => {
                  const year = 2025 + i;
                  return {
                    value: year.toString(),
                    label: year.toString(),
                  };
                })}
              />
            </div>
            {activeTab === "Ads" && (
              <section className={styles.payoutTableSection}>
                <h1 style={{ fontSize: "25px", padding: "10px" }}>
                  Current Ads
                </h1>
                <table className={styles.payoutTable}>
                  <thead>
                    <tr>
                      <th>Ads</th>
                      <th>Views</th>
                      <th>Total Stars</th>
                      <th>Start Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedVerifiedAds.map((ad, index) => (
                      <tr key={index}>
                        <td>
                          {ad.imageAd?.title ||
                            ad.videoAd?.title ||
                            ad.surveyAd?.title}
                        </td>

                        <td>

                          {ad.imageAd?.userViewsNeeded ? (
                            <p>{ad.imageAd.userViewsNeeded}</p>
                          ) : ad?.videoAd?.userViewsNeeded ? (
                            <p>{ad.videoAd.userViewsNeeded}</p>
                          ) : ad?.surveyAd?.userViewsNeeded ? (
                            <p>{ad.surveyAd.userViewsNeeded}</p>
                          ) : null}
                        </td>
                        <td>
                          {ad.imageAd?.totalStarsAllocated ? (
                            <p>{ad.imageAd?.totalStarsAllocated}</p>
                          ) : ad?.videoAd?.totalStarsAllocated ? (
                            <p>{ad.videoAd?.totalStarsAllocated}</p>
                          ) : ad?.surveyAd?.totalStarsAllocated ? (
                            <p>{ad.surveyAd.totalStarsAllocated}</p>
                          ) : null}
                        </td>
                        <td>
                          {ad.imageAd?.createdAt ? (
                            <p>
                              {
                                new Date(ad.imageAd.createdAt)
                                  .toISOString()
                                  .split("T")[0]
                              }
                            </p>
                          ) : ad.videoAd?.createdAt ? (
                            <p>
                              {
                                new Date(ad.videoAd.createdAt)
                                  .toISOString()
                                  .split("T")[0]
                              }
                            </p>
                          ) : ad.surveyAd?.createdAt ? (
                            <p>
                              {
                                new Date(ad.surveyAd.createdAt)
                                  .toISOString()
                                  .split("T")[0]
                              }
                            </p>
                          ) : null}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className={styles.pagination}>
                  <Pagination
                    current={currentAdsPage}
                    pageSize={pageSize}
                    total={filteredVerifiedAds.length}
                    showSizeChanger
                    pageSizeOptions={['10', '20', '50', '100']}
                    onChange={(page, newPageSize) => {
                      // ✅ Stay on current page and apply new pageSize
                      setPageSize(newPageSize);
                      setCurrentAdsPage(page);
                    }}
                    style={{ marginTop: "20px", textAlign: "center" }}
                  />

                </div>
              </section>
            )}

            {activeTab === "Verify Ads" && (
              <section className={styles.payoutTableSection}>
                <h1 style={{ fontSize: "25px", padding: "10px" }}>
                  Verify Ads
                </h1>
                <table className={styles.payoutTable}>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Ads</th>
                      <th>Views</th>
                      <th>Total amount</th>
                      <th>Move to Admin</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedUnverifiedAds.map((ad, index) => (
                      <tr key={index}>
                        <td>
                          {
                            new Date(
                              ad.imageAd?.createdAt ||
                              ad.videoAd?.createdAt ||
                              ad.surveyAd?.createdAt
                            )
                              .toISOString()
                              .split("T")[0]
                          }
                        </td>
                        <td>
                          {ad.imageAd?.title ||
                            ad.videoAd?.title ||
                            ad.surveyAd?.title}
                        </td>
                        <td>
                          {ad.imageAd?.userViewsNeeded ||
                            ad.videoAd?.userViewsNeeded ||
                            ad.surveyAd?.userViewsNeeded}
                        </td>
                        <td>
                          {ad.imageAd?.totalStarsAllocated ||
                            ad.videoAd?.totalStarsAllocated ||
                            ad.surveyAd?.totalStarsAllocated}
                        </td>
                        <td>
                          <button
                            className={styles.redeemBtn}
                            onClick={() => assignToadmin(ad._id)}
                          >
                            Send
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className={styles.pagination}>
                  <Pagination
                    current={verifyAdsPage}
                    pageSize={pageSize}
                    total={filteredUnverifiedAds.length}
                    showSizeChanger
                    pageSizeOptions={['10', '20', '50', '100']}
                    onChange={(page, newPageSize) => {
                      setPageSize(newPageSize);
                      setVerifyAdsPage(page);
                    }}
                    style={{ marginTop: "20px", textAlign: "center" }}
                  />

                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminAds;
