import React from 'react'
import './AdminCoupon.css'
import Sidebar from '../../../components/sidebar/Sidebar'

function AdminCoupon() {
  return (
    <div className='couponmain'>
      <div className='couponcontainermain'>
        <Sidebar />
        <div className="coupon">
          <p>Coupons</p>
        </div>




      </div>
    </div>
  )
}

export default AdminCoupon