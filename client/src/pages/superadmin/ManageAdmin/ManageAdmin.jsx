import React, { useState } from "react";
import "./manageadmin.css";
import padam from "../../../assets/cardbackground.jpg";
import Sidebar from "../../../components/sidebar/Sidebar";

function ManageAdmin() {
  const [isEnabled, setIsEnabled] = useState(true);

  return (
    <div className="admincontestcontainermain1">
      <Sidebar />

      <div className="manageadmin-wrapper">
        <div className="manageadmin-header">
          <div className="manageadmin-header-item">Admin</div>
          <div className="manageadmin-header-item">Disable/Enable</div>
          <div className="manageadmin-header-item">Coupons Distributed</div>
          <div className="manageadmin-header-item">Ads Verified</div>
          <div className="manageadmin-header-item">Rejected Ads</div>
        </div>

        <div className="manageadmin-data-row">
          <div className="manageadmin-data-item manageadmin-admin-info">
            <img src={padam} alt="Admin" className="manageadmin-admin-photo" />
            <p className="manageadmin-admin-name">John Doe</p>
          </div>

          <div className="manageadmin-data-item">
            <label className="manageadmin-toggle-switch">
              <input
                type="checkbox"
                checked={isEnabled}
                onChange={() => setIsEnabled(!isEnabled)}
              />
              <span className="manageadmin-toggle-slider"></span>
            </label>
          </div>

          <div className="manageadmin-data-item">
            <p>1234</p>
          </div>
          <div className="manageadmin-data-item">
            <p>567</p>
          </div>
          <div className="manageadmin-data-item">
            <p>89</p>
            <span className="manageadmin-delete-icon" title="Delete">
              🗑️
            </span>
          </div>
        </div>
         <div className="manageadmin-form-section">
        <h4 className="manageadmin-form-heading">Admin1</h4>
        <div className="manageadmin-input-row">
          <div className="manageadmin-input-group">
            <label htmlFor="username">Username</label>
            <input type="text" id="username" placeholder="Enter username" />
          </div>
          <div className="manageadmin-input-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" placeholder="Enter password" />
          </div>
        </div>
      </div>
      </div>
     
    </div>
  );
}

export default ManageAdmin;
