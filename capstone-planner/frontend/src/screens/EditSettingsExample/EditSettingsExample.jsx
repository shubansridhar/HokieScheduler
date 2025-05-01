import React from "react";
import { Link } from "react-router-dom";
import "./style.css";

export const EditSettingsExample = () => {
  return (
    <div className="div-wrapper">
      <div className="advisor-settings-3">
        <div className="frame-4">
          <div className="text-wrapper-87">Student Scheduler</div>

          <Link
            className="text-wrapper-88"
            to="/advisor-settings-page-u40advisor-infou41"
          >
            SETTINGS
          </Link>

          <div className="text-wrapper-89">HOME</div>

          <Link
            className="text-wrapper-90"
            to="/advisor-settings-page-u40advisor-infou41"
          >
            LOG OUT
          </Link>
        </div>

        <div className="overlap-group-9">
          <div className="rectangle-31" />

          <p className="ADVISOR-INFORMATION-2">
            <span className="text-wrapper-91">
              ADVISOR INFORMATION
              <br />
            </span>

            <span className="text-wrapper-92">
              <br />
              NOTIFICATIONS PREFERENCES
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
            </span>
          </p>

          <img
            className="virginia-tech-logo-4"
            alt="Virginia tech logo"
            src="/img/virginia-tech-logo-svg-3-1.png"
          />

          <div className="rectangle-32" />

          <div className="text-wrapper-93">ADVISOR INFORMATION</div>

          <div className="text-wrapper-94">Name</div>

          <div className="text-wrapper-95">Email</div>

          <img className="line-33" alt="Line" src="/img/line-17-1-2.svg" />

          <div className="rectangle-33" />

          <div className="text-wrapper-96">Gale Shapley</div>

          <div className="rectangle-34" />

          <div className="text-wrapper-97">gshapley@vt.edu</div>

          <div className="rectangle-35" />

          <div className="text-wrapper-98">Cancel</div>

          <div className="rectangle-36" />

          <div className="text-wrapper-99">Save Updates</div>
        </div>
      </div>
    </div>
  );
};
