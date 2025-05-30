import React, { useState, useEffect, useRef } from "react";
import styles from "./AdsDistribution.module.css"
import SuperSidebar from "../../../components/SuperAdminSideBar/SuperSidebar"
import Header from "../../../components/Header/Header"
import { Button, Select } from 'antd'
import { DatePicker, Space } from 'antd';

const USERS_PER_LOAD = 20;

const users = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  fullName: `Full Name ${i + 1}`,
  status: i % 2 === 0 ? "Ongoing" : "Stopped",
  starDistribution: 5,
  totalStars: 50,
}));


function AdsDistribution() {
  const [visibleUsers, setVisibleUsers] = useState([]);
  const [loadedCount, setLoadedCount] = useState(1);
  const containerRef = useRef(null);

  useEffect(() => {
    setLoadedCount(1);
    setVisibleUsers(users.slice(0, USERS_PER_LOAD));
  }, []);

  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;
    const nearBottom =
      container.scrollTop + container.clientHeight >=
      container.scrollHeight - 20;
    if (nearBottom && loadedCount * USERS_PER_LOAD < users.length) {
      const nextCount = loadedCount + 1;
      const nextUsers = users.slice(0, nextCount * USERS_PER_LOAD);
      setVisibleUsers(nextUsers);
      setLoadedCount(nextCount);
    }
  };

  const onChange = (date, dateString) => {
    console.log(date, dateString);
  };

  return (
    <div className={styles.adsdistributionmain}>
      <div className={styles.adsdistributioncontainer}>
        <SuperSidebar />
        <Header />
        <div className={styles.adsdistributionsection}>
          <div style={{ width: '100%', maxWidth: '1550px', height: '600px', padding: '30px' }} className={styles.adsimage}>
            <div className={styles.adsdistributionhead}>
              <h1>Ads Distribution</h1>
              <Button>Log</Button>
            </div>
            <div className={styles.totalstar}>
              <div className={styles.adssectionone}>
                <h1>Total Stars</h1>
                <div className={styles.goldstar}><span style={{ color: 'gold' }}>★</span> 5000</div>
                <div className={styles.textpara}>
                  <p>Company account</p>
                  <p>+8% from yesterday</p>
                </div>
              </div>
              <div className={styles.adssectiontwo}>
                <Button>Ads Distribution</Button>
              </div>
            </div>
            <div className={styles.startable}>
              <div className={styles.startablehead}>
                <h1>Star Distribution</h1>
                <div className={styles.monthbutton}>
                  <Space direction="horizontal">
                    <DatePicker onChange={onChange} picker="month" />
                    <DatePicker onChange={onChange} picker="year" />
                  </Space>
                </div>
              </div>

              <div
                className={styles.container}
                ref={containerRef}
                onScroll={handleScroll}
              >
                <div className={styles.table}>
                  <div className={styles.tableHeader}>
                    <div>Users</div>
                    <div>Ads Status</div>
                    <div>Star Distribution</div>
                    <div>Total Stars</div>
                  </div>

                  {visibleUsers.map((user) => (
                    <div className={styles.tableRow} key={user.id}>
                      <div className={styles.userCell}>
                        <img
                          src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${user.name}`}
                          alt="avatar"
                          className={styles.avatar}
                        />
                        <div>
                          <strong>{user.name}</strong>
                          <p>{user.fullName}</p>
                        </div>
                      </div>
                      <div style={{ fontSize: '15px' }}><p>{user.status}</p></div>
                      <div><span style={{ color: 'gold' }}>★</span> {user.starDistribution}</div>
                      <div><span style={{ color: 'gold' }}>★</span> {user.totalStars}</div>
                    </div>
                  ))}

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  )
}

export default AdsDistribution