import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { LoginPage } from "./screens/LoginPage/LoginPage";
import { StudentAdvisorInfo } from "./screens/StudentSettings/StudentAdvisorInfo";
import { StudentCalendar } from "./screens/StudentCalendar";
import { StudentHomePage } from "./screens/StudentHomePage";
import { StudentImportSchedule } from "./screens/StudentImportSchedule";
import { StudentInformation } from "./screens/StudentSettings/StudentInformation";
import { StudentNotificationPreferences } from "./screens/StudentSettings/StudentNotificationPreferences";


const router = createBrowserRouter([
  {
    path: "/*",
    element: <LoginPage />,
  },

  {
    path: "/login-page",
    element: <LoginPage />,
  },

  {
    path: "/student-calendar",
    element: <StudentCalendar />,
  },

  {
    path: "/student-home-page",
    element: <StudentHomePage />,
  },
  
  {
    path: "/student-schedule-importing",
    element: <StudentImportSchedule />,
  },
  
  {
    path: "/student-settings-page-notifications",
    element: <StudentNotificationPreferences />,
  },

  {
    path: "/student-settings-page-student-info",
    element: <StudentInformation />,
  },
 
  {
    path: "/student-settings-page-advisor-info",
    element: <StudentAdvisorInfo />,
  },

]);

export const App = () => {
  return <RouterProvider router={router} />;
};
