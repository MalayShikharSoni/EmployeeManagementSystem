import React, { useContext, memo, useCallback } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext, type AuthContextType } from "./context/AuthProvider";
import styles from "./MainPage.module.css";

const MainPage = memo(() => {
  const { userData, isLoading, isAuthenticated } = useContext(AuthContext) as AuthContextType;

  const changeUser = useCallback(() => {}, []);

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingContent}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Loading...</p>
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
