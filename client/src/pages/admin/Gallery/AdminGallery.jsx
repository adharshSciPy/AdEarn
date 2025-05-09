import React from 'react'
import './AdminGallery.css'
import Sidebar from '../../../components/sidebar/Sidebar'

function AdminGallery() {
  return (
    <div className='admingallerymain'>
      <div className='admingallerycontainermain'>
        <Sidebar />
        <div className="gallery">
          <p>Gallery</p>
        </div>




      </div>
    </div>
  )
}

export default AdminGallery