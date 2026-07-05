import React, { useState, useMemo } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import MainPage from "./MainPage";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import AdminDashboard from "./components/Dashboard/AdminDashboard";
import EmployeeDashboard from "./components/Dashboard/EmployeeDashboard";
import ProfilePage from "./pages/ProfilePage";
import EmployeeProfilePage from "./pages/EmployeeProfilePage";
import LeaderboardPage from "./pages/LeaderboardPage";
import ProjectGroupsPage from "./pages/ProjectGroupsPage";
import GroupDetailPage from "./pages/GroupDetailPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import TVStaticEffect from "./pages/TVStaticEffect";
import CustomCursor from "./components/CustomCursor";
import Footer from "./pages/Footer";
import styles from "./App.module.css";

const App: React.FC = () => {
  const [xAxis, setXAxis] = useState(0);
  const [yAxis, setYAxis] = useState(0);

  // Memoize cursor props
  const cursorProps = useMemo(() => ({ x: xAxis, y: yAxis }), [xAxis, yAxis]);

  return (
    <BrowserRouter>
      <CustomCursor {...cursorProps} />
      <div
        onMouseMove={(e: React.MouseEvent<HTMLDivElement>) => {
          setXAxis(e.clientX);
          setYAxis(e.clientY);
        }}
        className={`${styles.appContainer} appContainer`}
      >
        <Routes>
          {/* Public Routes */}
          <Route path="/" Component={LandingPage} />
          <Route path="/login" Component={Login} />
          <Route path="/signup" Component={Signup} />
          
          {/* Main route - handles auth internally */}
          <Route path="/main" Component={MainPage} />

          {/* Protected Routes - use Component prop */}
          <Route path="/admin-dashboard" Component={AdminDashboard} />
          <Route path="/employee-dashboard" Component={EmployeeDashboard} />
          <Route path="/profile" Component={ProfilePage} />
          <Route path="/employees/:id" Component={EmployeeProfilePage} />
          <Route path="/leaderboard" Component={LeaderboardPage} />
          <Route path="/groups" Component={ProjectGroupsPage} />
          <Route path="/groups/:groupId" Component={GroupDetailPage} />
          <Route path="/analytics" Component={AnalyticsPage} />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <Footer />
      </div>
      <TVStaticEffect />
    </BrowserRouter>
  );
};

export default App;
