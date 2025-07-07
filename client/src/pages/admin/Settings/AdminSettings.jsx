import React, { useState } from "react";
import styles from "./AdminSettings.module.css";
import Sidebar from "../../../components/sidebar/Sidebar";
import Header from "../../../components/Header/Header";
import { Button, Tabs } from "antd";
import { Upload } from "antd";
import { Input } from "antd";
import { useSelector } from "react-redux";
import axios from "axios";
import baseUrl from "../../../baseurl";

const { Dragger } = Upload;

function AdminSettings() {
  const adminId = useSelector((state) => state.admin.id);

  const [formData, setFormData] = useState({
    adminEmail: "",
    username: "",
    lastName: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.patch(
        `${baseUrl}/api/v1/admin/admin-edit/${adminId}`,
        formData
      );

      if (response.status === 200) {
        setFormData({ adminEmail: "", username: "", lastName: "" });
      }
    } catch (error) {
      console.error("Submission failed", error);
    }
  };

  const items = [
    {
      key: "1",
      label: "My Details",
      children: (
        <form className={styles.form}>
          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label>First name</label>
              <Input
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Killan"
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Last name</label>
              <Input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="James"
              />
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label>Email</label>
            <Input
              name="adminEmail"
              type="email"
              value={formData.adminEmail}
              onChange={handleChange}
              placeholder="killanjames@gmail.com"
            />
          </div>
        </form>
      ),
    },
    // other tab items...
  ];

  return (
    <div className={styles.adminmain}>
      <div className={styles.adminsettingscontainermain}>
        <Sidebar />
        <Header />
        <div className={styles.settings}>
          <div className={styles.settingimg}>
            <h1>Settings</h1>
            <div className={styles.head}>
              <div className={styles.headdesign}></div>
              <div className={styles.profileimg}></div>
            </div>
            <div className={styles.actionbuttons}>
              {/* <Button>Cancel</Button> */}
              <Button
                style={{ backgroundColor: "#693bb8", color: "white" }}
                onClick={handleSubmit}
              >
                Save
              </Button>
            </div>
            <div className={styles.tabs}>
              <Tabs defaultActiveKey="1" items={items} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminSettings;
