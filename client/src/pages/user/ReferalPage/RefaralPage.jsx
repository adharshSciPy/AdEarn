import {React,useState} from "react";
import styles from "./ReferalPage.module.css";
import avatar from "../../../assets/Avatar.png"
import Navbar from "../NavBar/Navbar";

function RefaralPage() {
    const referrals = [
  { name: "Alice Johnson", amount: 500, date: "03/03/2025" },
  { name: "Brian Smith", amount: 500, date: "03/03/2025" },
  { name: "Clara James", amount: 500, date: "03/03/2025" },
  { name: "David Lee", amount: 500, date: "03/03/2025" },
  { name: "Ella Rose", amount: 500, date: "03/03/2025" },
  { name: "Frank Wright", amount: 500, date: "03/03/2025" },
  { name: "Grace Hall", amount: 500, date: "03/03/2025" },
  { name: "Henry Cole", amount: 500, date: "03/03/2025" },
  { name: "Ivy Brooks", amount: 500, date: "03/03/2025" },
  { name: "Jake Evans", amount: 500, date: "03/03/2025" },
  { name: "Karen Diaz", amount: 500, date: "03/03/2025" },
  { name: "Leo Turner", amount: 500, date: "03/03/2025" },
];
const [searchTerm, setSearchTerm] = useState("");

  const filteredReferrals = referrals.filter((ref) =>
    ref.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div>
      <Navbar/>
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
      <div className={styles.headingContainer}>
        <h1>Your Referral List</h1>
      </div>
      <div className="">
        <div className={styles.container}>
          <header className={styles.header}>
            <div className={styles.logo}>Referral list</div>
            <div className={styles.inputContainer}>
              <input
               type="text"
            placeholder="Search something here"
            className={styles.search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className={styles.members}>{filteredReferrals.length} Members</div>
            </div>
          </header>

          <div className={styles.gridMain}>
            <section className={styles.grid}>
            {filteredReferrals.map((ref, index) => (
              <div className={styles.card} key={index}>
                <div className={styles.cardHeader}>
                  <span className={styles.icon}></span>
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.avatarContainer}>
                    <img src={avatar} alt="Avatar" />
                  </div>
                  <strong>{ref.name}</strong>
                </div>
              </div>
            ))}
          </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RefaralPage;
