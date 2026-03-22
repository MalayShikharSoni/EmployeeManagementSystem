'use client';

import React, { useContext } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthProvider";
import styles from "./HeaderUser.module.css";

interface HeaderUserProps {
  data?: { firstname?: string; first_name?: string };
  changeUser?: () => void;
  user?: string;
  firstWaveRef?: React.RefObject<HTMLDivElement | null>;
  thirdWaveRef?: React.RefObject<HTMLDivElement | null>;
}

const HeaderUser: React.FC<HeaderUserProps> = ({ data, firstWaveRef, thirdWaveRef }) => {
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
    <>
      <div className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.logoWrap}>
            <Image src="/assets/WorkWaveLogoBlack.svg" alt="" width={120} height={48} className={styles.logoImg} />
          </div>

          <div className={styles.welcomeText}>
            Welcome, {data?.firstname || data?.first_name}
          </div>

          <div className={styles.spacer}></div>

          <div className={styles.logoutWrap} onClick={LogOutUser}>
            <Image src="/assets/LogOutBlack.svg" alt="" width={64} height={64} className={styles.logoutImg} />
          </div>

          <div className={styles.headerLine}></div>

          <div ref={firstWaveRef} className={styles.wave1}>
            <Image src="/assets/HeaderWave1Black.svg" alt="" width={150} height={40} className={styles.waveImg} />
          </div>
          <div className={styles.wave2}>
            <Image src="/assets/HeaderWave2Black.svg" alt="" width={150} height={70} className={styles.waveImg} />
          </div>
          <div ref={thirdWaveRef} className={styles.wave3}>
            <Image src="/assets/HeaderWave3Black.svg" alt="" width={150} height={40} className={styles.waveImg} />
          </div>
        </div>
      </div>
    </>
  );
};

export default HeaderUser;
