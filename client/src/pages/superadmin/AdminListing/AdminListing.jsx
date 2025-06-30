import React, { useEffect, useState } from "react";
import styles from "./AdminListing.module.css";
import axios from "axios";
import baseUrl from "../../../baseurl";
import SuperSidebar from "../../../components/SuperAdminSideBar/SuperSidebar";
import { Tabs, Select } from "antd";

const { TabPane } = Tabs;

function AdminListing() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);

  const fetchAdmins = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/super-admin/all-admins`
      );
      setAdmins(response.data.data);
    } catch (error) {
      console.error("Failed to fetch admins:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  return (
    <div className={styles.container}>
      <SuperSidebar />
      <div className={styles.subContainer}>
        <h2 className={styles.mainHead}>All Admins</h2>

        <div className={styles.adminList}>
          {loading ? (
            <p>Loading admins...</p>
          ) : selectedAdmin ? (
            <div className={styles.details}>
              <h3>{selectedAdmin.adminEmail}'s Activity</h3>

              <div className={styles.filterRow}>
                <Select
                  placeholder="Select Month"
                  className={styles.selectBox}
                  onChange={(value) => setSelectedMonth(value)}
                  allowClear
                  options={[
                    { value: "01", label: "January" },
                    { value: "02", label: "February" },
                    { value: "03", label: "March" },
                    { value: "04", label: "April" },
                    { value: "05", label: "May" },
                    { value: "06", label: "June" },
                    { value: "07", label: "July" },
                    { value: "08", label: "August" },
                    { value: "09", label: "September" },
                    { value: "10", label: "October" },
                    { value: "11", label: "November" },
                    { value: "12", label: "December" },
                  ]}
                />
                <Select
                  placeholder="Select Year"
                  className={styles.selectBox}
                  onChange={(value) => setSelectedYear(value)}
                  allowClear
                  options={Array.from({ length: 5 }, (_, i) => {
                    const y = new Date().getFullYear() - i;
                    return { value: y.toString(), label: y.toString() };
                  })}
                />
              </div>

              <Tabs defaultActiveKey="1" className={styles.tabSection}>
                <TabPane tab="Ads Verified" key="1">
                  <p>
                    Ads verified by {selectedAdmin.name} in{" "}
                    {selectedMonth || "All Months"}/{selectedYear || "All Years"}
                  </p>
                  {/* Replace with filtered API call or data */}
                </TabPane>
                <TabPane tab="Ads Rejected" key="2">
                  <p>
                    Ads rejected by {selectedAdmin.name} in{" "}
                    {selectedMonth || "All Months"}/{selectedYear || "All Years"}
                  </p>
                </TabPane>
                <TabPane tab="KYC Accepted" key="3">
                  <p>
                    KYC accepted by {selectedAdmin.name} in{" "}
                    {selectedMonth || "All Months"}/{selectedYear || "All Years"}
                  </p>
                </TabPane>
                <TabPane tab="KYC Rejected" key="4">
                  <p>
                    KYC rejected by {selectedAdmin.name} in{" "}
                    {selectedMonth || "All Months"}/{selectedYear || "All Years"}
                  </p>
                </TabPane>
              </Tabs>

              <div className={styles.backButton}>
                <button onClick={() => setSelectedAdmin(null)}>
                  Back to List
                </button>
              </div>
            </div>
          ) : (
            <ul className={styles.list}>
              {admins.map((admin) => (
                <li
                  key={admin.id}
                  className={styles.adminItem}
                  onClick={() => setSelectedAdmin(admin)}
                >
                  <strong>{admin.name}</strong>
                  <p>{admin.adminEmail}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminListing;
