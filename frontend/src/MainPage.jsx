import React, { useContext, memo, useCallback } from "react";
import { Navigate } from "react-router-dom";
import Login from "./components/Auth/Login";
import EmployeeDashboard from "./components/Dashboard/EmployeeDashboard";
import AdminDashboard from "./components/Dashboard/AdminDashboard";
import { AuthContext } from "./context/AuthProvider";

const MainPage = memo(() => {
  const { userData, isLoading, isAuthenticated } = useContext(AuthContext);



  const changeUser = useCallback(() => {}, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#cec0ad]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#ad9676] mb-4"></div>
          <p className="text-2xl font-semibold text-[#8b6c3e]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (userData?.role === "admin") {
    return <Navigate to="/admin-dashboard" replace />;
  }

  return <Navigate to="/employee-dashboard" replace />;
});

MainPage.displayName = 'MainPage';

export default MainPage;