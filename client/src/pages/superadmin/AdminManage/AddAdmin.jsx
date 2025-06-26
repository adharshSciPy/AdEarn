import React, { useState } from "react";
import styles from "./AddAdmin.module.css"
import SuperSidebar from "../../../components/SuperAdminSideBar/SuperSidebar";
import axios from "axios";
import baseUrl from "../../../baseurl";
import { useDispatch } from "react-redux";
import { setAdmin } from "../../../components/features/adminSlice";


function AddAdmin() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    username: "",
    address: "",
    phoneNumber: "",
    password: "",
    adminEmail: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${baseUrl}/api/v1/admin/admin-register`, formData)
      console.log("res", response)
      const id = response.data.data._id;
      const email = response.data.data.adminEmail;
      const role = response.data.data.adminRole
      dispatch(setAdmin({ adminId: id, adminEmail: email, role: role }))
    } catch (error) {
      console.log(error)
    }
  };
  return (
    <div className={styles.UserAccount}>
      <SuperSidebar />
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h2>Create Admin</h2>
        </div>
        <div className={styles.container}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <label>Admin Name</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Name"
            />

            <label>Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
            />

            <label>Email</label>
            <input
              type="text"
              name="adminEmail"
              value={formData.adminEmail}
              onChange={handleChange}
              placeholder="Email"
            />

            <label>Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Phone Number"
            />

            <label>Password</label>
            <input
              type="text"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
            />

            <div className={styles.buttons}>
              <button type="button" className={styles.cancel}>
                Cancel
              </button>
              <button type="submit" className={styles.submit}>
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddAdmin;
