import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "/img/pngfind-com-virginia-tech-logo-png-1644348-1.png"; // Update path accordingly
import "./style.css";

export const StudentNavbar = () => {
  const location = useLocation(); // Get current route to determine active link
  const [username, setUsername] = useState("");

  // Add any paths to settings screens to ensure Navbar stays active.
  const settingsPaths = [
    "/student-settings-page-student-info",
    "/student-settings-page-notifications",
    "/student-settings-page-advisor-info"

  ];

  useEffect(() => {
    fetch("/api/me", { credentials: "include" })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch user");
        return res.json();
      })
      .then(data => setUsername(data.username))
      .catch(err => console.error("User fetch error:", err));
  }, []);

  return (
    <nav className="navbar navbar-expand-lg px-3 custom-navbar">
       <div className="container-fluid d-flex justify-content-between align-items-center">
        {/* Left Side - Student Scheduler + Logo */}
        <div className="navbar-brand d-flex align-items-center">
          
            Student Scheduler
            <img
              src={logo}
              alt="Virginia Tech Logo"
              className="navbar-logo ms-4"
              style={{ height: "30px", width: "auto"}} // Adjust size as needed
            />
        
        </div>

         {/* Center: Username */}
          {username && (
           <div className="text-center flex-grow-1 d-none d-md-block">
             <span className="navbar-brand">{username}</span>
            </div>
          )}


        {/* Right Side - Navbar Links */}
        <div className="d-flex align-items-center" id="navbarNav">
          <div className="navbar-nav">
            <Link 
              className={`nav-item nav-link ${location.pathname === "/student-home-page" ? "active" : ""}`} 
              to="/student-home-page"
            >
              HOME
            </Link>
            <Link 
              className={`nav-item nav-link ${location.pathname === "/student-calendar" ? "active" : ""}`} 
              to="/student-calendar"
            >
              CALENDAR
            </Link>
            <Link 
                className={`nav-item nav-link ${settingsPaths.some(path => location.pathname.includes(path)) ? "active" : ""}`} 
                to="/student-settings-page-student-info"
            >
              SETTINGS
            </Link>
            <Link 
              className={`nav-item nav-link ${location.pathname === "/" ? "active" : ""}`} 
              to="/"
            >
              LOG OUT
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};


