import React, { useState } from "react";
import styles from "./navbar.module.css";
import logo from "../../../assets/Logo.png";
import wallet from "../../../assets/wallet.png";
import market from "../../../assets/marketing.png";
import home from "../../../assets/home.png";
import profile from "../../../assets/cardbackground.jpg";
import navIcon from "../../../assets/navIcon.svg";

function Navbar() {
  const [activeTab, setActiveTab] = useState("home");

  const navItems = [
    { icon: home, label: "home" },
    { icon: wallet, label: "wallet" },
    { icon: market, label: "market1" },
    { icon: market, label: "market2" },
    { icon: market, label: "market3" },
    { icon: profile, label: "profile" },
  ];

  const handleBottomNavClick = (label) => {
    setActiveTab(label);
    console.log(`Clicked: ${label}`);
    // You can navigate using React Router here if needed
  };

  return (
    <>
      <div className={styles.mainContainer}>
        <div className={styles.subContainerNav}>
          <div className={styles.logoContainer}>
            <div className={styles.logo}>
              <img src={logo} alt="Logo" />
            </div>
          </div>

          <div className={styles.iconsContainer}>
            {navItems.map((item, index) => (
              <div className={styles.iconContainer} key={index}>
                <img src={item.icon} alt={item.label} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation for Mobile */}
      <div className={styles.bottomNav}>
        {navItems.map((item, index) => (
          <div
            key={index}
            className={`${styles.bottomNavItem} ${
              activeTab === item.label ? styles.active : ""
            }`}
            onClick={() => handleBottomNavClick(item.label)}
          >
            <img src={item.icon} alt={item.label} />
          </div>
        ))}
      </div>
    </>
  );
}

export default Navbar;
