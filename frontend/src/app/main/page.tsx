'use client';

import React, { useContext } from "react";
import { redirect } from "next/navigation";
import { AuthContext } from "@/context/AuthProvider";
import styles from "@/components/LandingPage.module.css";

const MainPage: React.FC = () => {
  const { userData, isLoading, isAuthenticated } = useContext(AuthContext);

  if (isLoading) {
    return (
      <div className={styles.mainLoading}>
        <div className={styles.mainLoadingCenter}>
          <div className={styles.mainSpinner}></div>
          <p className={styles.mainLoadingText}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    redirect("/login");
  }

  if (userData?.role === "admin") {
    redirect("/admin-dashboard");
  }

  redirect("/employee-dashboard");
};

export default function MainPageRoute() {
  return <MainPage />;
}
