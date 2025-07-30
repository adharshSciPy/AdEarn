import React, { useState, useEffect, useRef } from "react";
import styles from "./superadsuser.module.css";
import { Modal, Switch, Pagination, Button, Input } from "antd";
import { DeleteOutlined, HolderOutlined, EyeOutlined } from "@ant-design/icons";
import SuperSidebar from "../../../components/SuperAdminSideBar/SuperSidebar";
import Header from '../../../components/Header/Header'
import baseUrl from "../../../baseurl"
import axios from 'axios'

function SuperAdminAdsUser() {

  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [userStars, setUserStars] = useState({});
  const [getuserid, setGetuserid] = useState({})


  const [activeTab, setActiveTab] = useState("All Users");
  const [visibleUsers, setVisibleUsers] = useState([]);
  const containerRef = useRef(null);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [userToDelete, setUserToDelete] = useState();

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userId, setUserId] = useState("")

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const showViewModal = async (userId) => {
    console.log("idid", userId)
    setViewModalOpen(true);
    try {
      const getuserid = await axios.get(`${baseUrl}/api/v1/user/by-uniqueid?id=${userId}`);
      console.log("vada", getuserid)
    } catch (error) {
      console.log(error)
    }
  };

  const handleViewCancel = () => {
    setViewModalOpen(false);
  };


  const [form, setForm] = useState({
    superadminGiven: "",
  })

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }))
    console.log(form)
  }

  const modalCancel = () => {
    setIsModalOpen(false);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const submitStarForm = async () => {
    try {
      const response = await axios.post(`${baseUrl}/api/v1/super-admin/user/distribute-stars`, {
        userId,
        starCount: Number(form.superadminGiven)
      });

      const updatedStars = { ...userStars };
      updatedStars[userId] = (userStars[userId] || 0) + Number(form.superadminGiven);
      setUserStars(updatedStars);

      // Reset form and close modal
      setForm({ superadminGiven: "" });
      setIsModalOpen(false);

      console.log(response.data.message);
    } catch (error) {
      console.error("Failed to distribute stars:", error);
    }
  };


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get(`${baseUrl}/api/v1/admin/all-users`);
        const users = data.users || [];
        setAllUsers(users);
        console.log("users", data)

        // After fetching users, fetch stars for each user:
        const starsData = {};
        await Promise.all(
          users.map(async (user) => {
            const userid = user._id;
            try {
              const walletres = await axios.get(`${baseUrl}/api/v1/user/user-wallet/${userid}`);
              console.log("wal", walletres.data.wallet.totalStars)
              starsData[userid] = walletres.data.wallet.totalStars || 0;
            } catch (err) {
              starsData[userid] = 0; // fallback
            }
          })
        );
        setUserStars(starsData);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, []);


  useEffect(() => {
    setCurrentPage(1);
    let users = [...allUsers];

    if (activeTab === "Ads Users") {
      users = users.filter(user => Array.isArray(user.ads) && user.ads.length > 0);
    } else if (activeTab === "Disabled Users") {
      users = users.filter(user => user.isUserEnabled === false);
    }

    setFilteredUsers(users);
    // setVisibleUsers(users.slice(0, USERS_PER_LOAD));
  }, [activeTab, allUsers]);

  useEffect(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    setVisibleUsers(filteredUsers.slice(startIndex, endIndex));

  }, [currentPage, filteredUsers]);

  const showActivateModal = (user) => {
    setSelectedUser(user);
    setIsModalVisible(true);

  };

  const handleActivate = async () => {
    // Replace this with backend update if needed
    console.log("Activated:", selectedUser);
    setIsModalVisible(false);
    try {
      const userId = selectedUser._id;

      const response = await axios.post(`${baseUrl}/api/v1/super-admin/toggle-user-status`, {
        id: userId
      });

      const updatedUser = response.data.user;

      // Update state
      const updatedUsers = allUsers.map((u) =>
        u._id === userId ? { ...u, isUserEnabled: updatedUser.isUserEnabled } : u
      );

      setAllUsers(updatedUsers);
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error activating user", error);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleToggleUserStatus = async (user) => {
    try {
      const userId = user._id
      const response = await axios.post(`${baseUrl}/api/v1/super-admin/toggle-user-status`, {
        id: userId,
      });

      const updatedUser = response.data.user;

      // Update local state with new user status
      const updatedUsers = allUsers.map((u) =>
        u._id === userId ? { ...u, isUserEnabled: updatedUser.isUserEnabled } : u
      );

      setAllUsers(updatedUsers);

      // Optional: show toast notification
      // message.success(response.data.message);

    } catch (error) {
      console.error("Error updating user status", error);
      // message.error("Failed to update user status");
    }
  };


  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setIsDeleteModalVisible(true);
  };

  const handleDelete = async () => {
    try {

      const userId = userToDelete
      console.log("idzaaid", userId)
      const response = await axios.delete(`${baseUrl}/api/v1/super-admin/delete-user`, {
        data: { id: userId }
      })
      console.log(response);

      const updatedUsers = allUsers.filter((u) => u._id !== userId);
      setAllUsers(updatedUsers);
      setIsDeleteModalVisible(false);
    } catch (error) {
      console.log("Error while delete", error)
    }
  }

  const cancelDelete = () => {
    setIsDeleteModalVisible(false);
  };

  function formatDate(dateString) {
    const date = new Date(dateString);
    if (isNaN(date)) return 'Invalid Date';

    const day = date.getDate().toString().padStart(2, '0');     // 01–31
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 01–12
    const year = date.getFullYear();                            // 2025

    return `${day}/${month}/${year}`;
  }



  return (
    <div className={styles.adsuser}>
      <SuperSidebar />
      <Header />
      <div
        className={styles.container}
        ref={containerRef}
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

        {/* <div className={styles.monthYear}>
          <select>
            <option>Month</option>
          </select>
          <select>
            <option>Year</option>
          </select>
        </div> */}

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
            <div>Users</div>
            <div>Date</div>
            <div>Ads Viewed</div>
            <div>Black listed</div>
            <div>Action</div>
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
                  <strong>{user.firstName}</strong>
                  <p>{user.lastName}</p>
                </div>
              </div>
              <div>{formatDate(user.createdAt)}</div>
              <div>{user.viewedAds.length}</div>
              <div
                className={user.isUserEnabled ? styles.listed : styles.notListed}
              >
                {user.isUserEnabled ? "Enable" : "Disable"}
              </div>
              <div className={styles.actions}>
                {activeTab === "Disabled Users" ? (
                  <button
                    className={styles.activateBtn}
                    onClick={() => showActivateModal(user)}
                  >
                    Activate
                  </button>
                ) : (
                  <>
                    <Switch size="small"
                      checked={!user.isUserEnabled}
                      onChange={() => handleToggleUserStatus(user)}
                      defaultChecked />
                    <DeleteOutlined className={styles.deleteIcon}
                      onClick={() => handleDeleteClick(user._id)} />
                    <Button onClick={() => {
                      setUserId(user._id);
                      setIsModalOpen(true);
                    }}>Add Stars</Button>
                    <Button onClick={() => showViewModal(user.uniqueUserId)}><EyeOutlined /></Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        <Pagination
          current={currentPage}
          total={filteredUsers.length}
          pageSize={pageSize}
          showSizeChanger
          pageSizeOptions={['10', '20', '50', '100']}
          onChange={handlePageChange}
          onShowSizeChange={(current, size) => {
            setPageSize(size);
            setCurrentPage(1);
            const startIndex = 0;
            const endIndex = size;
            setVisibleUsers(filteredUsers.slice(startIndex, endIndex));
          }}
          className={styles.pagination}
        />




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
        <Modal
          title="Confirm Deletion"
          open={isDeleteModalVisible}
          onOk={handleDelete}
          onCancel={cancelDelete}
          okText="Yes, Delete"
          cancelText="Cancel"
        >
          <p>
            Are you sure you want to delete{" "}
            <strong>{userToDelete?.firstName} {userToDelete?.lastName}</strong>?
          </p>
        </Modal>

        <Modal
          title="Add Stars to User"
          closable={{ 'aria-label': 'Custom Close Button' }}
          open={isModalOpen}
          onOk={submitStarForm}
          onCancel={modalCancel}
          okText="Submit"
        >
          <div className={styles.addstarsform}>
            <Input type="text" name="superadminGiven" value={form.superadminGiven} placeholder="Enter Star Count" onChange={onChangeHandler} />
          </div>
        </Modal>

        <Modal
          title="Basic View Modal"
          closable={{ 'aria-label': 'Custom Close Button' }}
          open={viewModalOpen}
          onCancel={handleViewCancel}
        >
          <p>User Details Modal..</p>
        </Modal>

      </div>
    </div>
  );
}

export default SuperAdminAdsUser;
