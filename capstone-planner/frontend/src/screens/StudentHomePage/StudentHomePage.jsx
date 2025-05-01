import React, { useEffect } from "react";
import { StudentNavbar } from "../../components/StudentNavbar";
import { Calendar } from "../../components/Calendar";
import { TaskList } from "../../components/TaskList";
import "./style.css";

export const StudentHomePage = () => {

  useEffect(() => {
    // Disable scrolling when this component mounts
    document.body.style.overflow = "hidden";

    return () => {
      // Re-enable scrolling when the component unmounts
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="student-home-page">
      <div className="div-6">
        <StudentNavbar />

          <div className="group-container">
  
              <Calendar />

            <div className="task-list-container">
              
              <TaskList />

            </div>
        
          </div>
      </div>
    </div>
  );
};
