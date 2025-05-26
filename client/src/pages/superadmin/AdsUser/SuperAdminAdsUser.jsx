import React from "react";
import styles from "./superadsuser.module.css";
import { Switch } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import SuperSidebar from "../../../components/SuperAdminSideBar/SuperSidebar"
const users = [
  {
    id: 1,
    name: "User 1",
    fullName: "Jason Roy",
    lastSeen: "9.45 am",
    stars: 100,
    adsViewed: 10,
    blacklisted: true,
  },
  {
    id: 2,
    name: "User 2",
    fullName: "Mathew Flintoff",
    lastSeen: "2 days ago",
    stars: 200,
    adsViewed: 10,
    blacklisted: false,
  },
  {
    id: 3,
    name: "User 3",
    fullName: "Anil Kumar",
    lastSeen: "9.45 am",
    stars: 200,
    adsViewed: 10,
    blacklisted: false,
  },
  {
    id: 4,
    name: "User 4",
    fullName: "George Cruize",
    lastSeen: "1 days ago",
    stars: 200,
    adsViewed: 10,
    blacklisted: true,
  },
  {
    id: 5,
    name: "User 4",
    fullName: "George Cruize",
    lastSeen: "9.00 am",
    stars: 200,
    adsViewed: 10,
    blacklisted: false,
  },
];

function SuperAdminAdsUser() {
  return (
    <div className={styles.adsuser}>
        <SuperSidebar/>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h2>Welcome back Super Admin!</h2>
            <p>Check dashboard</p>
          </div>
          <div className={styles.filters}>
            {/* <select>
              <option>Month</option>
            </select>
            <select>
              <option>Year</option>
            </select> */}
            <button className={styles.logout}>Log</button>
          </div>
        </div>

        <h1 className={styles.title}>Ads Users</h1>

        <div className={styles.tabs}>
          <button className={styles.tab}>All Users</button>
          <button className={styles.tab}>Ads Users</button>
          <button className={styles.tab}>Disabled Users</button>
        </div>

        <div className={styles.table}>
          <div className={styles.tableHeader}>
            <div>Users</div>
            <div>Last seen</div>
            <div>Total stars</div>
            <div>Ads Viewed</div>
            <div>Black listed</div>
            <div>Disable & Enable</div>
          </div>
          {users.map((user, idx) => (
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
              <div className={styles.actions}>
                <Switch size="small" defaultChecked />
                <DeleteOutlined className={styles.deleteIcon} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SuperAdminAdsUser;
