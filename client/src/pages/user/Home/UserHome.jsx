import React from "react";
import styles from "./userhome.module.css";
import Sidebar from "../../../components/sidebar/Sidebar";

function UserHome() {
  return (
    <div>
      <div className={styles.mainContainer}>
        <div className={styles.homeMainContainer}>
            <Sidebar/>
            <div className={styles.homeContainer}
            
            ></div>
        </div>
      </div>
    </div>
  );
}

export default UserHome;
