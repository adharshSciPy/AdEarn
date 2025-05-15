import React, { useState } from "react";
import styles from "./WalletPage.module.css";
import Delete from "../../../assets/delete.png";

const WalletPage = () => {
  const [activeTab, setActiveTab] = useState("Payouts");

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  const handleRedeemClick = () => {
    setActiveTab("Redeem Payouts");
  };

  const tabs = [
    "Payouts",
    "Redeem Payouts",
    "Payment History",
    "Cancelled payouts",
  ];

  return (
    <div className={styles.walletContainer}>
      <div className={styles.contentsContainer}>
        <div className={styles.firstContent}>
          <div className={styles.firstMain}>
            <div className={styles.firstMainleftContainer}>
              <div className={styles.firstMainHeader}>
                <h2>Your Wallet</h2>
              </div>
              <div className={styles.firstMainp}>
                <p>
                  Providing cheap car rental services and safe and comfortable
                  facilities.
                </p>
              </div>
              <div className={styles.firstMainbutton}>
                <button>Place Ads</button>
              </div>
            </div>

            <div className={styles.firstMainrightContainer}>
              <div className={styles.firstImageContainer}>
                <div className={styles.firstImageContainerMain}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.contentTwo}>
        <section className={styles.walletBalanceSection}>
          <div className={styles.balanceCard}>
            <div className={styles.balanceAmount}>500</div>
            <button className={styles.buyButton}>Buy stars</button>
            <div className={styles.referBox}>
              <span>🔗 Refer Codes & Earn</span>
              <code>
                #1232163311
                <span>
                  <button className={styles.copyBtn}>📋</button>
                </span>
              </code>
            </div>
          </div>
          <div className={styles.requestBox}>
            <p>Redeem your stars to physical money</p>
            <button className={styles.requestBtn}>Request payout</button>
          </div>
        </section>

        <nav className={styles.tabMenu}>
          <ul>
            {tabs.map((tab) => (
              <li
                key={tab}
                className={activeTab === tab ? styles.active : ""}
                onClick={() => handleTabClick(tab)}
              >
                {tab}
              </li>
            ))}
          </ul>
        </nav>

        {activeTab === "Payouts" && (
          <section className={styles.payoutTableSection}>
            <h2>Payout requests</h2>
            <table className={styles.payoutTable}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Request no</th>
                  <th>Status</th>
                  <th>Payout amount</th>
                  <th>Redeem money</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>03/04/2025</td>
                  <td>Request 1</td>
                  <td>Accepted</td>
                  <td>500</td>
                  <td
                    style={{ display: "flex", justifyContent: "space-around" }}
                  >
                    <button
                      className={styles.redeemBtn}
                      onClick={handleRedeemClick}
                    >
                      Redeem now
                    </button>
                    <button className={styles.cancelBtn}>Cancel payout</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </section>
        )}

        {activeTab === "Redeem Payouts" && (
          <section className={styles.payoutTableSection}>
            <h2>Redeem Payouts</h2>
            <table className={styles.payoutTable}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Request no</th>
                  <th>Star</th>
                  <th>Payout amount</th>
                  <th>Export</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>03/04/2025</td>
                  <td>Request 1</td>
                  <td>50</td>
                  <td>500</td>
                  <td>
                    <button
                      className={styles.redeemBtn}
                      onClick={handleRedeemClick}
                      style={{ margin: "0" }}
                    >
                      Download
                    </button>
                  </td>
                  <td>
                    <button
                      className={styles.cancelBtn}
                      style={{ margin: "0" }}
                    >
                      <img className={styles.image} src={Delete} alt="" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </section>
        )}
        {activeTab === "Payment History" && (
          <section className={styles.payoutTableSection}>
            <h2>Payment History</h2>
            <table className={styles.payoutTable}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Request no</th>
                  <th>Star</th>
                  <th>Payout amount</th>
                  <th>Export</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>03/04/2025</td>
                  <td>Request 1</td>
                  <td>50</td>
                  <td>500</td>
                  <td>
                    <button
                      className={styles.redeemBtn}
                      onClick={handleRedeemClick}
                      style={{ margin: "0" }}
                    >
                      Download
                    </button>
                  </td>
                  <td>
                    <button
                      className={styles.cancelBtn}
                      style={{ margin: "0" }}
                    >
                      <img className={styles.image} src={Delete} alt="" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </section>
        )}
        {activeTab === "Cancelled payouts" && (
          <section className={styles.payoutTableSection}>
            <h2>Cancelled payouts</h2>
            <table className={styles.payoutTable}>
              <thead>
                <tr>
                  <th style={{width:"20%"}}>Date</th>
                  <th style={{width:"20%"}}>Request no</th>
                  <th style={{width:"20%"}}>Star</th>
                  <th style={{width:"20%"}}>Payout amount</th>
                  <th style={{width:"20%"}}>Reason</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{width:"19%"}}>03/04/2025</td>
                  <td style={{width:"19%"}}>Request 1</td>
                  <td style={{width:"19%"}}>50</td>
                  <td style={{width:"18%"}}>500</td>
                  <td style={{width:"25%"}}>
                    <p>reason behind the cancellation reason behind the cancellation reason behind the cancellation</ p>                  
                  </td>
                </tr>
              </tbody>
            </table>
          </section>
        )}
      </div>
    </div>
  );
};

export default WalletPage;
