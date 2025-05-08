import { React, useState, useEffect, useMemo } from 'react'
// import Logo from "../../assets/header-logo.png"
import "./Sidebar.css"
import { Menu, Button } from 'antd'
import {
    HomeOutlined, UserOutlined, ContainerOutlined, DiffOutlined, UserAddOutlined, SettingOutlined, LogoutOutlined, PushpinOutlined,
    PushpinFilled,
} from "@ant-design/icons"
import { NavLink, useLocation } from 'react-router-dom'

function Sidebar() {
    const [isPinned, setIsPinned] = useState(false);
    const location = useLocation();
    const pathKey = useMemo(() => location.pathname.split("/")[1] || "admin", [location]);

    useEffect(() => {
        const savedState = JSON.parse(localStorage.getItem("isPinned"));
        if (savedState !== null) setIsPinned(savedState);
    }, []);

    const togglePin = () => {
        setIsPinned((prev) => {
            const newState = !prev;
            localStorage.setItem("isPinned", JSON.stringify(newState));
            return newState;
        });
    };

    const menuItems = useMemo(() => [
        { key: "admin", label: "Dashboard", icon: <HomeOutlined />, path: "/admin" },
        { key: "profile", label: "Profile", icon: <UserOutlined />, path: "/profile" },
        { key: "listing", label: "Listing", icon: <ContainerOutlined />, path: "/listing" },
        { key: "blogs", label: "Blogs", icon: <DiffOutlined />, path: "/blogs" },
        { key: "socialmedia", label: "Social Media", icon: <UserAddOutlined />, path: "/socialmedia" },
        { key: "settings", label: "Settings", icon: <SettingOutlined />, path: "/settings" },
        { key: "signout", label: "Signout", icon: <LogoutOutlined />, path: "/" },
    ], []);


    return (
        <>
            <div className="container">
                <div className={`sidebar ${isPinned ? "pinned" : "collapsed"}`}>
                    <div className="sidebar-content">
                        <div className='logo'>
                            {/* <img src={Logo} /> */}
                        </div>
                        <Menu
                            className="menu"
                            mode="vertical"
                            defaultSelectedKeys={[pathKey]}
                        >
                            {menuItems.map(({ key, label, icon, path }) => (
                                <Menu.Item key={key} icon={icon}>
                                    <NavLink to={path}>{isPinned && label}</NavLink>
                                </Menu.Item>
                            ))}
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
        </>
    )
}

export default Sidebar