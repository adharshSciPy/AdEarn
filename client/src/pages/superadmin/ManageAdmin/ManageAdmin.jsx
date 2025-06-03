import React, { useState } from "react";
import styles from "./manageadmin.module.css";
import padam from "../../../assets/cardbackground.jpg";
import Header from "../../../components/Header/Header";
import SuperSidebar from "../../../components/SuperAdminSideBar/SuperSidebar"
import { Button } from "antd";
function ManageAdmin() {
  const [isEnabled, setIsEnabled] = useState(true);

  return (
    <div className={styles.admincontestcontainermain1}>
      <SuperSidebar />
      <Header />

      <div className={styles.manageadminwrapper}>
        <div className={styles.manageadminheader}>
          <div className={styles.manageadminheaderitem}>Admin</div>
          {/* <div className={styles.manageadminheaderitem}>Disable/Enable</div> */}
          <div className={styles.manageadminheaderitem}>Coupons Distributed</div>
          <div className={styles.manageadminheaderitem}>Ads Verified</div>
          <div className={styles.manageadminheaderitem}>Rejected Ads</div>
        </div>

        <div className={styles.manageadmindatarow}>
          <div className={styles.manageadmindataitem}>
            <img src={padam} alt="Admin" className={styles.manageadminadminphoto} />
            <p className={styles.manageadminadminname}>John Doe</p>
          </div>

          {/* <div className={styles.manageadmindataitem}>
            <label className={styles.manageadmintoggleswitch}>
              <input
                type="checkbox"
                checked={isEnabled}
                onChange={() => setIsEnabled(!isEnabled)}
              />
              <span className={styles.manageadmintoggleslider}></span>
            </label>
          </div> */}

          <div className={styles.manageadmindataitem}>
            <p>1234</p>
          </div>
          <div className={styles.manageadmindataitem}>
            <p>567</p>
          </div>
          <div className={styles.manageadmindataitem}>
            <p>89</p>
            <span className={styles.manageadmindeleteicon} title="Delete">
              🗑️
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageAdmin;
