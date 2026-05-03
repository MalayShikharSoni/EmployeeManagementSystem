import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext, type AuthContextType } from "../context/AuthProvider";
import WorkWaveLogoBlack from "../assets/WorkWaveLogoBlack.svg";
import LogOutBlack from "../assets/LogOutBlack.svg";
import HeaderWave1Black from "../assets/HeaderWave1Black.svg";
import HeaderWave2Black from "../assets/HeaderWave2Black.svg";
import HeaderWave3Black from "../assets/HeaderWave3Black.svg";
import type { User } from "../types";
import styles from "./HeaderUser.module.css";

interface HeaderUserProps {
  data: User;
  changeUser?: () => void;
  user?: string;
  firstWaveRef?: React.RefObject<HTMLDivElement | null>;
  thirdWaveRef?: React.RefObject<HTMLDivElement | null>;
}

const HeaderUser = React.forwardRef<unknown, HeaderUserProps>((props, ref) => {
  // Support both ref-as-object (legacy) and explicit props patterns
  const refObj = ref as unknown as { firstWaveRef?: React.RefObject<HTMLDivElement | null>; thirdWaveRef?: React.RefObject<HTMLDivElement | null> } | null;
  const firstWaveRef = props.firstWaveRef || refObj?.firstWaveRef;
  const thirdWaveRef = props.thirdWaveRef || refObj?.thirdWaveRef;
  const { logout } = useContext(AuthContext) as AuthContextType;
  const navigate = useNavigate();

  const LogOutUser = async () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) { await logout(); navigate("/login", { replace: true }); }
  };

  return (
    <>
      <div className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.logoWrap}>
            <img src={WorkWaveLogoBlack} alt="" className={styles.logoImg} />
          </div>
          <div className={styles.welcomeText}>
            Welcome, {props.data.firstName || props.data.first_name}
          </div>
          <div className={styles.spacer}></div>
          <div className={styles.logoutWrap} onClick={LogOutUser}>
            <img src={LogOutBlack} alt="" className={styles.logoutImg} />
          </div>
          <div className={styles.headerLine}></div>
          <div ref={firstWaveRef as React.Ref<HTMLDivElement>} className={`${styles.wave} ${styles.wave1}`}>
            <img src={HeaderWave1Black} alt="" className={styles.waveImg1} />
          </div>
          <div className={`${styles.wave} ${styles.wave2}`}>
            <img src={HeaderWave2Black} alt="" className={styles.waveImg2} />
          </div>
          <div ref={thirdWaveRef as React.Ref<HTMLDivElement>} className={`${styles.wave} ${styles.wave3}`}>
            <img src={HeaderWave3Black} alt="" className={styles.waveImg1} />
          </div>
        </div>
      </div>
    </>
  );
});
HeaderUser.displayName = 'HeaderUser';
export default HeaderUser;
