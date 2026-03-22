'use client';

import React from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./HeaderHomePage.module.css";

interface HeaderHomePageProps {
  firstWaveRef?: React.RefObject<HTMLDivElement | null>;
  thirdWaveRef?: React.RefObject<HTMLDivElement | null>;
}

const HeaderHomePage: React.FC<HeaderHomePageProps> = ({ firstWaveRef, thirdWaveRef }) => {
  return (
    <>
      <div className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.logoWrap}>
            <Image src="/assets/WorkWaveLogo.svg" alt="" width={120} height={48} className={styles.logoImg} />
          </div>

          <Link href="/main" className={styles.loginLink}>
            <div className={styles.loginWrap}>
              <Image src="/assets/LogIn.svg" alt="" width={64} height={64} className={styles.logoImg} />
            </div>
          </Link>

          <div className={styles.headerLine}></div>

          <div ref={firstWaveRef} className={styles.wave1}>
            <Image src="/assets/HeaderWave1.svg" alt="" width={150} height={40} className={styles.waveImg} />
          </div>
          <div className={styles.wave2}>
            <Image src="/assets/HeaderWave2.svg" alt="" width={150} height={70} className={styles.waveImg} />
          </div>
          <div ref={thirdWaveRef} className={styles.wave3}>
            <Image src="/assets/HeaderWave3.svg" alt="" width={150} height={40} className={styles.waveImg} />
          </div>
        </div>
      </div>
    </>
  );
};

export default HeaderHomePage;
