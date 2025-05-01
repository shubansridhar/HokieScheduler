import React, { useEffect } from "react";
import { Calendar } from "../../components/Calendar";
import { StudentNavbar } from "../../components/StudentNavbar";
import "./style.css";

export const StudentCalendar = () => {

  useEffect(() => {
    // Disable scrolling when this component mounts
    document.body.style.overflow = "hidden";

    return () => {
      // Re-enable scrolling when the component unmounts
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="student-calendar">
      <div className="div-5">
        <StudentNavbar />

        <Calendar/>
      
      </div>
    </div>
  );
};