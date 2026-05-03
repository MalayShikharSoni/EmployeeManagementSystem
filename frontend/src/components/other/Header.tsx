import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext, type AuthContextType } from "../../context/AuthProvider";
import type { User } from "../../types";
import styles from "./Header.module.css";

interface HeaderProps {
  data: User;
}

const Header: React.FC<HeaderProps> = (props) => {
  const { logout } = useContext(AuthContext) as AuthContextType;
  const navigate = useNavigate();

  const LogOutUser = async () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) { await logout(); navigate("/login", { replace: true }); }
  };

  return (
    <div className={styles.header}>
      <h1 className={styles.greeting}>
        Hello <br />
        <span className={styles.name}>
          {props.data.firstName || props.data.first_name} 👋
        </span>
      </h1>
      <button className={styles.logoutButton} onClick={LogOutUser}>
        Log out
      </button>
    </div>
  );
};

export default Header;
