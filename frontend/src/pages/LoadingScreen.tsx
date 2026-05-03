import React from "react";
import WorkWaveLogo1 from "/src/assets/WorkWaveLogo1.svg";
import WorkWaveLogo2 from "/src/assets/WorkWaveLogo2.svg";
import WorkWaveLogo3 from "/src/assets/WorkWaveLogo3.svg";
import WorkWaveLogo4 from "/src/assets/WorkWaveLogo4.svg";
import WorkWaveLogo5 from "/src/assets/WorkWaveLogo5.svg";
import WorkWaveLogo6 from "/src/assets/WorkWaveLogo6.svg";
import styles from "./LoadingScreen.module.css";

const LoadingScreen: React.FC = () => {
  return (
    <>
      <div className={`loading-screen ${styles.loadingScreen}`}>
        <div className={`logo-container ${styles.logoContainer}`}>
          <img src={WorkWaveLogo1} alt="1" className={`logo1 ${styles.logoImg} ${styles.logo1}`} />
          <img src={WorkWaveLogo2} alt="2" className={`logo2 ${styles.logoImg} ${styles.logo2}`} />
          <img src={WorkWaveLogo6} alt="3" className={`logo3 ${styles.logoImg} ${styles.logo3}`} />
          <img src={WorkWaveLogo5} alt="4" className={`logo4 ${styles.logoImg} ${styles.logo4}`} />
          <img src={WorkWaveLogo4} alt="5" className={`logo5 ${styles.logoImg} ${styles.logo5}`} />
          <img src={WorkWaveLogo3} alt="6" className={`logo6 ${styles.logoImg} ${styles.logo6}`} />
        </div>
      </div>
    </>
  );
};

export default LoadingScreen;
