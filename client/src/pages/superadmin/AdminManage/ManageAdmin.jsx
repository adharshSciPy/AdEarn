import React from "react";
import styles from "./ManageAdmin.module.css"
import SuperSidebar from "../../../components/SuperAdminSideBar/SuperSidebar";

function ManageAdmin() {
  return (
    <div className={styles.UserAccount}>
      <SuperSidebar />
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h2>Coupon Generation</h2>
        </div>
      </div>
    </div>
  );
}

export default ManageAdmin;
