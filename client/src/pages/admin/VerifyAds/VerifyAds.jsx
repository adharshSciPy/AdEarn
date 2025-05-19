import React from 'react'
import styles from "./VerifyAds.module.css"
import Sidebar from '../../../components/sidebar/Sidebar'
import Header from '../../../components/Header/Header'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Button } from 'antd';

function VerifyAds() {
  return (
    <div className={styles.verifyadsmain}>
      <div className={styles.verifyadscontainer}>
        <Sidebar />
        <Header />
        <div className={styles.adscontainer}>
          <div style={{ width: '100%', maxWidth: '1550px', height: '600px', padding: '30px' }} className={styles.adsimage}>
            <h1>Ads Preview</h1>
            <div className={styles.adspreview}>
              <div className={styles.previewone}>
                <p>this is for img ads and video ads</p>
              </div>
              <div className={styles.previewtwo}>
                <div style={{
                  position: 'relative',
                  width: 200,
                  height: 200,
                }}>
                  <CircularProgressbar
                    value={75}
                    styles={buildStyles({
                      pathColor: '#fff',
                      trailColor: 'rgba(255, 255, 255, 0.2)',
                      textColor: '#fff',
                    })}
                  />

                  {/* Centered Custom Text */}
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center',
                    color: 'white',
                    pointerEvents: 'none',
                  }}>
                    <div style={{ fontSize: 16, fontWeight: 400 }}>Meyers Briggs</div>
                    <div style={{ fontSize: 32, fontWeight: 'bold' }}>INTJ</div>
                  </div>
                </div>

                <div className={styles.adsitems}>
                  <div className={styles.listitems}>
                    <div><p>Ads</p></div>
                    <div><p>0%</p></div>
                  </div>
                  <div className={styles.listitems}>
                    <div><p>Total Views</p></div>
                    <div><p>0%</p></div>
                  </div>
                  <div className={styles.listitems}>
                    <div><p>Total Amount</p></div>
                    <div><p>100</p></div>
                  </div>
                  <div className={styles.listitems}>
                    <div><p>Ads Status</p></div>
                    <div><p>Not Started</p></div>
                  </div>
                  <div className={styles.listitems}>
                    <div><p>Start Date</p></div>
                    <div><p>02/05/2025</p></div>
                  </div>
                  <div className={styles.listitems}>
                    <div><p>End Date</p></div>
                    <div><p>02/05/2025</p></div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.adsdatamain}>
              <div className={styles.adsname}>
                <div className={styles.adsnametext}>
                  <div><h1>Ads Name</h1></div>
                  <div><p>Lorem ipsum dolor sit amet consectetur adipisicing elit. A at iure suscipit voluptatum totam consequatur sit doloribus alias non quidem iusto illum provident.</p></div>
                </div>
                <div className={styles.adsnametext}>
                  <div><h1>Ads Description</h1></div>
                  <div>
                    <p>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit. A at iure suscipit voluptatum totam consequatur sit doloribus alias non quidem iusto illum provident.
                      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos esse culpa assumenda dolorem earum porro laborum eligendi neque modi inventore voluptatem, minus suscipit dolore laboriosam voluptas, cumque hic eveniet accusamus?
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.approvalbuttons}>
              <Button style={{ backgroundColor: '#5d32b9', color: 'white' }}>Reject</Button>
              <Button style={{ color: '#5d32b9' }}>Approve</Button>
            </div>

          </div>

        </div>

      </div>
    </div>
  )
}

export default VerifyAds