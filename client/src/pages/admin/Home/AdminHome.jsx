import React from 'react'
import styles from './adminhome.module.css'
import Sidebar from '../../../components/sidebar/Sidebar'
import Header from '../../../components/Header/Header'


function AdminHome() {
  return (
    <div className={styles.adminmain}>
      <div className={styles.admincontainermain}>
        <Sidebar />
        <Header />
        <div className={styles.chart}>
          <p>Home</p>
        </div>


      </div>
    </div>
  )
}

export default AdminHome