import React from "react";
import { Link } from "react-router-dom";
import { StudentNavbar } from "../../../components/StudentNavbar";
import "../style.css";
import "./style.css";

export const StudentInformation = () => {
  return (
    <div className="student-info">
      <div className="div-8">
        
        <StudentNavbar />

          <div className="group-container">
            <div className="link-container"> 
              
              <img
                className="img"
                alt="Virginia tech logo"
                src="/img/virginia-tech-logo-svg-3-1.png"
              />

              <a className="setting-link-active" href="/student-settings-page-student-info">STUDENT INFORMATION</a> 
              <br />
              <br />

              <a className="setting-link" href="/student-settings-page-notifications">NOTIFICATION PREFERENCES</a> 
              <br />
              <br />

              <a className="setting-link" href="/student-settings-page-advisor-info">ADVISOR INFORMATION</a>

            </div>
            <div className="settings-container">
          
              <div className="setting-header">Name</div>
              <div className="current-setting">First Last</div> {/* Change later to be actual name*/}

              <div className="setting-header">Email</div>
              <div className="current-setting">email@somewhere.com</div> {/* Change later to be actual email*/}

              <div className="change-setting">
                <Link
                  className="text-wrapper-1"
                  to="/student-settings-page-edit-student-info"
                >
                  Upload Schedule
                </Link>

                
              </div>
            </div>
          </div>
      </div>
    </div>
  );
};
