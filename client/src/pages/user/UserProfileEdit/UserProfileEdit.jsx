import React from "react";
import styles from './UserEdit.module.css';

function UserProfileEdit() {
  return (
    <div className={styles.profileWrapper}>
      <h2 className={styles.title}>Profile</h2>
      <div className={styles.profileCard}>
        <div className={styles.leftPanel}>
          <div className={styles.userInfo}>
            <img
              src="/avatar.png"
              alt="User Avatar"
              className={styles.avatar}
            />
            <div>
              <h3 className={styles.username}>Alexa Rowles</h3>
              <span className={styles.userRole}>Marketing Executive</span>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Full Name</label>
            <input type="text" placeholder="Your Full Name" />
            <label>Mobile</label>
            <input type="text" placeholder="Your Mobile Number" />
            <label>Language</label>
            <input type="text" placeholder="Your Language" />
            <button className={styles.kycBtn}>Verify Now</button>
          </div>

          <div className={styles.emailSection}>
            <p>My email address</p>
            <p className={styles.email}>alexarowles@gmail.com</p>
            <a href="#">Link New Email</a>
          </div>
        </div>

        <div className={styles.rightPanel}>
          <div className={styles.editTop}>
            <span>Basic Details</span>
            <button className={styles.editBtn}>Edit</button>
          </div>
          <div className={styles.formGroup}>
            <label>Country</label>
            <input type="text" placeholder="Your Country" />
            <label>State</label>
            <input type="text" placeholder="Your State" />
            <label>Time Zone</label>
            <input type="text" placeholder="Your Time Zone" />
          </div>
          <button className={styles.saveBtn}>Save</button>
        </div>
      </div>
    </div>
  );
}

export default UserProfileEdit;
