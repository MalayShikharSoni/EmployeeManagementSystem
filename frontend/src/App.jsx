import React, { useContext, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import MainPage from "./MainPage";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import AdminDashboard from "./components/Dashboard/AdminDashboard";
import EmployeeDashboard from "./components/Dashboard/EmployeeDashboard";
import TVStaticEffect from "./pages/TVStaticEffect";
import CustomCursor from "./components/CustomCursor";
import Footer from "./pages/Footer";
import { AuthContext } from "./context/AuthProvider";

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, userData, isLoading } = useContext(AuthContext);

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

  if (requiredRole && userData?.role !== requiredRole) {
    // Redirect to correct dashboard based on actual role
    if (userData?.role === "admin") {
      return <Navigate to="/admin-dashboard" replace />;
    }
    return <Navigate to="/employee-dashboard" replace />;
  }

  return children;
};

const App = () => {
  const [xAxis, setXAxis] = useState(0);
  const [yAxis, setYAxis] = useState(0);
  const { setUserData } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <CustomCursor x={xAxis} y={yAxis} />
      <div
        onMouseMove={(e) => {
          setXAxis(e.clientX);
          setYAxis(e.clientY);
        }}
        className="relative appContainer"
      >
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Legacy route - redirect to login */}
          <Route path="/main" element={<Navigate to="/login" replace />} />

          {/* Protected Routes */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard
                  setUserData={setUserData}
                  data={useContext(AuthContext).userData?.data}
                  changeUser={() => {}}
                />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/employee-dashboard"
            element={
              <ProtectedRoute requiredRole="employee">
                <EmployeeDashboard
                  setUserData={setUserData}
                  data={useContext(AuthContext).userData?.data}
                  user={useContext(AuthContext).userData?.data?.email}
                  changeUser={() => {}}
                  setLoggedInUserData={() => {}}
                />
              </ProtectedRoute>
            }
          />

          {/* Catch all - redirect to landing page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <Footer />
      </div>
      <TVStaticEffect />
    </BrowserRouter>
  );
};

export default App;