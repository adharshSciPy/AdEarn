import React, { useState, useEffect } from 'react'
import Sidebar from '../../../components/sidebar/Sidebar'
import Header from '../../../components/Header/Header';
import styles from "./KYCVerify.module.css"
import { Button, Flex, Progress, Tooltip, Pagination, Select } from 'antd';
import { useNavigate } from 'react-router-dom';
import baseUrl from '../../../baseurl';
import axios from "axios"

function KYCVerify() {

  const [kycRequested, setKycRequested] = useState([])
  const [verifyKYC, setVerifyKYC] = useState([])

  useEffect(() => {
    const verifyKYC = async () => {
      try {
        const kycVerified = await axios.get(`${baseUrl}/api/v1/admin/kyc-verified-users`);
        setVerifyKYC(kycVerified.data.users)
        console.log("verfied kyc vano", kycVerified)
      } catch (error) {
        console.log(error)
      }
    }

    verifyKYC()
  }, [])

  const verifyKyc = async (id) => {
    try {
      console.log("idid", id);

      const response = await axios.get(`${baseUrl}/api/v1/admin/kyc-requested-single-user`, {
        params: { id }
      });
      const kycData = response.data.data
      navigate(`/VerifyKYC/${id}`, { state: { kycData } });

      console.log("response", response.data.data);
    } catch (error) {
      console.error("Axios error:", error.response?.data?.message || error.message);
    }
  };

  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);


  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const handlenavigate = (id) => {
    console.log("id vannu", id)
    navigate(`/ViewKYC/${id}`)
  }

  const [activeTab, setActiveTab] = useState("KYC");

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
    setCurrentPage(1);
  };

  const tabs = [
    "KYC",
    "Verify KYC"
  ];

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const filteredVerifiedUsers = verifyKYC.filter(user => {
    const date = new Date(user.updatedAt || user.createdAt);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();

    return (
      (!selectedMonth || month === selectedMonth) &&
      (!selectedYear || year === selectedYear)
    );
  });




  const filteredVerifyAds = kycRequested.filter(ad => {
    if (!ad.createdAt) return false;

    const createdAtDate = new Date(ad.createdAt);
    const month = (createdAtDate.getMonth() + 1).toString().padStart(2, '0');
    const year = createdAtDate.getFullYear().toString();

    return (
      (!selectedMonth || month === selectedMonth) &&
      (!selectedYear || year === selectedYear)
    );
  });



  const paginatedVerifiedUsers = filteredVerifiedUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const paginatedVerifyAds = filteredVerifyAds.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const onChange = value => {
    console.log(`selected ${value}`);
  };
  const onSearch = value => {
    console.log('search:', value);
  };

  function formatDate(isoString) {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }


  useEffect(() => {
    const fetchVerifykyc = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/v1/admin/kyc-requested-users`)
        console.log("requested kyc", response.data.data)
        setKycRequested(response.data.data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchVerifykyc()
  }, [])


  return (
    <div className={styles.adminadsmain}>
      <div className={styles.adminadscontainermain}>
        <Sidebar />
        <Header />
        <div className={styles.Adminads}>
          <div style={{ width: '100%', maxWidth: '1550px', height: '600px', padding: '30px' }} className={styles.AdsSection}>
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
            <div style={{ display: 'flex', justifyContent: 'end', gap: "20px" }}>
              <Button>Log</Button>
              <Select
                showSearch
                placeholder="Month"
                optionFilterProp="label"
                onChange={(value) => setSelectedMonth(value)}
                onSearch={onSearch}
                options={[
                  { value: '01', label: 'January' },
                  { value: '02', label: 'February' },
                  { value: '03', label: 'March' },
                  { value: '04', label: 'April' },
                  { value: '05', label: 'May' },
                  { value: '06', label: 'June' },
                  { value: '07', label: 'July' },
                  { value: '08', label: 'August' },
                  { value: '09', label: 'September' },
                  { value: '10', label: 'October' },
                  { value: '11', label: 'November' },
                  { value: '12', label: 'December' },
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
            {activeTab === "KYC" && (
              <section className={styles.payoutTableSection}>
                <h1 style={{ fontSize: "25px", padding: '10px' }}>KYC Update</h1>
                <table className={styles.payoutTable}>
                  <thead>
                    <tr>
                      <th>User Name</th>
                      <th>Referral Code</th>
                      <th>KYC Status</th>
                      <th>View</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedVerifiedUsers.map((user) => (
                      <tr key={user._id}>
                        <td>{user.firstName} {user.lastName}<br />{user.uniqueUserId}</td>
                        <td>{user.myReferalCode}</td>
                        <td><span className={styles.statusOngoing}>Completed</span></td>
                        <td><Button onClick={() => handlenavigate(user._id)}>View</Button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className={styles.pagination}>
                  <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={paginatedVerifiedUsers.length}
                    onChange={handlePageChange}
                  />
                </div>
              </section>
            )}

            {activeTab === "Verify KYC" && (
              <section className={styles.payoutTableSection}>
                <h1 style={{ fontSize: "25px", padding: '10px' }}>Verify KYC</h1>
                <table className={styles.payoutTable}>
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Date</th>
                      <th>Kyc Verification</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedVerifyAds.map((ad) => (
                      <tr key={ad._id}>
                        <td>
                          {ad.firstName}{" "}{ad.lastName}<br />
                          {ad.uniqueUserId}
                        </td>
                        <td>{formatDate(ad.updatedAt)}</td>
                        <td>
                          <button
                            className={styles.redeemBtn}
                            onClick={() => verifyKyc(ad._id)}
                          >
                            {'Verify'}
                          </button>
                        </td>
                      </tr>
                    ))}

                  </tbody>
                </table>
                <div className={styles.pagination}>
                  <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={filteredVerifyAds.length}
                    onChange={handlePageChange}
                  />
                </div>
              </section>
            )}
          </div>
        </div>




      </div>
    </div >
  )
}


export default KYCVerify