'use client';

import React, { useContext } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthProvider";
import styles from "./Header.module.css";

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
    <div className={styles.header}>
      <h1 className={styles.greeting}>
        Hello <br />
        <span className={styles.name}>
          {data.firstname || data.first_name} 👋
        </span>
      </h1>
      <button
        className={styles.logoutBtn}
        onClick={LogOutUser}
      >
        Log out
      </button>
    </div>
  );
};

export default Header;
