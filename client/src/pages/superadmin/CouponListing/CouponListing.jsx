import React, { useEffect, useState } from "react";
import SuperSidebar from "../../../components/SuperAdminSideBar/SuperSidebar";
import baseUrl from "../../../baseurl";
import styles from "./Coupon.module.css";
import axios from "axios";
function CouponListing() {
  const [couponData, setCouponData] = useState([]);
  const [adminData, setGetAdmins] = useState([]);
  const [assignments, setAssignments] = React.useState({});
  const [notes, setNotes] = useState({});

  const getCoupons = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/super-admin/all-coupon-batch`
      );
      if (response.status === 200) {
        setCouponData(response.data.batches);
      }
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };
  const allAdmins = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/v1/admin/getallAdmins`);
      console.log("res admin", response.data.data);
      setGetAdmins(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getCoupons();
    allAdmins();
  }, []);


  const handleAdminChange = (index, value) => {
    setAssignments((prev) => ({ ...prev, [index]: value }));
  };
  console.log(couponData);
  console.log(
    couponData.coupons?.map((item) => <p>{item.perStarCount}</p>) || "nil"
  );
  const handleNoteChange = (index, value) => {
  setNotes((prev) => ({ ...prev, [index]: value }));
};
const handleApprove = async (couponId, adminId, note, index) => {
  if (!adminId) {
    alert("Please select an admin before approving.");
    return;
  }

  try {
    const response = await axios.post(`${baseUrl}/api/v1/super-admin/distribute-coupon`, {
      batchId: couponId,
      adminId,
      note
    });

    if (response.status === 200) {
      alert("Admin assigned successfully");
      console.log("coupons", response);

      // 🧹 Clear selection and note for this row
      setAssignments((prev) => {
        const updated = { ...prev };
        delete updated[index];
        return updated;
      });

      setNotes((prev) => {
        const updated = { ...prev };
        delete updated[index];
        return updated;
      });
    }
  } catch (err) {
    console.error("Error assigning admin:", err);
    alert("Failed to assign admin");
  }
};


  return (
    <div className={styles.UserAccount}>
      <SuperSidebar />
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h2>Coupon Listing</h2>
        </div>
        <div className={styles.container}>
          <div className={styles.tableContainer}>
            <table className={styles.customTable}>
              <thead>
                <tr>
                  {/* <th>User name</th> */}
                  <th>Coupon Count</th>
                  <th>Generation Date</th>
                  <th>Expiry Date</th>
                  <th>Per Star Count</th>
                  <th>Admin Details</th>
                  <th>Note</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {couponData.map((row, index) => (
                  <tr key={index}>
                    {/* <td>{row.userName}</td> */}
                    <td>{row.couponCount}</td>
                    <td>
                      {new Date(row.generationDate).toLocaleDateString("en-GB")}
                    </td>
                    <td>
                      {new Date(row.expiryDate).toLocaleDateString("en-GB")}
                    </td>

                    <td>{row.coupons?.[0]?.perStarCount || "N/A"}</td>
                    <td>
                      <select
                        className={styles.selectInput}
                        value={assignments[index] || ""}
                        onChange={(e) =>
                          handleAdminChange(index, e.target.value)
                        }
                      >
                        <option value="" disabled>
                          Select Admin
                        </option>
                        {adminData.map((admin, idx) => (
                          <option key={idx} value={admin._id}>
                            {admin.username}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <textarea
                        value={notes[index] || ""}
                        onChange={(e) =>
                          handleNoteChange(index, e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <button
                        className={styles.approveBtn}
                        onClick={() =>
                          handleApprove(row._id, assignments[index],notes[index],index)
                        }
                      >
                        Approve
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CouponListing;
