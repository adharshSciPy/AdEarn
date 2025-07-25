import React, { useState, useEffect } from "react";
import styles from "./useraccount.module.css";
import Sidebar from "../../../components/SuperAdminSideBar/SuperSidebar";
import axios from "axios";
import baseUrl from "../../../baseurl";
import { Pagination } from "antd";
import { useNavigate } from "react-router-dom";

function UserAccount() {
  const [activeTab, setActiveTab] = useState("requests");
  const [data, setData] = useState([]);
  const [confirmedData, setConfirmedData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const navigate = useNavigate();

  const handleVerify = (user) => {
    const id = user.id || user._id;
    navigate(`/Superadminpayoutpage/${id}`);
  };
  const handleAccept=async(user)=>{
    const id=user._id;
    try {
      const res=await axios.patch(`${baseUrl}/api/v1/payout/complete-payout/${id}`)
      console.log(res);
      if(res.status===200){
        fetchConfirmedPayouts()
      }
    } catch (error) {
      console.log(error);
      
    }

  }
  const fetchPayoutRequests = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/v1/payout/all-unverified/requests`, {
        params: {
          page: currentPage,
          limit: pageSize,
        },
      });
      setData(response.data.requests);
    } catch (error) {
      console.error("Error fetching payout requests:", error);
    }
  };

  const fetchConfirmedPayouts = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/v1/payout/all-verified/requests`);
      setConfirmedData(response.data.data || []);
      console.log("siu",response);
      
    } catch (error) {
      console.error("Error fetching confirmed payouts:", error);
    }
  };

  useEffect(() => {
    if (activeTab === "requests") {
      fetchPayoutRequests();
    } else if (activeTab === "confirmation") {
      fetchConfirmedPayouts();
    }
  }, [activeTab, currentPage, pageSize]);

  const totalAmount = (activeTab === "requests" ? data : confirmedData).reduce(
    (sum, item) => sum + (item.amount || 0),
    0
  );

  function formatDateTime(isoString) {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  return (
    <div className={styles.UserAccount}>
      <Sidebar />
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h2>Users Payouts</h2>
          <button className={styles.logBtn}>Log</button>
        </div>

        <div className={styles.amountCard}>
          <div>
            <p>Total Amount</p>
            <h1>₹ {totalAmount}</h1>
          </div>
          <div className={styles.rightText}>
            <p>Company account</p>
            <span>+8% from yesterday</span>
          </div>
        </div>

        

        <div className={styles.requestsHeader}>
          <div className={styles.tabButtons}>
          <button
            className={activeTab === "requests" ? styles.activeTab : styles.inactiveTab}
            onClick={() => setActiveTab("requests")}
          >
            Payout Requests
          </button>
          <button
            className={activeTab === "confirmation" ? styles.activeTab : styles.inactiveTab}
            onClick={() => setActiveTab("confirmation")}
          >
            Payout Confirmations
          </button>
        </div>
          <button className={styles.exportBtn}>Export</button>
        </div>

        <div className={styles.table}>
          <div className={styles.tableHeader}>
            <div>User name</div>
            <div>Star Count</div>
            <div>Amount</div>
            <div>Date</div>
            <div>Action</div>
          </div>

          {(activeTab === "requests" ? data : confirmedData)
            .slice((currentPage - 1) * pageSize, currentPage * pageSize)
            .map((user, index) => (
              <div className={styles.tableRow} key={index}>
                <div className={styles.userCell}>
                  <span>{user.userName}</span>
                </div>
                <div>{user.starCount}</div>
                <div>{user.amount}</div>
                <div>{formatDateTime(user.requestedAt)}</div>
                <div>
                  {activeTab === "requests" ? (
                    <button className={styles.approve} onClick={() => handleVerify(user)}>
                      Verify
                    </button>
                  ) : (
                    <button className={styles.approve} onClick={()=>handleAccept(user)}>Approve</button>
                  )}
                </div>
              </div>
            ))}
        </div>

        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={(activeTab === "requests" ? data : confirmedData).length}
          showSizeChanger
          pageSizeOptions={["10", "20", "50", "100"]}
          onChange={(page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          }}
          style={{ marginTop: "20px", textAlign: "right", display: "flex", justifyContent: "end" }}
        />
      </div>
    </div>
  );
}

export default UserAccount;
