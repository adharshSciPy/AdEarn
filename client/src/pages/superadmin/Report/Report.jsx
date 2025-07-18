import React, { useState, useEffect, useRef } from "react";
import styles from "./report.module.css";
import { Modal, Pagination } from "antd";
import { HolderOutlined } from "@ant-design/icons";
import SuperSidebar from "../../../components/SuperAdminSideBar/SuperSidebar";
import Header from '../../../components/Header/Header';
import axios from "axios";
import baseUrl from "../../../baseurl";
import * as XLSX from "xlsx";


function Report() {
  const [activeTab, setActiveTab] = useState("All Users");
  const [allUsers, setAllUsers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const containerRef = useRef(null);

  const handleDownload = () => {
    const filtered = getFilteredUsers();

    const exportData = filtered.map((user) => ({
      "First Name": user.firstName,
      "Last Name": user.lastName,
      "Email": user.email,
      "Referral Credits": user.referalCredits,
      "Unique ID": user.uniqueUserId,
      "Ads Viewed": user.viewedAds?.length || 0,
      "Ads Count": user.ads?.length || 0,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, activeTab);

    const fileName = `${activeTab.replace(" ", "_")}_Users.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };


  // Fetch users once
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/v1/admin/all-users`, {
          params: {
            page: currentPage,
            limit: pageSize,
          }
        });
        console.log("Fetched users:", response.data.users);
        setAllUsers(response.data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [currentPage, pageSize]);

  // Filter users based on active tab
  const getFilteredUsers = () => {
    if (activeTab === "Ads Users") {
      return allUsers.filter((user) => user.ads && user.ads.length > 0);
    }
    return allUsers;
  };

  const showActivateModal = (user) => {
    setSelectedUser(user);
    setIsModalVisible(true);
  };

  const handleActivate = () => {
    console.log("Activated:", selectedUser);
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className={styles.adsuser}>
      <SuperSidebar />
      <Header />
      <div className={styles.container} ref={containerRef}>
        {/* Top Greeting */}
        <div className={styles.header}>
          <div>
            <p style={{ fontSize: "20px", fontWeight: "500", paddingBottom: "5px" }}>
              Welcome back Super Admin!
            </p>
            <p style={{ fontSize: "17px", fontWeight: "500", paddingBottom: "5px" }}>
              Check dashboard
            </p>
          </div>
          <div className={styles.filters}>
            <button className={styles.logout}>Log</button>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "end", marginBottom: "10px" }}>
          <button onClick={handleDownload} className={styles.downloadBtn}>
            Download {activeTab}
          </button>
        </div>


        <h1 className={styles.title}>All Users</h1>

        {/* Static Dropdowns (can be dynamic later) */}
        <div className={styles.monthYear}>
          <select>
            <option>Month</option>
          </select>
          <select>
            <option>Year</option>
          </select>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          {["All Users", "Ads Users"].map((tab) => (
            <div
              key={tab}
              className={`${styles.tabButton} ${activeTab === tab ? styles.activeTab : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              <HolderOutlined />
              <button className={styles.tab}>{tab}</button>
            </div>
          ))}
        </div>

        {/* Table Header */}
        <div className={styles.table}>
          <div className={styles.tableHeader}>
            <div>Users</div>
            <div>Referral Credits</div>
            <div>Unique Id</div>
            <div>Ads Viewed</div>
            <div>Ads Count</div>
          </div>

          {/* Render Users */}
          {getFilteredUsers().slice((currentPage - 1) * pageSize, currentPage * pageSize).map((user) => (
            <div className={styles.tableRow} key={user._id}>
              <div className={styles.userCell}>
                <img
                  src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${user.firstName}`}
                  alt="avatar"
                  className={styles.avatar}
                />
                <div>
                  <strong>{user.firstName}{" "}{user.lastName}</strong>
                  <p>{user.email}</p>
                </div>
              </div>
              <div>
                <p>{user.referalCredits}</p>
              </div>
              <div>{user.uniqueUserId}</div>
              <div>{user.viewedAds?.length || 0}</div>
              <div>{user.ads?.length}</div>

            </div>
          ))}
        </div>

        {/* Modal (optional, currently just shows a placeholder) */}
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
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          showSizeChanger
          pageSizeOptions={['10', '20', '50', '100']}
          onChange={(page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          }}
          style={{ marginTop: "20px", textAlign: "right", display: "flex", justifyContent: "end", alignItems: "end" }}
        />
      </div>
    </div>
  );
}

export default Report;
