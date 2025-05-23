import React from 'react'
import styles from "./AdminContest.module.css"
import Sidebar from '../../../components/sidebar/Sidebar'
import Header from '../../../components/Header/Header'
import { Button } from 'antd'
import Image from "../../../assets/cardBack.jpg"
import RadarChart from "../../../components/Chart/Chart";



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
                  <div className={styles.graph}>
                    <RadarChart />
                  </div>

                  <div className={styles.winnerslist}>
                    <div className={styles.winnerspart}>
                      <h3 style={{ backgroundColor: "#693bb8", width: "max-content", padding: "5px", borderRadius: "5px", marginBottom: "10px" }}>Winners</h3>
                      <p>1st price winner: Gokul</p>
                      <p>2nd price winner: Adithya</p>
                      <p>3rd price winner: Sanju</p>
                      <p>4th price winner: Akshay</p>
                    </div>
                    <div className={styles.winnersprice}>
                      <h3 style={{ backgroundColor: "#693bb8", width: "max-content", padding: "5px", borderRadius: "5px", marginBottom: "10px" }}>Prices</h3>
                      <p>Iphones</p>
                      <p>Iphones</p>
                      <p>Iphones</p>
                      <p>Iphones</p>
                    </div>
                  </div>


                  <div className={styles.totalentries}>
                    <div className={styles.winnerspart}>
                      <h3 style={{ backgroundColor: "#693bb8", width: "max-content", padding: "5px", borderRadius: "5px", marginBottom: "10px" }}>Date</h3>
                      <p>20/05/2025</p>
                      <p>20/05/2025</p>
                      <p>20/05/2025</p>
                      <p>20/05/2025</p>
                    </div>
                    <div className={styles.winnersprice}>
                      <h3 style={{ backgroundColor: "#693bb8", width: "max-content", padding: "5px", borderRadius: "5px", marginBottom: "10px" }}>Total Entries</h3>
                      <p>1000</p>
                      <p>1000</p>
                      <p>1000</p>
                      <p>1000</p>
                    </div>
                    <div className={styles.winnersprice}>
                      <h3 style={{ backgroundColor: "#693bb8", width: "max-content", padding: "5px", borderRadius: "5px", marginBottom: "10px" }}>Price Distribution</h3>
                      <p>5 winners</p>
                      <p>5 winners</p>
                      <p>5 winners</p>
                      <p>5 winners</p>
                    </div>
                  </div>

                  <div className={styles.actionbuttons}>
                    <Button>Edit</Button>
                    <Button>Delete</Button>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.contestone}>
              <div className={styles.contestheader}>
                <h3 className={styles.h3}>Contest 2</h3>
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
                  <div className={styles.graph}>
                    <RadarChart />
                  </div>

                  <div className={styles.winnerslist}>
                    <div className={styles.winnerspart}>
                      <h3 style={{ backgroundColor: "#693bb8", width: "max-content", padding: "5px", borderRadius: "5px", marginBottom: "10px" }}>Winners</h3>
                      <p>1st price winner: Gokul</p>
                      <p>2nd price winner: Adithya</p>
                      <p>3rd price winner: Sanju</p>
                      <p>4th price winner: Akshay</p>
                    </div>
                    <div className={styles.winnersprice}>
                      <h3 style={{ backgroundColor: "#693bb8", width: "max-content", padding: "5px", borderRadius: "5px", marginBottom: "10px" }}>Prices</h3>
                      <p>Iphones</p>
                      <p>Iphones</p>
                      <p>Iphones</p>
                      <p>Iphones</p>
                    </div>
                  </div>


                  <div className={styles.totalentries}>
                    <div className={styles.winnerspart}>
                      <h3 style={{ backgroundColor: "#693bb8", width: "max-content", padding: "5px", borderRadius: "5px", marginBottom: "10px" }}>Date</h3>
                      <p>20/05/2025</p>
                      <p>20/05/2025</p>
                      <p>20/05/2025</p>
                      <p>20/05/2025</p>
                    </div>
                    <div className={styles.winnersprice}>
                      <h3 style={{ backgroundColor: "#693bb8", width: "max-content", padding: "5px", borderRadius: "5px", marginBottom: "10px" }}>Total Entries</h3>
                      <p>1000</p>
                      <p>1000</p>
                      <p>1000</p>
                      <p>1000</p>
                    </div>
                    <div className={styles.winnersprice}>
                      <h3 style={{ backgroundColor: "#693bb8", width: "max-content", padding: "5px", borderRadius: "5px", marginBottom: "10px" }}>Price Distribution</h3>
                      <p>5 winners</p>
                      <p>5 winners</p>
                      <p>5 winners</p>
                      <p>5 winners</p>
                    </div>
                  </div>

                  <div className={styles.actionbuttons}>
                    <Button>Edit</Button>
                    <Button>Delete</Button>
                  </div>
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