import React, { useEffect, useRef, useState } from "react";
import styles from "./navbar.module.css";
import logo from "../../../assets/Logo.png";
import wallet from "../../../assets/wallet.png";
import coupon from "../../../assets/coupon.png";
import home from "../../../assets/home.jpg";
import profile from "../../../assets/cardbackground.jpg";
import notificationIcon from "../../../assets/navIcon.svg";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import socket from "../../../components/Socket/socket";
import verificationIcon from "../../../assets/kyc.png";
import notification from "../../../assets/notification.png";
import ads from "../../../assets/add.png";
import { addNotification } from "../../../components/features/notificationSlice";
import contest from "../../../assets/trophy.png"
import Driver from 'driver.js';
import 'driver.js/dist/driver.min.css';



function Navbar() {
  const [activeTab, setActiveTab] = useState("home");
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user.id);
  const navigate = useNavigate();

  const KYCIcon = () => (
    <img
      src={verificationIcon}
      alt="KYC"
      style={{ objectFit: "contain", height: "100%", width: "100%" }}
    />
  );
  const NotificationIcon = () => (
    <img
      src={notification}
      alt="notification"
      style={{ objectFit: "contain", height: "100%", width: "100%" }}
    />
  );
  const AdsIcon = () => (
    <img
      src={ads}
      alt="notification"
      style={{ objectFit: "contain", height: "100%", width: "100%" }}
    />
  );
  const navItems = [
    { icon: home, label: `/userhome/${userId}`, navId: "user-home" },
    { icon: wallet, label: `/walletpage/${userId}`, navId: "wallet-page" },
    { icon: <AdsIcon />, label: `/adsmanageruser/${userId}`, navId: "adsmanager-user" },
    { icon: <KYCIcon />, label: "/kycverification", navId: "kyc-verification" },
    { icon: <NotificationIcon />, label: "notification", navId: "notification" },
    { icon: coupon, label: "/coupon", navId: "coupon" },
    { icon: contest, label: `/contestpage/${userId}`, navId: "contest-page" },
    { icon: profile, label: "/userprofile", navId: "user-profile" },
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
      dispatch(addNotification(data)); // dispatch to redux store
    });

    return () => {
      socket.off("notification");
    };
  }, [userId, dispatch]);

  //driver.js

  useEffect(() => {
    const hasSeenTour = localStorage.getItem(`userHomeTourSeen_${userId}`);

    if (!hasSeenTour) {
      let attempts = 0;

      const interval = setInterval(() => {
        const selectors = [
          '#user-home',
          '#wallet-page',
          '#adsmanager-user',
          '#kyc-verification',
          '#notification',
          '#coupon',
          '#contest-page',
          '#user-profile'
        ];

        const allExist = selectors.every(sel => document.querySelector(sel));
        if (allExist || attempts > 10) {
          clearInterval(interval);

          if (allExist) {
            const driver = new Driver({
              animate: true,
              opacity: 0.5,
              stageBackground: 'rgba(0, 0, 0, 0.5)',
              allowClose: true,
              doneBtnText: 'Finish',
              closeBtnText: 'Skip',
              nextBtnText: 'Next',
              prevBtnText: 'Previous',
              onReset: () => {
                localStorage.setItem(`userHomeTourSeen_${userId}`, 'true');
              }

            });

            driver.defineSteps([
              {
                element: '#user-home',
                popover: {
                  title: 'Home Page',
                  description: 'Click here to view home page.',
                  position: 'bottom',
                },
              },
              {
                element: '#wallet-page',
                popover: {
                  title: 'Wallet Page',
                  description: 'Click here to view wallet page.',
                  position: 'bottom',
                },
              },
              {
                element: '#adsmanager-user',
                popover: {
                  title: 'AdsManager Page',
                  description: 'Click here to view adsmanager page.',
                  position: 'bottom',
                },
              },
              {
                element: '#kyc-verification',
                popover: {
                  title: 'KYC Page',
                  description: 'Click here to view kyc verification page.',
                  position: 'bottom',
                },
              },
              {
                element: '#notification',
                popover: {
                  title: 'Notification',
                  description: 'Click here to view notifications.',
                  position: 'bottom',
                },
              },
              {
                element: '#coupon',
                popover: {
                  title: 'Coupons Page',
                  description: 'Click here to view coupons page.',
                  position: 'bottom',
                },
              },
              {
                element: '#contest-page',
                popover: {
                  title: 'Contest Page',
                  description: 'Click here to view contest page.',
                  position: 'bottom',
                },
              },
              {
                element: '#user-profile',
                popover: {
                  title: 'Profile Page',
                  description: 'Click here to view profile page.',
                  position: 'bottom',
                },
              },
            ]);

            driver.start();
          } else {
            console.warn('Some tour elements not found.');
          }
        }

        attempts++;
      }, 1000);

      return () => clearInterval(interval);
    }
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
                id={item.navId}
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
            className={`${styles.bottomNavItem} ${activeTab === item.label ? styles.active : ""
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
