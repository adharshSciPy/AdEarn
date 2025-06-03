import React,{useState} from "react";
import styles from "./AddAdmin.module.css"
import SuperSidebar from "../../../components/SuperAdminSideBar/SuperSidebar";


function AddAdmin() {
     const [formData, setFormData] = useState({
        couponNumber: "",
        couponCount: "",
        starCount: "",
        date: "",
        expiryDate: "",
      });
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
      };
    
      const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form Submitted:", formData);
        // You can call your API here
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
              name="adminname"
              value={formData.adname}
              onChange={handleChange}
              placeholder="Admin Name"
            />

            <label>Admin Username</label>
            <input
              type="text"
              name="adminusername"
              value={formData.adminusername}
              onChange={handleChange}
              placeholder="Enter Admin Username"
            />

            <label>Admin Password</label>
            <input
              type="text"
              name="adminpassword"
              value={formData.starCount}
              onChange={handleChange}
              placeholder="Enter Admin Password"
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
