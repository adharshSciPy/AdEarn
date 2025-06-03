import { React, useState, useEffect, useMemo } from "react";
import "./supersidebar.css";
import Logo from "../../assets/Logo.png";
import Avatar from "../../assets/Avatar.png";
import { Menu, Button } from "antd";
import {
  HomeOutlined,
  UserOutlined,
  ContainerOutlined,
  SettingOutlined,
  PushpinOutlined,
  PushpinFilled,
} from "@ant-design/icons";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
const { SubMenu } = Menu;

function Sidebar() {
  const navigate = useNavigate();
  const [isPinned, setIsPinned] = useState(false);
  const location = useLocation();
  const [openKeys, setOpenKeys] = useState([]);
  const pathname = location.pathname;

  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => !openKeys.includes(key));
    // Only allow one submenu to be open at a time
    setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
  };

  useEffect(() => {
    const savedState = JSON.parse(localStorage.getItem("isPinned"));
    if (savedState !== null) setIsPinned(savedState);
  }, []);

  const user = {
    name: "Andrew Smith",
    role: "500",
  };

  const formatRole = (role) => {
    switch (role) {
      case "500":
        return "SUPER ADMIN";
      case "400":
        return "ADMIN";
      default:
        return role.toUpperCase();
    }
  };

  const menuItems = useMemo(() => [
    {
      key: "home",
      label: "Home",
      icon: <HomeOutlined />,
      path: "/SuperadminDash"
    },
    {
      key: "users",
      label: "Users",
      icon: <UserOutlined />,
      children: [
        { key: "user-account", label: "User Account", path: "/superadminadsuser" },
        { key: "deleted-user", label: "Delete User", path: "/demo" },
      ],
    },
    {
      key: "accounts",
      label: "Accounts",
      icon: <UserOutlined />,
      children: [
        { key: "user-account", label: "User Account", path: "/superadminuseraccount" },
        { key: "admin-account", label: "Admin Account", path: "/superadminadminaccount" },
        { key: "company-account", label: "Company Account", path: "/Companyaccounts" },
        { key: "welcome-account", label: "Welcome Account", path: "/superadminwelcomebonus" },
        // {
        //   key: "Referal-account",
        //   label: "Refereal Account",
        //   path: "/AdminAds",
        // },
        { key: "contest-account", label: "Contest Account", path: "/superadmincontestaccount" },
        { key: "coupons-account", label: "Coupons Account", path: "/superadmincouponaccount" },
        {
          key: "subscription-account",
          label: "Subscription Account",
          path: "/superadminsubscriptionaccount",
        },
        { key: "Ads-account", label: "Ads Account", path: "/superadminadsaccount" },
      ],
    },
    {
      key: "star",
      label: "Star",
      icon: <UserOutlined />,
      children: [
        { key: "user-star", label: "User Star", path: "/Userstar" },
        { key: "admin-star", label: "Admin Star", path: "/AdminAds" },
        { key: "company-star", label: "Company Star", path: "/AdminAds" },
        { key: "welcome-star", label: "Welcome Star", path: "/AdminAds" },
        {
          key: "Referal-star",
          label: "Refereal Star",
          path: "/AdminAds",
        },
        { key: "contest-star", label: "Contest Star", path: "/AdminAds" },
        { key: "coupons-star", label: "Coupons Star", path: "/AdminAds" },
        {
          key: "subscription-star",
          label: "Subscription Star",
          path: "/AdminAds",
        },
        { key: "Ads-star", label: "Ads Star", path: "/AdsDistribution" },
      ],
    },
    
    {
      key: "coupongeneration",
      label: "Coupon Generation",
      icon: <UserOutlined />,
      children: [
        { key: "generate-coupons", label: "Generate Coupons", path: "/superadmincoupongeneration" },
      ],
    },
    {
      key: "contest",
      label: "Contest",
      icon: <UserOutlined />,
      children: [
        { key: "create-contest", label: "Create Contest", path: "/AdminContest" },
        { key: "contest-winner", label: "Contest winner", path: "/demo" },
      ],
    },
    {
      key: "referal",
      label: "Referal",
      icon: <ContainerOutlined />,
      children: [
        { key: "referal-bonus", label: "Referal Bonus", path: "/AdminReport" },
        { key: "star-distribution", label: "Star Distribution", path: "/demo" },
      ],
    },
    {
      key: "welcome-bonus",
      label: "Welcome Bonus",
      icon: <ContainerOutlined />,
      children: [
        { key: "welcome-bonus", label: "Welcome Bonus", path: "/superadminwelcomedistribution" },
        { key: "star-distribution", label: "Star Distribution", path: "/demo" },
      ],
    },
    {
      key: "admin",
      label: "Admin",
      icon: <ContainerOutlined />,
      children: [
        { key: "admin-add", label: "Add Admin ", path: "/superadminaddadmin" },
        { key: "admin-delete", label: " Delete Admin", path: "/demo" },
      ],
    },
    {
      key: "report",
      label: "Report & Analytics",
      icon: <ContainerOutlined />,
      children: [
        { key: "ad-user", label: "Ad user", path: "/AdminReport" },
        { key: "disabled-user", label: "Disabled User", path: "/AdminReport" },
      ],
    },
    {
      key: "subscription",
      label: "Subscription",
      icon: <ContainerOutlined />,
      children: [
        { key: "subscription", label: "Subscritions", path: "/superadminsubscritionplan" },
      ],
    },
    {
      key: "tip&notifications",
      label: "Tips & Notifications",
      icon: <ContainerOutlined />,
      children: [
        { key: "tips", label: "Tips ", path: "/AdminReport" },
        { key: "notification", label: "Notifications ", path: "/AdminReport" },

      ],
    },
  ]);

  const pathKey = useMemo(() => {
    let found = null;
    const findKey = (items) => {
      for (const item of items) {
        if (item.path === pathname) {
          found = item.key;
        } else if (item.children) {
          findKey(item.children);
        }
      }
    };
    findKey(menuItems);
    return found;
  }, [pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        const savedState = JSON.parse(localStorage.getItem("isPinned"));
        setIsPinned(savedState !== null ? savedState : false);
      } else {
        setIsPinned(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const togglePin = () => {
    setIsPinned((prev) => {
      const newState = !prev;
      localStorage.setItem("isPinned", JSON.stringify(newState));
      return newState;
    });
  };

  return (
    <div className="sidebar-container">
      <div className={`sidebar ${isPinned ? "pinned" : "collapsed"}`}>
        <div className="sidebar-content">
          <div className="logo">
            <img src={Logo} />
          </div>
          <div className="heading">
            {isPinned && (
              <>
                <img src={Avatar} />
                <div className="headtext">
                  <p>{user.name}</p>
                  <span>{formatRole(user.role)}</span>
                </div>
              </>
            )}
          </div>
          <Menu
            className="menu"
            mode="inline"
            selectedKeys={[pathKey]}
            openKeys={openKeys}
            onOpenChange={onOpenChange}
            inlineCollapsed={!isPinned}
          >
            {menuItems.map(({ key, label, icon, path, children }) =>
              children ? (
                <SubMenu key={key} icon={icon} title={isPinned && label}>
                  {children.map((child) => (
                    <Menu.Item key={child.key}>
                      <NavLink to={child.path}>
                        {isPinned && child.label}
                      </NavLink>
                    </Menu.Item>
                  ))}
                </SubMenu>
              ) : (
                <Menu.Item key={key} icon={icon}>
                  <NavLink to={path}>{isPinned && label}</NavLink>
                </Menu.Item>
              )
            )}
          </Menu>
        </div>
      </div>
      <div className="pin-pin">
        <Button
          aria-label={isPinned ? "Unpin Sidebar" : "Pin Sidebar"}
          className="pin-button"
          type="text"
          icon={isPinned ? <PushpinFilled /> : <PushpinOutlined />}
          onClick={togglePin}
        />
      </div>
    </div>
  );
}

export default Sidebar;
