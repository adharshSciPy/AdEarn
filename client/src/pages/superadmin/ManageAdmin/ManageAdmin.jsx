import React, { useState, useEffect } from "react";
import styles from "./manageadmin.module.css";
import padam from "../../../assets/cardbackground.jpg";
import Header from "../../../components/Header/Header";
import SuperSidebar from "../../../components/SuperAdminSideBar/SuperSidebar"
import axios from "axios";
import baseUrl from "../../../baseurl";
import { Button, Modal } from 'antd';

function ManageAdmin() {
  const [isEnabled, setIsEnabled] = useState(true);
  const [getAdmins, setGetAdmins] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAdminId, setSelectedAdminId] = useState(null);


  const showModal = (id) => {
    setSelectedAdminId(id); // save selected admin's id
    setIsModalOpen(true);
  };


  const handleOk = () => {
    setIsModalOpen(false);
    if (selectedAdminId) {
      handleDelete(selectedAdminId);
    }
  };


  const handleCancel = () => {
    setIsModalOpen(false);
  };


  useEffect(() => {
    const allAdmins = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/v1/admin/getallAdmins`);
        console.log("res admin", response.data.data)
        setGetAdmins(response.data.data)
      } catch (error) {
        console.log(error)
      }
    }

    allAdmins()
  }, [])

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0');       // 2-digit day
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const handleDelete = async (id) => {
    try {
      const deletedadmin = await axios.delete(`${baseUrl}/api/v1/admin/deleteAdmin/${id}`)
      console.log("delete", deletedadmin)
      setGetAdmins((prevAdmins) => prevAdmins.filter((admin) => admin._id !== id));
    } catch (error) {
      console.log(error)
    }
  }



  return (
    <div className={styles.admincontestcontainermain1}>
      <SuperSidebar />
      <Header />

      <div className={styles.manageadminwrapper}>
        <div className={styles.manageadminheader}>
          <div className={styles.manageadminheaderitem}>Admin</div>
          <div className={styles.manageadminheaderitem}>Email</div>
          <div className={styles.manageadminheaderitem}>Phone</div>
          <div className={styles.manageadminheaderitem}>Date</div>
          <div className={styles.manageadminheaderitem}>Action</div>

        </div>

        {getAdmins.map((admin) => (
          <div key={admin._id} className={styles.manageadmindatarow}>

            <div className={styles.manageadmindataitem}>
              <p className={styles.manageadminadminname}>{admin.username}</p>
            </div>

            <div className={styles.manageadmindataitem}>
              <p>{admin.adminEmail}</p>
            </div>
            <div className={styles.manageadmindataitem}>
              <p>{admin.phoneNumber}</p>
            </div>
            <div className={styles.manageadmindataitem}>
              <p>{formatDate(admin.createdAt)}</p>
            </div>

            <div className={styles.manageadmindataitem}>
              <span className={styles.manageadmindeleteicon} title="Delete" onClick={() => showModal(admin._id)}>
                🗑️
              </span>
            </div>
          </div>
        ))}
      </div>
      <Modal
        title="Basic Modal"
        closable={{ 'aria-label': 'Custom Close Button' }}
        open={isModalOpen}
        onOk={handleOk}
        okText="Delete"
        onCancel={handleCancel}
      >
        <p>Are you sure you want to delete this admin?</p>
      </Modal>
    </div>
  );
}

export default ManageAdmin;
