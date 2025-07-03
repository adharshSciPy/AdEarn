import React, { useState, useEffect } from 'react'
import styles from './AdminReport.module.css'
import Sidebar from '../../../components/sidebar/Sidebar'
import Header from "../../../components/Header/Header"
import CanvasJSReact from '@canvasjs/react-charts';
import { Tabs, Table, Button, Avatar, Select, Pagination } from 'antd';
import axios from 'axios'
import baseUrl from '../../../baseurl'
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from 'react-redux';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";



function AdminReport() {

  const id = useParams()
  const adminId = useSelector((state) => state.admin.id)
  const [verifyads, setVerifyads] = useState([])
  const [verifykyc, setVerifykyc] = useState([])
  const [adminName, setAdminName] = useState("")


  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);

  const [currentAdsPage, setCurrentAdsPage] = useState(1);
  const [verifyAdsPage, setVerifyAdsPage] = useState(1);

  const [pageSize, setPageSize] = useState(10);

  const [activeTab, setActiveTab] = useState("Verified Ads");
  const tabs = ["Verified Ads", "Verified Kyc"];

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  useEffect(() => {
    const getadmin = async () => {
      try {
        const adminres = await axios.get(`${baseUrl}/api/v1/admin/adminget/${adminId}`);
        console.log("adminres", adminres.data)
        setAdminName(adminres.data.username)
      } catch (error) {
        console.log(error)
      }
    }

    getadmin()
  }, [])


  useEffect(() => {
    const adminVerifiedads = async () => {
      try {
        const getads = await axios.get(`${baseUrl}/api/v1/admin/ads-verified/${adminId}`);
        setVerifyads(getads.data.data)
        console.log("getads", getads)
      } catch (error) {
        console.log(error)
      }
    }

    adminVerifiedads()
  }, [])

  useEffect(() => {
    const adminVerifiedkyc = async () => {
      try {
        const getkycs = await axios.get(`${baseUrl}/api/v1/admin/kycs-verified/${adminId}`);
        console.log("getkycs", getkycs)
        setVerifykyc(getkycs.data.data)

      } catch (error) {
        console.log(error)
      }
    }

    adminVerifiedkyc()

  }, [])

  // Filtered and paginated data for Verify Ads
  const filteredVerifiedAds = useMemo(() => {
    return verifyads.filter((ad) => {
      const date = new Date(ad.createdAt);
      const matchMonth = selectedMonth
        ? (date.getMonth() + 1).toString().padStart(2, '0') === selectedMonth
        : true;
      const matchYear = selectedYear
        ? date.getFullYear().toString() === selectedYear
        : true;
      return matchMonth && matchYear;
    });
  }, [verifyads, selectedMonth, selectedYear]);

  const paginatedVerifiedAds = useMemo(() => {
    const start = (currentAdsPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredVerifiedAds.slice(start, end);
  }, [filteredVerifiedAds, currentAdsPage, pageSize]);

  // Filtered and paginated data for Verify KYC
  const filteredVerifiedKyc = useMemo(() => {
    return verifykyc.filter((kyc) => {
      const date = new Date(kyc.createdAt);
      const matchMonth = selectedMonth
        ? (date.getMonth() + 1).toString().padStart(2, '0') === selectedMonth
        : true;
      const matchYear = selectedYear
        ? date.getFullYear().toString() === selectedYear
        : true;
      return matchMonth && matchYear;
    });
  }, [verifykyc, selectedMonth, selectedYear]);

  const paginatedVerifiedKyc = useMemo(() => {
    const start = (verifyAdsPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredVerifiedKyc.slice(start, end);
  }, [filteredVerifiedKyc, verifyAdsPage, pageSize]);

  const getTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };



  //download it in sheet

  const handleDownloadReport = () => {
    const wb = XLSX.utils.book_new();
    const sheetData = [];
    // Add admin name as the first row
    sheetData.push([`Admin Name: ${adminName}`]); // Full row

    // Add empty row for spacing
    sheetData.push([]);

    if (activeTab === "Verified Ads") {
      const verifiedAdsSheet = paginatedVerifiedAds.map((ad) => {
        const adRef = ad.adId.surveyAdRef || ad.adId.videoAdRef || ad.adId.imageAdRef || {};
        return {
          Name: adRef.title || 'N/A',
          Views: adRef.totalViewCount ?? 0,
          "Total Stars": adRef.totalStarsAllocated ?? 0,
          "Start Date": adRef.createdAt ? new Date(adRef.createdAt).toLocaleDateString() : '',
          "Verified Time": adRef.adVerifiedTime ? getTime(adRef.adVerifiedTime) : ''
        };
      });

      const dataSheet = XLSX.utils.json_to_sheet(verifiedAdsSheet, { origin: sheetData.length });
      const ws = XLSX.utils.aoa_to_sheet(sheetData);
      XLSX.utils.sheet_add_json(ws, verifiedAdsSheet, { origin: -1 });
      XLSX.utils.book_append_sheet(wb, ws, "Verified Ads");

    } else if (activeTab === "Verified Kyc") {
      const verifiedKycSheet = paginatedVerifiedKyc.map((kyc) => {
        const kycRef = kyc.kycId || {};
        return {
          Name: kycRef.fullName || 'N/A',
          Status: kycRef.kycStatus ?? 'N/A',
          "Assign Time": getTime(kycRef.assignmentTime) || '',
          "ID Proof": kycRef.documentType || 'N/A',
        };
      });

      const dataSheet = XLSX.utils.json_to_sheet(verifiedKycSheet, { origin: sheetData.length });
      const ws = XLSX.utils.aoa_to_sheet(sheetData);
      XLSX.utils.sheet_add_json(ws, verifiedKycSheet, { origin: -1 });
      XLSX.utils.book_append_sheet(wb, ws, "Verified KYC");
    }

    // Write and trigger download
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], { type: "application/octet-stream" });
    saveAs(blob, `${activeTab.replace(" ", "_")}_Report.xlsx`);
  };




  return (
    <div className={styles.adminreport}>
      <div className={styles.adminreportcontainer}>
        <Sidebar />
        <Header />
        <div className={styles.Adminreportsection}>
          <div style={{ width: '100%', maxWidth: '1550px', height: '600px', padding: '30px' }} className={styles.AdsSection}>

            <div className={styles.headsection}>
              <h1>Reports</h1>
              <Button onClick={handleDownloadReport}>Download</Button>
            </div>

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

                {activeTab === "Verified Ads" && (
                  <section className={styles.payoutTableSection}>
                    <h1 style={{ fontSize: "25px", padding: "10px" }}>
                      Verify Ads
                    </h1>
                    <table className={styles.payoutTable}>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Views</th>
                          <th>Total Stars</th>
                          <th>Start Date</th>
                          <th>Verified Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedVerifiedAds.map((ad, index) => {
                          const adRef = ad.adId.surveyAdRef || ad.adId.videoAdRef || ad.adId.imageAdRef || {};
                          return (
                            <tr key={index}>
                              <td>{adRef.title || 'N/A'}</td>
                              <td>{adRef.totalViewCount ?? 0}</td>
                              <td>{adRef.totalStarsAllocated ?? 0}</td>
                              <td>{new Date(adRef.createdAt).toLocaleDateString()}</td>
                              <td>{getTime(adRef.adVerifiedTime)}</td>
                            </tr>
                          );
                        })}
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
                          setPageSize(newPageSize);
                          setCurrentAdsPage(page);
                        }}
                        style={{ marginTop: "20px", textAlign: "center" }}
                      />

                    </div>
                  </section>
                )}

                {activeTab === "Verified Kyc" && (
                  <section className={styles.payoutTableSection}>
                    <h1 style={{ fontSize: "25px", padding: "10px" }}>
                      Verify Kyc
                    </h1>
                    <table className={styles.payoutTable}>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Status</th>
                          <th>Assign Time</th>
                          <th>ID Proof</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedVerifiedKyc.map((ad, index) => {
                          const adRef = ad.kycId || {};

                          return (
                            <tr key={index}>
                              <td>{adRef.fullName || 'N/A'}</td>
                              <td>{adRef.kycStatus ?? 0}</td>
                              <td>{getTime(adRef.assignmentTime)}</td>
                              <td>{adRef.documentType}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    <div className={styles.pagination}>
                      <Pagination
                        current={verifyAdsPage}
                        pageSize={pageSize}
                        total={filteredVerifiedKyc.length}
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
      </div>
    </div>
  )
}

export default AdminReport