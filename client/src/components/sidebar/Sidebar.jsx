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
import { useSelector } from "react-redux";
const { SubMenu } = Menu;


function Sidebar() {
    const navigate = useNavigate();
    const [isPinned, setIsPinned] = useState(false);
    const location = useLocation();
    const [openKeys, setOpenKeys] = useState([]);
    const pathname = location.pathname;
    const id = useSelector((state) => state.admin.id)

    const onOpenChange = (keys) => {
        const latestOpenKey = keys.find(key => !openKeys.includes(key));
        // Only allow one submenu to be open at a time
        setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    };

    useEffect(() => {
        const savedState = JSON.parse(localStorage.getItem("isPinned"));
        if (savedState !== null) setIsPinned(savedState);
    }, []);


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
                key: "home", label: "Home", icon: <HomeOutlined />, path: "/Admindashboard",
            },
            {
                key: "ads", label: "Ads", icon: <UserOutlined />,
                children: [
                    { key: "ads", label: "All Ads", path: `/AdminAds/${id}` },
                    { key: "assigned-ads", label: "Assigned Ads", path: "/AssignedAds" },
                ]

            },
            {
                key: "coupons", label: "Coupons", icon: <UserOutlined />,
                children: [
                    { key: "coupons-all", label: "All Coupons", path: `/AdminCoupon/${id}` },
                    { key: "coupons-new", label: "Coupon Requests", path: `/AdminCouponReq/${id}`},
                ]

            },
            {
                key: "adminkyc", label: "KYC", icon: <UserOutlined />,
                children: [
                    { key: "all-kyc", label: "All KYC", path: `/AdminKYC/${id}` },
                    { key: "assigned-kyc", label: "Assigned Kyc", path: "/AssignedKyc" },
                ]
            },
            {
                key: "contest", label: "Contest", icon: <UserOutlined />,
                children: [
                    { key: "contest-all", label: "All Contest", path: "/AdminContest" },
                    { key: "contest-new", label: "Contest Winners", path: "/ContestForm" },
                ]
            },
            {
                key: "report", label: "Reports", icon: <ContainerOutlined />, path: "/AdminReport",
            },
            {
                key: "settings", label: "Settings", icon: <SettingOutlined />, path: "/AdminSettings",
            }
        ]
    );

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