import React, { useState } from 'react'
import Sidebar from '../../../components/sidebar/Sidebar'
import Header from '../../../components/Header/Header';
import styles from "./KYCVerify.module.css"
import { Button, Flex, Progress, Tooltip, Pagination, Select } from 'antd';
import { useNavigate } from 'react-router-dom';

function KYCVerify() {

  const adsData = Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    title: `User Name ${i + 1}`,
    status: i % 3 === 0 ? 'Not Applied' : 'Applied',
    kycstatus: i % 3 === 0 ? 'Not Completed' : 'Completed',
    approved: true,
    startDate: "02/06/2025",
  }));

  const adsVerifyData = Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    title: `User Name ${i + 1}`,
    date: "02/06/2025",
    status: i % 3 === 0 ? 'Not Applied' : 'Applied',
    verificationStatus: "Verify Now",
  }));

  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);


  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const handlenavigate = (adId) => {
    navigate(`/VerifyKYC/${adId}`)
  }

  const [activeTab, setActiveTab] = useState("KYC");

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  const tabs = [
    "KYC",
    "Verify KYC"
  ];

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const filteredAds = adsData.filter(ad => {
    if (!ad.startDate || !ad.startDate.includes('/')) return false;

    const [day, month, year] = ad.startDate.split('/');
    return (
      (!selectedMonth || month === selectedMonth) &&
      (!selectedYear || year === selectedYear)
    );
  });



  const filteredVerifyAds = adsVerifyData.filter(ad => {
    if (!ad.date || !ad.date.includes('/')) return false;

    const [day, month, year] = ad.date.split('/');
    return (
      (!selectedMonth || month === selectedMonth) &&
      (!selectedYear || year === selectedYear)
    );
  });



  const paginatedAds = filteredAds.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const paginatedVerifyAds = filteredVerifyAds.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const onChange = value => {
    console.log(`selected ${value}`);
  };
  const onSearch = value => {
    console.log('search:', value);
  };


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
                      <th>Ads</th>
                      <th>Date</th>
                      <th>Payout Status</th>
                      <th>KYC Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedAds.map((ad) => (
                      <tr key={ad.id}>
                        <td>{ad.title}<br />User Id</td>
                        <td>{ad.startDate}</td>
                        <td>
                          <span className={ad.status === "Applied" ? styles.statusOngoing : styles.statusStopped}>
                            {ad.status}
                          </span>
                        </td>
                        <td>
                          <span className={ad.kycstatus === "Completed" ? styles.statusOngoing : styles.statusStopped}>
                            {ad.kycstatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className={styles.pagination}>
                  <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={filteredAds.length}
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
                      <th>Ads</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Ads Verification</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedVerifyAds.map((ad) => (
                      <tr key={ad.id}>
                        <td>
                          {ad.title}<br />
                          User Id
                        </td>
                        <td>{ad.date}</td>
                        <td>
                          <span className={ad.status === "Applied" ? styles.statusOngoing : styles.statusStopped}>
                            {ad.status === "Applied" ? "Applied" : "Not Applied"}
                          </span>
                        </td>
                        <td>
                          <button
                            className={styles.redeemBtn}
                            onClick={() => handlenavigate(ad.id)}
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
    </div>
  )
}


export default KYCVerify