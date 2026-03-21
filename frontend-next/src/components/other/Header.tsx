'use client';

import React, { useContext } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthProvider";

interface HeaderProps {
  data: { firstname?: string; first_name?: string };
}

const Header: React.FC<HeaderProps> = ({ data }) => {
  const { logout } = useContext(AuthContext);
  const router = useRouter();

  const LogOutUser = async () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      await logout();
      router.push("/login");
    }
  };

  return (
    <div className="bg-[#cec0ad] flex items-center justify-between px-5 py-2">
      <h1 className="bg-[#cec0ad] text-2xl font-medium">
        Hello <br />
        <span className="bg-[#cec0ad] text-3xl font-semibold">
          {data.firstname || data.first_name} 👋
        </span>
      </h1>
      <button
        className="h-8 px-2 py-5 flex items-center justify-center bg-red-500 text-lg text-white rounded-sm hover:bg-red-600 transition-colors"
        onClick={LogOutUser}
      >
        Log out
      </button>
    </div>
  );
};

export default Header;
