import React, { useState, useEffect, useRef } from "react";
import styles from "./AdminStar.module.css";
import Sidebar from "../../../../components/SuperAdminSideBar/SuperSidebar";
import Header from "../../../../components/Header/Header";
import axios from "axios"
import baseUrl from "../../../../baseurl";
import { Pagination } from "antd";
import { useMemo } from "react";





function AdminStar() {
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [payoutAmount, setPayoutAmount] = useState("");
    const [visibleCount, setVisibleCount] = useState(10);
    const [totalStar, setTotalStar] = useState("")
    const [data, setData] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const observerRef = useRef();

    const handleApprove = (user) => {
        setSelectedUser(user);
        setShowModal(true);
        setPayoutAmount(user.amount);
    };

    const handleConfirm = () => {
        console.log(`Payout approved for ${selectedUser.name}: ₹${payoutAmount}`);
        setShowModal(false);
        setPayoutAmount("");
    };

    const lastRowRef = useRef();

    function formatDate(isoString) {
        const date = new Date(isoString);
        const options = {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        };
        return date.toLocaleDateString('en-GB', options);
    }


    useEffect(() => {
        if (observerRef.current) observerRef.current.disconnect();
        observerRef.current = new IntersectionObserver(
            (entries) => {
                if (
                    entries[0].isIntersecting &&
                    visibleCount < data.length
                ) {
                    setVisibleCount((prev) => prev + 20);
                }
            },
            { threshold: 1 }
        );
        if (lastRowRef.current) observerRef.current.observe(lastRowRef.current);
    }, [visibleCount]);

    useEffect(() => {
        const adminwallets = async () => {
            try {
                const walletRes = await axios.get(`${baseUrl}/api/v1/admin/admin-wallet`);
                const transactions = walletRes.data.transactions;
                const totalStars = walletRes.data.totalStars;

                // Step 1: For each transaction, fetch user details
                const enrichedTransactions = await Promise.all(
                    transactions.map(async (txn) => {
                        const userId = txn.userId?._id;
                        if (!userId) return { ...txn, userDetails: null };

                        try {
                            const res = await axios.get(`${baseUrl}/api/v1/admin/single-user/${userId}`);
                            console.log("user details response", res)
                            return {
                                ...txn,
                                userDetails: res.data.data,
                            };
                        } catch (err) {
                            console.error(`Error fetching user ${userId}:`, err);
                            return { ...txn, userDetails: null };
                        }
                    })
                );

                setTotalStar(totalStars);
                setData(enrichedTransactions);
            } catch (error) {
                console.error("Error fetching admin wallet:", error);
            }
        };

        adminwallets();
    }, []);



    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return data.slice(startIndex, endIndex);
    }, [data, currentPage, pageSize]);

    return (
        <div className={styles.UserAccount}>
            <Sidebar />
            <Header />
            <div className={styles.wrapper}>
                <div className={styles.header}>
                    <h2>Admin Star</h2>
                    <button className={styles.logBtn}>Log</button>
                </div>

                <div className={styles.amountCard}>
                    <div>
                        <h2>Total Star</h2>
                    </div>
                    <div>
                        <h1>
                            <svg
                                width="30"
                                height="30"
                                viewBox="0 0 24 24"
                                fill="gold"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M12 2L14.9 8.6L22 9.2L17 14L18.5 21L12 17.3L5.5 21L7 14L2 9.2L9.1 8.6L12 2Z" />
                            </svg>{totalStar}</h1>
                    </div>
                    <div className={styles.rightText}>
                        <p>Company account</p>
                        <span>+8% from yesterday</span>
                        <button>payout</button>
                    </div>
                </div>

                <div className={styles.requestsHeader}>
                    <h3>Admin Star Details</h3>
                    <button className={styles.exportBtn}>Export</button>
                </div>

                <div className={styles.table}>
                    <div className={styles.tableHeader}>
                        <div>User name</div>
                        <div>Star</div>
                        <div>Date</div>
                        <div>Email</div>
                    </div>

                    {paginatedData.map((user, index, arr) => (
                        <div
                            className={styles.tableRow}
                            key={user._id || index}
                            ref={index === arr.length - 1 ? lastRowRef : null}
                        >
                            <div className={styles.userCell}>
                                <span>{user.userDetails?.firstName}{" "}{user.userDetails?.lastName}</span>
                            </div>
                            <div>{user.starsReceived}</div>
                            <div>{formatDate(user.date)}</div>
                            <div>{user.userDetails?.email}</div>
                        </div>
                    ))}
                </div>

                <div className={styles.paginationWrapper}>
                    <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={data.length}
                        showSizeChanger
                        pageSizeOptions={['10', '20', '50']}
                        onChange={(page) => setCurrentPage(page)}
                        onShowSizeChange={(current, size) => {
                            setPageSize(size);
                            setCurrentPage(1);
                        }}
                    />
                </div>

                {showModal && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modal}>
                            <h3>Enter payout amount</h3>
                            <input
                                type="number"
                                value={payoutAmount}
                                onChange={(e) => setPayoutAmount(e.target.value)}
                                className={styles.input}
                            />
                            <div className={styles.modalActions}>
                                <button
                                    className={styles.cancel}
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </button>
                                <button className={styles.confirm} onClick={handleConfirm}>
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminStar;
