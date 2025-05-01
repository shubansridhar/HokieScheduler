import React from "react";
import { Link } from "react-router-dom";
import "./style.css";

export const LoginPage = () => {
  return (
    <div className="login-page">
      <div className="div-4">
        <div className="login-container">
          <img
            className="virginia-tech-logo"
            alt="Virginia tech logo"
            src="/img/virginia-tech-logo-svg-3-1.png"
          />

          <div className="title">Hokie Scheduler</div>

          <div className="login-button">
          <button
            className="student-login"
            onClick={() => {
              window.location.href = "/api/cas/login";
              }}
          >
            Login with CAS
          </button>
          </div>

          
        </div>

      </div>
    </div>
  );
};
