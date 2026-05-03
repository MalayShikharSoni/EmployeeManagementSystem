import React from "react";
import { Link } from "react-router-dom";
import WorkWaveLogo from "../assets/WorkWaveLogo.svg";
import LogIn from "/src/assets/LogIn.svg";
import HeaderWave1 from "../assets/HeaderWave1.svg";
import HeaderWave2 from "../assets/HeaderWave2.svg";
import HeaderWave3 from "../assets/HeaderWave3.svg";
import styles from "./HeaderHomePage.module.css";

interface HeaderHomePageProps {
  firstWaveRef?: React.RefObject<HTMLDivElement | null>;
  thirdWaveRef?: React.RefObject<HTMLDivElement | null>;
}

const HeaderHomePage = React.forwardRef<unknown, HeaderHomePageProps>((props, ref) => {
  const refObj = ref as unknown as { firstWaveRef?: React.RefObject<HTMLDivElement | null>; thirdWaveRef?: React.RefObject<HTMLDivElement | null> } | null;
  const firstWaveRef = props.firstWaveRef || refObj?.firstWaveRef;
  const thirdWaveRef = props.thirdWaveRef || refObj?.thirdWaveRef;

  return (
    <>
      <div className={styles.header} style={{ mixBlendMode: "difference" }}>
        <div className={styles.headerInner}>
          <div className={styles.logoWrap}>
            <img src={WorkWaveLogo} alt="" className={styles.logoImg} />
          </div>
          <Link to="/main" className={styles.loginWrap}>
            <div className={styles.loginInner}>
              <img src={LogIn} alt="" className={styles.loginImg} />
            </div>
          </Link>
          <div className={styles.headerLine}></div>
          <div ref={firstWaveRef as React.Ref<HTMLDivElement>} className={`${styles.wave} ${styles.wave1}`}>
            <img src={HeaderWave1} alt="" className={styles.waveImg1} />
          </div>
          <div className={`${styles.wave} ${styles.wave2}`}>
            <img src={HeaderWave2} alt="" className={styles.waveImg2} />
          </div>
          <div ref={thirdWaveRef as React.Ref<HTMLDivElement>} className={`${styles.wave} ${styles.wave3}`}>
            <img src={HeaderWave3} alt="" className={styles.waveImg1} />
          </div>
        </div>
      </div>
    </>
  );
});
HeaderHomePage.displayName = 'HeaderHomePage';
export default HeaderHomePage;
