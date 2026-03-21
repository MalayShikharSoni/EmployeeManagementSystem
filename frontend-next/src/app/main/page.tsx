'use client';

import React, { useContext } from "react";
import { redirect } from "next/navigation";
import { AuthContext } from "@/context/AuthProvider";

const MainPage: React.FC = () => {
  const { userData, isLoading, isAuthenticated } = useContext(AuthContext);

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
