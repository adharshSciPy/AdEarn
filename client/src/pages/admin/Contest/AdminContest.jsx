import React from 'react'
import styles from "./AdminContest.module.css"
import Sidebar from '../../../components/sidebar/Sidebar'
import Header from '../../../components/Header/Header'
import { Button } from 'antd'
import Image from "../../../assets/cardBack.jpg"

function AdminContest() {
  return (
    <div className={styles.admincontestmain}>
      <div className={styles.admincontestcontainermain}>
        <Sidebar />
        <Header />
        <div className={styles.contest}>
          <div style={{ width: '100%', maxWidth: '1550px', height: '600px', padding: '30px' }} className={styles.kycimage}>
            <h1>Contest Winners</h1>
            <div className={styles.logbutton}>
              <Button>Log</Button>
            </div>
            <div className={styles.addbuttons}>
              <Button>Add</Button>
            </div>

            <div className={styles.contestone}>
              <div className={styles.contestheader}>
                <h3 className={styles.h3}>Contest 1</h3>
              </div>
              <div className={styles.contestwrapper}>
                <div className={styles.contestsection}>
                  <div className={styles.contestCardOne}>
                    <div className={styles.contestcard}>
                      <div className={styles.contestheader}>
                        <h3 className={styles.winners}>Winners</h3>
                      </div>
                      <img src={Image} />
                    </div>
                    <div className={styles.contestcard}>
                      <div className={styles.contestheader}>
                        <h3 className={styles.winners}>Winners</h3>
                      </div>
                      <img src={Image} />
                    </div>
                  </div>
                  <div className={styles.contestCardOne}>
                    <div className={styles.contestcard}>
                      <div className={styles.contestheader}>
                        <h3 className={styles.winners}>Winners</h3>
                      </div>
                      <img src={Image} />
                    </div>
                    <div className={styles.contestcard}>
                      <div className={styles.contestheader}>
                        <h3 className={styles.winners}>Winners</h3>
                      </div>
                      <img src={Image} />
                    </div>
                  </div>
                </div>

                <div className={styles.contestgraph}>
                  graph
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>




    </div>
  )
}

export default AdminContest