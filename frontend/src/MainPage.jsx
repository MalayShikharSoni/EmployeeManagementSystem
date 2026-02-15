import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import Login from "./components/Auth/Login";
import EmployeeDashboard from "./components/Dashboard/EmployeeDashboard";
import AdminDashboard from "./components/Dashboard/AdminDashboard";
import { AuthContext } from "./context/AuthProvider";
import { setLocalStorage } from "../utils/LocalStorage";

const MainPage = () => {
  const { userData, isLoading, isAuthenticated, setUserData } = useContext(AuthContext);

  // Initialize demo data for development (temporary - will be removed later)
  React.useEffect(() => {
    if (!localStorage.getItem("employees")) {
      setLocalStorage();
    }
  }, []);

  // Show loading screen while checking authentication
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

  // Not authenticated - show login
  if (!isAuthenticated) {
    return <Login />;
  }

  // Authenticated - show dashboard based on role
  if (userData?.role === "admin") {
    return (
      <AdminDashboard
        setUserData={setUserData}
        data={userData.data}
        changeUser={() => {}} // Will be handled by logout in Header
      />
    );
  }

  // Employee dashboard
  return (
    <EmployeeDashboard
      setUserData={setUserData}
      data={userData.data}
      user={userData.data.email}
      changeUser={() => {}} // Will be handled by logout in Header
      setLoggedInUserData={() => {}} // Will be handled by API calls
    />
  );
};

export default MainPage;