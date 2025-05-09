import React from 'react'
import './AdminHome.css'
import Sidebar from '../../../components/sidebar/Sidebar'


function AdminHome() {
  return (
    <div className='adminmain'>
      <div className='admincontainermain'>
        <Sidebar />
        <div className="chart">
          <p>Home</p>
        </div>




      </div>
    </div>
  )
}

export default AdminHome