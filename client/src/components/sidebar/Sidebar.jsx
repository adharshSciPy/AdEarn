import { React, useState, useEffect, useMemo } from "react";
import "./Sidebar.css";
import Logo from "../../assets/Logo.png"
import Avatar from "../../assets/Avatar.png"
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

    const onOpenChange = (keys) => {
        const latestOpenKey = keys.find(key => !openKeys.includes(key));
        // Only allow one submenu to be open at a time
        setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    };



    const user = {
        name: "Andrew Smith",
        role: "400",
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


    const menuItems = useMemo(
        () => [
            {
                key: "home", label: "Home", icon: <HomeOutlined />,
                children: [
                    { key: "home-all", label: "All Ads", path: "/Admindashboard" },
                    { key: "home-new", label: "New Ad", path: "/AdminAds" },
                ]
            },
            {
                key: "ads", label: "Ads", icon: <UserOutlined />,
                children: [
                    { key: "ads-all", label: "All Ads", path: "/AdminAds" },
                    { key: "ads-new", label: "New Ad", path: "/AdminAds" },
                ],
            },
            {
                key: "coupons", label: "Coupons", icon: <UserOutlined />,
                children: [
                    { key: "coupons-all", label: "All Ads", path: "/AdminCoupon" },
                    { key: "coupons-new", label: "New Ad", path: "/AdminAds" },
                ]

            },
            {
                key: "adminkyc", label: "KYCVerify", icon: <UserOutlined />,
                children: [
                    { key: "adminkyc-all", label: "All Ads", path: "/AdminKYC" },
                    { key: "adminkyc-new", label: "New Ad", path: "/AdminAds" },
                ]
            },
            {
                key: "gallery", label: "Gallery", icon: <UserOutlined />,
                children: [
                    { key: "gallery-all", label: "All Ads", path: "/AdminGallery" },
                    { key: "gallery-new", label: "New Ad", path: "/AdminAds" },
                ]
            },
            {
                key: "contest", label: "Contest", icon: <UserOutlined />,
                children: [
                    { key: "contest-all", label: "All Ads", path: "/AdminContest" },
                    { key: "contest-new", label: "New Ad", path: "/AdminAds" },
                ]
            },
            {
                key: "report", label: "Reports", icon: <ContainerOutlined />,
                children: [
                    { key: "report-all", label: "All Ads", path: "/AdminReport" },
                    { key: "report-new", label: "New Ad", path: "/AdminAds" },
                ]
            },
            {
                key: "settings", label: "Settings", icon: <SettingOutlined />,
                children: [
                    { key: "settings-all", label: "All Ads", path: "/AdminSettings" },
                    { key: "settings-new", label: "New Ad", path: "/AdminAds" },
                ]
            }
        ]
    );

    const pathKey = useMemo(() => {
        const currentPath = location.pathname;
        for (let item of menuItems) {
            if (item.children) {
                const match = item.children.find(child => child.path === currentPath);
                if (match) return match.key;
            } else if (item.path === currentPath) {
                return item.key;
            }
        }
        return '';
    }, [location, menuItems]);

    // Effect to handle screen resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768) {
                setIsPinned(true);
            } else {
                const savedState = JSON.parse(localStorage.getItem("isPinned"));
                if (savedState !== null) {
                    setIsPinned(savedState);
                }
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
                    {/* <div className="pin-pin">
                        <Button
                            aria-label={isPinned ? "Unpin Sidebar" : "Pin Sidebar"}
                            className="pin-button"
                            type="text"
                            icon={isPinned ? <PushpinFilled /> : <PushpinOutlined />}
                            onClick={togglePin}
                            disabled={window.innerWidth > 768}
                        />
                    </div> */}
                    <Menu
                        className="menu"
                        mode="inline"
                        selectedKeys={[pathKey]}
                        openKeys={openKeys}
                        onOpenChange={onOpenChange}
                    >
                        {menuItems.map(({ key, label, icon, path, children }) =>
                            children ? (
                                <SubMenu key={key} icon={icon} title={isPinned && label}>
                                    {children.map(child => (
                                        <Menu.Item key={child.key}>
                                            <NavLink to={child.path}>{isPinned && child.label}</NavLink>
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