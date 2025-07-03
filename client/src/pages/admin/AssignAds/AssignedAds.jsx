import React, { useState, useEffect } from 'react'
import styles from "./AssignedAds.module.css"
import Sidebar from '../../../components/sidebar/Sidebar'
import Header from '../../../components/Header/Header'
import { Button, Pagination } from 'antd';
import axios from 'axios';
import baseUrl from '../../../baseurl';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function AssignedAds() {

  const navigate = useNavigate()
  const adminId = useSelector((state) => state.admin.id)
  const [assignedAds, setAssignedAds] = useState([])

  const handlenavigate = (id) => {
    console.log("id vannu", id)
    navigate(`/VerifyAds/${id}`)
  }


  useEffect(() => {
    console.log("admin id store", adminId)
    const assignedkyc = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/v1/admin/assigned-ads/${adminId}`)
        setAssignedAds(response.data.ads)
        console.log("res res", response.data.ads)
      } catch (error) {
        console.log(error)
      }
    }
    assignedkyc()
  }, [])

  function formatDate(isoString) {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }


  return (
    <div className={styles.assignadsmain}>
      <div className={styles.assignadscontainermain}>
        <Sidebar />
        <Header />
        <div className={styles.assignads}>
          <div style={{ width: '100%', maxWidth: '1550px', height: '600px', padding: '30px' }} className={styles.AssignSection}>

            <section className={styles.payoutTableSection}>
              <h1 style={{ fontSize: "25px", padding: '10px' }}>Verify Ads</h1>
              <table className={styles.payoutTable}>
                <thead>
                  <tr>
                    <th>Ad Title</th>
                    <th>Description</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {assignedAds.map((ad) => {
                    // Determine which ad type is available
                    const adData = ad.imageAd || ad.videoAd || ad.surveyAd;

                    return (
                      <tr key={ad._id}>
                        <td>{adData?.title || "No title"}</td>
                        <td>{adData?.description || "N/A"}</td>
                        <td>{formatDate(adData?.createdAt)}</td>
                        <td>
                          <button
                            className={styles.redeemBtn}
                            onClick={() => handlenavigate(ad._id)}
                          >
                            Verify
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>

              </table>

            </section>
          </div>
        </div>
      </div>
    </div>



  )
}

export default AssignedAds