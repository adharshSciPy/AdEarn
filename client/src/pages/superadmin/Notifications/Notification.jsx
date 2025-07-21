import React, { useState } from "react";
import styles from "./Notification.module.css";
import SuperSidebar from "../../../components/SuperAdminSideBar/SuperSidebar";
import Header from "../../../components/Header/Header";
import { Button, Input } from "antd";
import axios from "axios";
import baseUrl from "../../../baseurl";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { TextArea } = Input;
function Notification() {
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");
  const handleChange = (e) => {
    setRole(e.target.value);
  };
  const handleMessage = (e) => {
    setMessage(e.target.value);
  };
  const handleSubmit = async () => {
    if (!role || !message) {
      alert("Please select a role and enter a message");
      return;
    }
    try {
        const response=await axios.post(`${baseUrl}/api/v1/broadcast/create-broadcast`,{
            message:message,
            target:role
        })
        if(response.status===201){
            setMessage("")
            setRole("")
             toast.success("Notification sent successfully");
        }
        
    } catch (error) {
        console.log(error);
         toast.error("Failed to send notification");
        
    }
  };
  return (
    <div className={styles.notificationmain}>
      <div className={styles.notificationcontainer}>
        <SuperSidebar />
        <Header />
        <div className={styles.notificationform}>
          <div
            style={{
              width: "100%",
              maxWidth: "1550px",
              height: "600px",
              padding: "30px",
            }}
            className={styles.notificationadminimage}
          >
            <div className={styles.notificationhead}>
              <h1>Notification</h1>
              <Button>Log</Button>
            </div>
            <div className={styles.inputnotification}>
              <TextArea
                rows={4}
                placeholder="Notification"
                onChange={handleMessage}
                value={message} 
              />
            </div>
            <div className={styles.radio}>
              <label>
                <input
                  type="radio"
                  //   name="allAdmins"
                  value="allAdmins"
                  checked={role === "allAdmins"}
                  onChange={handleChange}
                />
                Admin
              </label>
              <label style={{ marginLeft: "20px" }}>
                <input
                  type="radio"
                  //   name="allUsers"
                  value="allUsers"
                  checked={role === "allUsers"}
                  onChange={handleChange}
                />
                User
              </label>
            </div>

            <div className={styles.subbutton}>
              <Button onClick={handleSubmit}>Submit</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Notification;
