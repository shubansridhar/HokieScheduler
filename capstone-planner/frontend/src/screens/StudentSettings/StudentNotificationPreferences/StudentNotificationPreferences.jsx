import React from "react";
import { Link } from "react-router-dom";
import "../style.css";
import "./style.css";
import { StudentNavbar } from "../../../components/StudentNavbar";

export const StudentNotificationPreferences = () => {
  return (
    <div className="student-settings-screen">
      <div className="div-8">
        <StudentNavbar />

          <div className="group-container">
            <div className="link-container"> 
  
              <img
                className="img"
                alt="Virginia tech logo"
                src="/img/virginia-tech-logo-svg-3-1.png"
              />

              <a className="setting-link" href="/student-settings-page-student-info">STUDENT INFORMATION</a> 
              <br />
              <br />

              <a className="setting-link-active" href="/student-settings-page-notifications">NOTIFICATION PREFERENCES</a> 
              <br />
              <br />

              <a className="setting-link" href="/student-settings-page-advisor-info">ADVISOR INFORMATION</a>

            </div>
            <div className="settings-container">

            <div className="setting-header">Toggle Email Notifications</div>
            <div className="current-setting">On</div> {/* Change later to be actual name*/}

            <div className="setting-header">Receiving Email</div>
            <div className="current-setting">email@somewhere.com</div> {/* Change later to be actual email*/}
  
                <Link
                  to="/student-settings-page-edit-student-info"
                > Edit
                </Link>

            </div>
          </div>
      </div>
    </div>
  );
};
