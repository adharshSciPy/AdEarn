import React, { useState } from 'react'
import Sidebar from '../../../components/sidebar/Sidebar'
import Header from '../../../components/Header/Header';
import styles from "./AdminAds.module.css"
import { Button, Flex, Progress, Tooltip } from 'antd';
import { useNavigate } from 'react-router-dom';


function AdminAds() {

  const navigate = useNavigate()

  const handlenavigate = () => {
    navigate("/VerifyAds")
  }

  const [activeTab, setActiveTab] = useState("Ads");

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  const tabs = [
    "Ads",
    "Verify Ads"
  ];


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
                    <tr>
                      <td>Ads 1<br />
                        Approved</td>
                      <Flex gap="small" vertical style={{ marginTop: "20px" }}>
                        <Tooltip title="500 out of 800 views">
                          <Progress percent={100} success={{ percent: 60, strokeColor: '#FCB859' }} strokeWidth={5} strokeColor="#2B2B36" showInfo={false} />
                        </Tooltip>
                      </Flex>
                      <td>&#8377; 500</td>
                      <td>02/06/025</td>
                      <td>05/06/025</td>
                      <td><span className={styles.statusOngoing}>Ongoing</span></td>
                    </tr>
                    <tr>
                      <td>Ads 1<br />
                        Approved</td>
                      <Flex gap="small" vertical style={{ marginTop: "20px" }}>
                        <Tooltip title="200 out of 800 views">
                          <Progress percent={100} success={{ percent: 20, strokeColor: '#FCB859' }} strokeWidth={5} strokeColor="#2B2B36" showInfo={false} />
                        </Tooltip>
                      </Flex>
                      <td>&#8377; 500</td>
                      <td>02/06/025</td>
                      <td>05/06/025</td>
                      <td><span className={styles.statusStopped}>Stopped</span></td>
                    </tr>
                    <tr>
                      <td>Ads 1<br />
                        Approved</td>
                      <Flex gap="small" vertical style={{ marginTop: "20px" }}>
                        <Tooltip title="650 out of 800 views">
                          <Progress percent={100} success={{ percent: 80, strokeColor: '#FCB859' }} strokeWidth={5} strokeColor="#2B2B36" showInfo={false} />
                        </Tooltip>
                      </Flex>
                      <td>&#8377; 500</td>
                      <td>02/06/025</td>
                      <td>05/06/025</td>
                      <td><span className={styles.statusOngoing}>Ongoing</span></td>
                    </tr>
                    <tr>
                      <td>Ads 1<br />
                        Approved</td>
                      <Flex gap="small" vertical style={{ marginTop: "20px" }}>
                        <Tooltip title="200 out of 800 views">
                          <Progress percent={100} success={{ percent: 20, strokeColor: '#FCB859' }} strokeWidth={5} strokeColor="#2B2B36" showInfo={false} />
                        </Tooltip>
                      </Flex>
                      <td>&#8377; 500</td>
                      <td>02/06/025</td>
                      <td>05/06/025</td>
                      <td><span className={styles.statusStopped}>Stopped</span></td>
                    </tr>
                    <tr>
                      <td>Ads 1<br />
                        Approved</td>
                      <Flex gap="small" vertical style={{ marginTop: "20px" }}>
                        <Tooltip title="600 out of 800 views">
                          <Progress percent={100} success={{ percent: 70, strokeColor: '#FCB859' }} strokeWidth={5} strokeColor="#2B2B36" showInfo={false} />
                        </Tooltip>
                      </Flex>
                      <td>&#8377; 500</td>
                      <td>02/06/025</td>
                      <td>05/06/025</td>
                      <td><span className={styles.statusOngoing}>Ongoing</span></td>
                    </tr>
                    <tr>
                      <td>Ads 1<br />
                        Approved</td>
                      <Flex gap="small" vertical style={{ marginTop: "20px" }}>
                        <Tooltip title="700 out of 800 views">
                          <Progress percent={100} success={{ percent: 90, strokeColor: '#FCB859' }} strokeWidth={5} strokeColor="#2B2B36" showInfo={false} />
                        </Tooltip>
                      </Flex>
                      <td>&#8377; 500</td>
                      <td>02/06/025</td>
                      <td>05/06/025</td>
                      <td><span className={styles.statusOngoing}>Ongoing</span></td>
                    </tr>
                  </tbody>
                </table>
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
                    <tr>
                      <td>03/04/2025</td>
                      <td>Ads 1<br />
                        Approved</td>
                      <Flex gap="small" vertical style={{ marginTop: "20px" }}>
                        <Tooltip title="300 out of 800 views">
                          <Progress percent={100} success={{ percent: 40, strokeColor: '#FCB859' }} strokeWidth={5} strokeColor="#2B2B36" showInfo={false} />
                        </Tooltip>
                      </Flex>
                      <td>&#8377; 500</td>
                      <td><span className={styles.statusOngoing}>Started</span></td>
                      <td>03/04/2025</td>
                      <td>
                        <button
                          className={styles.redeemBtn}
                          onClick={handlenavigate}
                        >
                          Verify Now
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td>03/04/2025</td>
                      <td>Ads 1<br />
                        Approved</td>
                      <Flex gap="small" vertical style={{ marginTop: "20px" }}>
                        <Tooltip title="600 out of 800 views">
                          <Progress percent={100} success={{ percent: 60, strokeColor: '#FCB859' }} strokeWidth={5} strokeColor="#2B2B36" showInfo={false} />
                        </Tooltip>
                      </Flex>
                      <td>&#8377; 500</td>
                      <td><span className={styles.statusStopped}>Not Started</span></td>
                      <td>03/04/2025</td>
                      <td>
                        <button
                          className={styles.redeemBtn}
                          onClick={handlenavigate}

                        >
                          Verify Now
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td>03/04/2025</td>
                      <td>Ads 1<br />
                        Approved</td>
                      <Flex gap="small" vertical style={{ marginTop: "20px" }}>
                        <Tooltip title="650 out of 800 views">
                          <Progress percent={100} success={{ percent: 80, strokeColor: '#FCB859' }} strokeWidth={5} strokeColor="#2B2B36" showInfo={false} />
                        </Tooltip>
                      </Flex>
                      <td>&#8377; 500</td>
                      <td><span className={styles.statusOngoing}>Started</span></td>
                      <td>03/04/2025</td>
                      <td>
                        <button
                          className={styles.redeemBtn}
                          onClick={handlenavigate}

                        >
                          Verify Now
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td>03/04/2025</td>
                      <td>Ads 1<br />
                        Approved</td>
                      <Flex gap="small" vertical style={{ marginTop: "20px" }}>
                        <Tooltip title="200 out of 800 views">
                          <Progress percent={100} success={{ percent: 30, strokeColor: '#FCB859' }} strokeWidth={5} strokeColor="#2B2B36" showInfo={false} />
                        </Tooltip>
                      </Flex>
                      <td>&#8377; 500</td>
                      <td><span className={styles.statusStopped}>Not Started</span></td>
                      <td>03/04/2025</td>
                      <td>
                        <button
                          className={styles.redeemBtn}
                          onClick={handlenavigate}

                        >
                          Verify Now
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td>03/04/2025</td>
                      <td>Ads 1<br />
                        Approved</td>
                      <Flex gap="small" vertical style={{ marginTop: "20px" }}>
                        <Tooltip title="400 out of 800 views">
                          <Progress percent={100} success={{ percent: 50, strokeColor: '#FCB859' }} strokeWidth={5} strokeColor="#2B2B36" showInfo={false} />
                        </Tooltip>
                      </Flex>
                      <td>&#8377; 500</td>
                      <td><span className={styles.statusOngoing}>Started</span></td>
                      <td>03/04/2025</td>
                      <td>
                        <button
                          className={styles.redeemBtn}
                          onClick={handlenavigate}

                        >
                          Verify Now
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td>03/04/2025</td>
                      <td>Ads 1<br />
                        Approved</td>
                      <Flex gap="small" vertical style={{ marginTop: "20px" }}>
                        <Tooltip title="650 out of 800 views">
                          <Progress percent={100} success={{ percent: 80, strokeColor: '#FCB859' }} strokeWidth={5} strokeColor="#2B2B36" showInfo={false} />
                        </Tooltip>
                      </Flex>
                      <td>&#8377; 500</td>
                      <td><span className={styles.statusOngoing}>Started</span></td>
                      <td>03/04/2025</td>
                      <td>
                        <button
                          className={styles.redeemBtn}
                          onClick={handlenavigate}

                        >
                          Verify Now
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </section>
            )}
          </div>
        </div>




      </div>
    </div>
  )
}

export default AdminAds