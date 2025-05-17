import React, { useState } from 'react'
import Sidebar from '../../../components/sidebar/Sidebar'
import Header from '../../../components/Header/Header';
import styles from "./AdminAds.module.css"
import { Button, Flex, Progress, Tooltip, Pagination } from 'antd';
import { useNavigate } from 'react-router-dom';


const adsData = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  title: `Ads ${i + 1}`,
  status: i % 3 === 0 ? 'Stopped' : 'Ongoing',
  approved: true,
  amount: 500,
  views: Math.floor(Math.random() * 800),
  totalViews: 800,
  startDate: "02/06/2025",
  endDate: "05/06/2025",
}));

const adsVerifyData = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  date: "02/06/2025",
  title: `Ads ${i + 1}`,
  views: Math.floor(Math.random() * 800),
  totalViews: 800,
  totalAmount: 500,
  status: i % 3 === 0 ? 'Stopped' : 'Ongoing',
  endDate: "2025-06-05",
  verificationStatus: "Verify Now",
}));



function AdminAds() {

  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const handlenavigate = (adId) => {
    navigate(`/VerifyAds/${adId}`)
  }

  const [activeTab, setActiveTab] = useState("Ads");

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  const tabs = [
    "Ads",
    "Verify Ads"
  ];

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const paginatedAds = adsData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const paginatedVerifyAds = adsVerifyData.slice((currentPage - 1) * pageSize, currentPage * pageSize);


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
            <div style={{ display: 'flex', justifyContent: 'end' }}>
              <Button>Log</Button>
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
                      <th>End Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedAds.map((ad) => (
                      <tr key={ad.id}>
                        <td>{ad.title}<br />Approved</td>
                        <td>
                          <Flex gap="small" vertical>
                            <Tooltip title={`${ad.views} out of ${ad.totalViews} views`}>
                              <Progress
                                percent={100}
                                success={{ percent: (ad.views / ad.totalViews) * 100, strokeColor: '#FCB859' }}
                                strokeWidth={5}
                                strokeColor="#2B2B36"
                                showInfo={false}
                              />
                            </Tooltip>
                          </Flex>
                        </td>
                        <td>&#8377; {ad.amount}</td>
                        <td>{ad.startDate}</td>
                        <td>{ad.endDate}</td>
                        <td>
                          <span className={ad.status === "Ongoing" ? styles.statusOngoing : styles.statusStopped}>
                            {ad.status}
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
                    total={adsData.length}
                    onChange={handlePageChange}
                  />
                </div>
              </section>
            )}

            {activeTab === "Verify Ads" && (
              <section className={styles.payoutTableSection}>
                <h1 style={{ fontSize: "25px", padding: '10px' }}>Verify Ads</h1>
                <table className={styles.payoutTable}>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Ads</th>
                      <th>Views</th>
                      <th>Total amount</th>
                      <th>Status</th>
                      <th>End Date</th>
                      <th>Ads Verification</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedVerifyAds.map((ad) => (
                      <tr key={ad.id}>
                        <td>{ad.date}</td>
                        <td>
                          {ad.title}<br />
                          Approved
                        </td>
                        <td>
                           <Flex gap="small" vertical>
                            <Tooltip title={`${ad.views} out of ${ad.totalViews} views`}>
                              <Progress
                                percent={100}
                                success={{ percent: (ad.views / ad.totalViews) * 100, strokeColor: '#FCB859' }}
                                strokeWidth={5}
                                strokeColor="#2B2B36"
                                showInfo={false}
                              />
                            </Tooltip>
                          </Flex>
                        </td>
                        <td>&#8377; {ad.totalAmount}</td>
                        <td>
                          <span className={ad.status === "Ongoing" ? styles.statusOngoing : styles.statusStopped}>
                            {ad.status === "Ongoing" ? "Started" : "Stopped"}
                          </span>
                        </td>
                        <td>{ad.endDate}</td>
                        <td>
                          <button
                            className={styles.redeemBtn}
                            onClick={() => handlenavigate(ad.id)}
                          >
                            {'Verify Now'}
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
                    total={adsVerifyData.length}
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

export default AdminAds