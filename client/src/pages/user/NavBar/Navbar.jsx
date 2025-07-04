import React, { useEffect, useRef, useState } from "react";
import styles from "./navbar.module.css";
import logo from "../../../assets/Logo.png";
import wallet from "../../../assets/wallet.png";
import coupon from "../../../assets/coupon.png";
import home from "../../../assets/home.jpg";
import profile from "../../../assets/cardbackground.jpg";
import notificationIcon from "../../../assets/navIcon.svg";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import socket from "../../../components/Socket/socket";
import verificationIcon from "../../../assets/kyc.png";
import notification from "../../../assets/notification.png";
import ads from "../../../assets/add.png"

function Navbar() {
  const [activeTab, setActiveTab] = useState("home");
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  const userId = useSelector((state) => state.user.id);
  const navigate = useNavigate();

  const KYCIcon = () => (
    <img src={verificationIcon} alt="KYC" style={{objectFit:"contain",height:"100%",width:"100%"}} />
  );
const NotificationIcon = () => (
    <img src={notification} alt="notification" style={{objectFit:"contain",height:"100%",width:"100%"}} />
  );
  const AdsIcon = () => (
    <img src={ads} alt="notification" style={{objectFit:"contain",height:"100%",width:"100%"}} />
  );
  const navItems = [
    { icon: home, label: `/userhome/${userId}` },
    { icon: wallet, label: `/walletpage/${userId}` },
    { icon: <AdsIcon/>, label: `/adsmanageruser/${userId}` },
    {
      icon: <KYCIcon />,
      label: "/kycverification",
    },
    { icon:<NotificationIcon/> , label: "notification" },
    { icon: coupon, label: "/coupon" },

    { icon: profile, label: "/userprofile" },

  ];

  const handleBottomNavClick = (label) => {
    setActiveTab(label);

    if (label === "notification") {
      setShowDropdown((prev) => {
        const newState = !prev;
        if (newState) setUnreadCount(0);
        return newState;
      });
    } else {
      setShowDropdown(false);
      navigate(label);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!socket.connected) socket.connect();
    socket.emit("register", userId);

    socket.on("notification", (data) => {
      console.log("🔔 Notification received on frontend:", data);
      setNotifications((prev) => [data, ...prev]);
      setUnreadCount((count) => count + 1);
    });

    return () => {
      socket.off("notification");
    };
  }, [userId]);

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
              <div
                className={styles.iconContainer}
                key={index}
                onClick={() => handleBottomNavClick(item.label)}
              >
                <div className={styles.iconWrapper}>
                  {typeof item.icon === "string" ? (
                    <img src={item.icon} alt={item.label} />
                  ) : (
                    item.icon
                  )}
                  {item.label === "notification" && unreadCount > 0 && (
                    <span className={styles.notificationDot}></span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {showDropdown && (
            <div className={styles.notificationDropdown} ref={dropdownRef}>
              {notifications.length === 0 ? (
                <p className={styles.noNotification}>No notifications yet.</p>
              ) : (
                notifications.map((note, index) => (
                  <div key={index} className={styles.notificationItem}>
                    {note.message}
                  </div>
                ))
              )}
            </div>
          )}
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
            {typeof item.icon === "string" ? (
              <img src={item.icon} alt={item.label} />
            ) : (
              item.icon
            )}
          </div>
        ))}
      </div>
    </>
  );
}

export default Navbar;
