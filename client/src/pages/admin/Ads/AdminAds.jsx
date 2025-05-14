import React from 'react'
import Sidebar from '../../../components/sidebar/Sidebar'
import Header from '../../../components/Header/Header';
import styles from "./AdminAds.module.css"
import { Tabs } from 'antd';

function AdminAds() {

  const onChange = key => {
    console.log(key);
  };

  const items = [
    {
      key: '1',
      label: 'Tab 1',
      children: 'Content of Tab Pane 1',

    },
    {
      key: '2',
      label: 'Tab 2',
      children: 'Content of Tab Pane 2',
    }
  ];

  return (
    <div className={styles.adminadsmain}>
      <div className={styles.adminadscontainermain}>
        <Sidebar />
        <Header />
        <div className={styles.Adminads}>
          <div style={{ width: '100%', maxWidth: '1550px', height: '600px', padding: '30px' }} className={styles.AdsSection}>
            <Tabs className={styles.customtabs}
              defaultActiveKey="1" items={items} onChange={onChange}
            />
          </div>
        </div>




      </div>
    </div>
  )
}

export default AdminAds