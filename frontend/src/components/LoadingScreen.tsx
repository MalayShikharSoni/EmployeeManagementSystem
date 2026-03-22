'use client';

import React from "react";
import Image from "next/image";
import styles from "./LoadingScreen.module.css";

const LoadingScreen: React.FC = () => {
  return (
    <>
      <div className={`loading-screen ${styles.loadingScreen}`}>
        <div className={styles.logoContainer}>
          <Image src="/assets/WorkWaveLogo1.svg" alt="1" width={200} height={250} className={`logo1 ${styles.logo1}`} />
          <Image src="/assets/WorkWaveLogo2.svg" alt="2" width={200} height={250} className={`logo2 ${styles.logo2}`} />
          <Image src="/assets/WorkWaveLogo6.svg" alt="3" width={180} height={225} className={`logo3 ${styles.logo3}`} />
          <Image src="/assets/WorkWaveLogo5.svg" alt="4" width={146} height={182} className={`logo4 ${styles.logo4}`} />
          <Image src="/assets/WorkWaveLogo4.svg" alt="5" width={102} height={127} className={`logo5 ${styles.logo5}`} />
          <Image src="/assets/WorkWaveLogo3.svg" alt="6" width={61} height={76} className={`logo6 ${styles.logo}`} />
        </div>
      </div>
    </>
  );
};

export default LoadingScreen;
