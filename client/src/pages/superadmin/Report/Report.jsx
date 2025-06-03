import React, { useState, useEffect, useRef } from "react";
import styles from "./report.module.css";
import { Modal, Switch } from "antd";
import { DeleteOutlined, HolderOutlined } from "@ant-design/icons";
import SuperSidebar from "../../../components/SuperAdminSideBar/SuperSidebar";
import Header from '../../../components/Header/Header'



const users = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  fullName: `Full Name ${i + 1}`,
  lastSeen: i % 3 === 0 ? "Today" : i % 3 === 1 ? "Yesterday" : "2 days ago",
  stars: 100 + i,
  adsViewed: i % 2 === 0 ? 10 : 0,
  blacklisted: i % 5 === 0,
}));

const USERS_PER_LOAD = 20;
function Report() {
    const [activeTab, setActiveTab] = useState("Ads Users");
      const [visibleUsers, setVisibleUsers] = useState([]);
      const [loadedCount, setLoadedCount] = useState(1);
      const containerRef = useRef(null);
    
      const [isModalVisible, setIsModalVisible] = useState(false);
      const [selectedUser, setSelectedUser] = useState(null);
    
      const filteredUsers = users.filter((user) => {
        if (activeTab === "Ads Users") return user.adsViewed > 0;
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
        setIsModalVisible(true);
      };
    
      const handleActivate = () => {
        // Replace this with backend update if needed
        console.log("Activated:", selectedUser);
        setIsModalVisible(false);
      };
    
      const handleCancel = () => {
        setIsModalVisible(false);
      };
    
  return (
   <div className={styles.adsuser}>
      <SuperSidebar />
      <Header/>
      <div
        className={styles.container}
        ref={containerRef}
        onScroll={handleScroll}
      >
        <div className={styles.header}>
          <div>
            <p
              style={{
                fontSize: "20px",
                fontWeight: "500",
                paddingBottom: "5px",
              }}
            >
              Welcome back Super Admin!
            </p>
            <p
              style={{
                fontSize: "17px",
                fontWeight: "500",
                paddingBottom: "5px",
              }}
            >
              Check dashboard
            </p>
          </div>
          <div className={styles.filters}>
            <button className={styles.logout}>Log</button>
          </div>
        </div>

        <h1 className={styles.title}>Ads Users</h1>

        <div className={styles.monthYear}>
          <select>
            <option>Month</option>
          </select>
          <select>
            <option>Year</option>
          </select>
        </div>

        <div className={styles.tabs}>
          {["Ads Users", "Disabled Users"].map((tab) => (
            <div
              key={tab}
              className={`${styles.tabButton} ${
                activeTab === tab ? styles.activeTab : ""
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
            <div>Users</div>
            <div>Last seen</div>
            <div>Total stars</div>
            <div>Ads Viewed</div>
            <div>Black listed</div>
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
              <div>{user.lastSeen}</div>
              <div>{user.stars}</div>
              <div>{user.adsViewed}</div>
              <div
                className={user.blacklisted ? styles.listed : styles.notListed}
              >
                {user.blacklisted ? "Listed" : "Not Listed"}
              </div>
              
            </div>
          ))}
        </div>

        <Modal
          title="Activate User"
          open={isModalVisible}
          onOk={handleActivate}
          onCancel={handleCancel}
          okText="Yes, Activate"
          cancelText="Cancel"
        >
          <p>
            Are you sure you want to activate{" "}
            <strong>{selectedUser?.fullName}</strong>?
          </p>
        </Modal>
      </div>
    </div>
  )
}

export default Report
