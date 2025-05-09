import { React, useState, useEffect, useMemo } from "react";
import "./Sidebar.css";
import { Menu, Button } from "antd";

import {
    HomeOutlined,
    UserOutlined,
    ContainerOutlined,
    SettingOutlined,
    LogoutOutlined,
    PushpinOutlined,
    PushpinFilled,
} from "@ant-design/icons";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

function Sidebar() {
    const navigate = useNavigate();
    const [isPinned, setIsPinned] = useState(window.innerWidth > 768);
    const location = useLocation();

    const menuItems = useMemo(
        () => [
            { key: "home", label: "Home", icon: <HomeOutlined />, path: "/Admindashboard" },
            { key: "ads", label: "Ads", icon: <UserOutlined />, path: "/AdminAds" },
            { key: "coupons", label: "Coupons", icon: <UserOutlined />, path: "/AdminCoupons" },
            { key: "Report", label: "Reports", icon: <ContainerOutlined />, path: "/Adminreport" },
            { key: "settings", label: "Settings", icon: <SettingOutlined />, path: "/Adminsettings" },
            { key: "signout", label: "Signout", icon: <LogoutOutlined /> },
        ]
    );

    const pathKey = useMemo(() => {
        const currentPath = location.pathname;
        const matchingItem = menuItems.find(item => item.path === currentPath);
        return matchingItem ? matchingItem.key : ''; // Default to 'admin' if no match
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
        if (window.innerWidth <= 768) {
            setIsPinned((prev) => {
                const newState = !prev;
                localStorage.setItem("isPinned", JSON.stringify(newState));
                return newState;
            });
        }
    };

    return (
        <div className="sidebar-container">
            <div className={`sidebar ${isPinned ? "pinned" : "collapsed"}`}>
                <div className="sidebar-content">
                    <div className="logo"></div>
                    <div className="pin-pin">
                        <Button
                            aria-label={isPinned ? "Unpin Sidebar" : "Pin Sidebar"}
                            className="pin-button"
                            type="text"
                            icon={isPinned ? <PushpinFilled /> : <PushpinOutlined />}
                            onClick={togglePin}
                            disabled={window.innerWidth > 768}
                        />
                    </div>
                    <Menu
                        className="menu"
                        mode="vertical"
                        selectedKeys={[pathKey]}
                    >
                        {menuItems.map(({ key, label, icon, path, onClick }) => (
                            <Menu.Item key={key} icon={icon} onClick={onClick}>
                                <NavLink to={path}>{isPinned && label}</NavLink>
                            </Menu.Item>
                        ))}
                    </Menu>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;