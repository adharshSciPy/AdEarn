import React, { useEffect, useState } from "react";
import Sidebar from "../../../components/sidebar/Sidebar";
import Header from "../../../components/Header/Header";
import styles from "./AdminAds.module.css";
import { Button, Flex, Progress, Tooltip, Pagination, Select } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import baseUrl from "../../../baseurl";

function AdminAds() {
  const [unverifiedAds, setunverifiedAds] = useState([]);
  const [verifiedAd, setVerifiedAd] = useState([]);

  const getunverifiedAds = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/v1/ads/ads-to-verify`);
      console.log("vtoer",response);
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
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);

  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const handlenavigate = (adId) => {
    navigate(`/VerifyAds/${adId}`);
  };

  const [activeTab, setActiveTab] = useState("Ads");

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  const tabs = ["Ads", "Verify Ads"];

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // const filteredAds = adsData.filter(ad => {
  //   if (!ad.startDate || !ad.startDate.includes('/')) return false;

  //   const [day, month, year] = ad.startDate.split('/');
  //   return (
  //     (!selectedMonth || month === selectedMonth) &&
  //     (!selectedYear || year === selectedYear)
  //   );
  // });

  // const filteredVerifyAds = adsVerifyData.filter(ad => {
  //   if (!ad.date || !ad.date.includes('/')) return false;

  //   const [day, month, year] = ad.date.split('/');
  //   return (
  //     (!selectedMonth || month === selectedMonth) &&
  //     (!selectedYear || year === selectedYear)
  //   );
  // });

  // const paginatedAds = filteredAds.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // const paginatedVerifyAds = filteredVerifyAds.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const onChange = (value) => {
    console.log(`selected ${value}`);
  };
  const onSearch = (value) => {
    console.log("search:", value);
  };

  useEffect(() => {
    getunverifiedAds();
    getVerifiedAd()
  }, []);

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
                <h1 style={{ fontSize: "25px", padding: '10px' }}>Current Ads</h1>
                <table className={styles.payoutTable}>
                  <thead>
                    <tr>
                      <th>Ads</th>
                      <th>Views</th>
                      <th>Total Amount</th>
                      <th>Start Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {verifiedAd.map((ad,index) => (
                      <tr key={index}>
                        <td>{ad.imageAd?.title?(<p>{ad.imageAd?.title}</p>):(ad?.videoAd?.title?(<p>{ad.videoAd?.title}</p>):null)}</td>
                        <td>{ad.imageAd?.userViewsNeeded?(<p>{ad.imageAd?.userViewsNeeded}</p>):(ad?.videoAd?.userViewsNeeded?(<p>{ad.videoAd?.userViewsNeeded}</p>):null)}</td>
                        <td>{ad.imageAd?.totalStarsAllocated?(<p>{ad.imageAd?.totalStarsAllocated}</p>):(ad?.videoAd?.totalStarsAllocated?(<p>{ad.videoAd?.totalStarsAllocated}</p>):null)}</td>
                        <td>{ad.imageAd?.createdAt?(<p>{ad.imageAd?.createdAt}</p>):(ad?.videoAd?.createdAt?(<p>{ad.videoAd?.createdAt}</p>):null)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className={styles.pagination}>
                    {/* <Pagination
                      current={currentPage}
                      pageSize={pageSize}
                      total={filteredAds.length}
                      onChange={handlePageChange}
                    /> */}
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
                      <th>Ads Verification</th>
                    </tr>
                  </thead>
                  <tbody>
                    {unverifiedAds.map((ad, index) => (
                      <tr key={index}>
                        <td>{ad.imageAd?.createdAt?(<p>{ad.imageAd?.createdAt}</p>):(ad?.videoAd?.createdAt?(<p>{ad.videoAd?.createdAt}</p>):null)}</td>
                        <td>{ad.imageAd?.title?(<p>{ad.imageAd?.title}</p>):(ad?.videoAd?.title?(<p>{ad.videoAd?.title}</p>):null)}</td>
                        <td>{ad.imageAd?.userViewsNeeded?(<p>{ad.imageAd?.userViewsNeeded}</p>):(ad?.videoAd?.userViewsNeeded?(<p>{ad.videoAd?.userViewsNeeded}</p>):null)}</td>
                        <td>{ad.imageAd?.totalStarsAllocated?(<p>{ad.imageAd?.totalStarsAllocated}</p>):(ad?.videoAd?.totalStarsAllocated?(<p>{ad.videoAd?.totalStarsAllocated}</p>):null)}</td>

                        <td>
                          <button
                            className={styles.redeemBtn}
                            onClick={() => handlenavigate(ad._id)}
                          >
                            {"Verify Now"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className={styles.pagination}>
                  {/* <Pagination
                      current={currentPage}
                      pageSize={pageSize}
                      total={filteredVerifyAds.length}
                      onChange={handlePageChange}
                    /> */}
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
