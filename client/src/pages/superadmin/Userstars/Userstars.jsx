import React, { useState, useEffect, useRef } from "react";
import { Modal, Switch } from "antd";
import styles from "./Userstars.module.css"
import SuperSidebar from "../../../components/SuperAdminSideBar/SuperSidebar"
import Header from "../../../components/Header/Header"
import { Button } from 'antd'
import { DeleteOutlined, HolderOutlined } from "@ant-design/icons";


const users = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  fullName: `Full Name ${i + 1}`,
  totalStars: '100',
  coupons: '5',
  viewAds: '5',
  referralCodes: '5',
  welcomeBonus: '5',
  ads: '5',
  blacklisted: i % 5 === 0,
}));

const USERS_PER_LOAD = 20;


function Userstars() {
  const [activeTab, setActiveTab] = useState("All Users");
  const [visibleUsers, setVisibleUsers] = useState([]);
  const [loadedCount, setLoadedCount] = useState(1);
  const containerRef = useRef(null);


  const [selectedUser, setSelectedUser] = useState(null);

  const filteredUsers = users.filter((user) => {
    if (activeTab === "Ads Users") return user.viewAds > 0;
    if (activeTab === "Disabled Users") return user.blacklisted;
    return true;
  });

  useEffect(() => {
    setLoadedCount(1);
    setVisibleUsers(filteredUsers.slice(0, USERS_PER_LOAD));
  }, [activeTab]);

  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;
    const nearBottom =
      container.scrollTop + container.clientHeight >=
      container.scrollHeight - 20;
    if (nearBottom && loadedCount * USERS_PER_LOAD < filteredUsers.length) {
      const nextCount = loadedCount + 1;
      const nextUsers = filteredUsers.slice(0, nextCount * USERS_PER_LOAD);
      setVisibleUsers(nextUsers);
      setLoadedCount(nextCount);
    }
  };

  const showActivateModal = (user) => {
    setSelectedUser(user);
  };


  return (
    <div className={styles.userstarsmain}>
      <div className={styles.userstarscontainer}>
        <SuperSidebar />
        <Header />
        <div className={styles.starssection}>
          <div style={{ width: '100%', maxWidth: '1550px', height: '600px', padding: '30px' }} className={styles.userstarimage}>
            <div className={styles.distributionhead}>
              <h1>Star Distribution</h1>
              <Button>Log</Button>
            </div>
            <div className={styles.totalstardistribution}>
              <h3>Total Stars</h3>
              <h3><span style={{ color: 'gold', fontSize: '24px' }}>★</span>20000</h3>
              <div className={styles.starpargraph}>
                <p>Company account</p>
                <p>+8% from yesterday</p>
              </div>
            </div>

            <div
              className={styles.container}
              ref={containerRef}
              onScroll={handleScroll}
            >

              <h1 className={styles.title}>{activeTab}</h1>

              <div className={styles.monthYear}>
                <select>
                  <option>Month</option>
                </select>
                <select>
                  <option>Year</option>
                </select>
              </div>

              <div className={styles.tabs}>
                {["All Users", "Ads Users", "Disabled Users"].map((tab) => (
                  <div
                    key={tab}
                    className={`${styles.tabButton} ${activeTab === tab ? styles.activeTab : ""
                      }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    <HolderOutlined />
                    <button className={styles.tab}>{tab}</button>
                  </div>
                ))}
              </div>

              <div className={styles.table}>
                <div className={styles.tableHeader}>
                  <div>Ads Users</div>
                  <div>Total stars</div>
                  <div>Coupons</div>
                  <div>View Ads</div>
                  <div>Referral codes</div>
                  <div>Welcome bonus</div>
                  <div>Ads</div>
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
                    <div><span style={{ color: 'gold' }}>★</span> {user.totalStars}</div>
                    <div><span style={{ color: 'gold' }}>★</span> {user.coupons}</div>
                    <div><span style={{ color: 'gold' }}>★</span> {user.viewAds}</div>
                    <div><span style={{ color: 'gold' }}>★</span> {user.referralCodes}</div>
                    <div><span style={{ color: 'gold' }}>★</span> {user.welcomeBonus}</div>
                    <div><span style={{ color: 'gold' }}>★</span> {user.ads}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div >
    </div >
  )
}

export default Userstars