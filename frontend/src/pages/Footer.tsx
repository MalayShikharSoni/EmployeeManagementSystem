import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import React from "react";
import W from "/src/assets/W.svg";
import O from "/src/assets/O.svg";
import R from "/src/assets/R.svg";
import K from "/src/assets/K.svg";
import A from "/src/assets/A.svg";
import V from "/src/assets/V.svg";
import E from "/src/assets/E.svg";
import styles from "./Footer.module.css";

const Footer: React.FC = () => {
  useGSAP(() => {
    gsap.to(".w1", { scaleY: 0.7, duration: 2, ease: "none", repeat: -1, yoyo: true });
    gsap.to(".w2", { scaleY: 1.3, duration: 5, ease: "none", repeat: -1, yoyo: true });
    gsap.to(".w3", { scaleY: 1.3, duration: 1.5, ease: "none", repeat: -1, yoyo: true });
    gsap.to(".w4", { scaleY: 1.7, duration: 4.6, ease: "none", repeat: -1, yoyo: true });
    gsap.to(".w5", { scaleY: 0.7, duration: 1.5, ease: "none", repeat: -1, yoyo: true });
    gsap.to(".w6", { scaleY: 1.7, duration: 6, ease: "none", repeat: -1, yoyo: true });
    gsap.to(".w7", { scaleY: 1.4, duration: 2.3, ease: "none", repeat: -1, yoyo: true });
    gsap.to(".w8", { scaleY: 1.5, duration: 5, ease: "none", repeat: -1, yoyo: true });
    gsap.to(".w9", { scaleY: 1.2, duration: 5, ease: "none", repeat: -1, yoyo: true });
    gsap.to(".w10", { scaleY: 0.7, duration: 3.3, ease: "none", repeat: -1, yoyo: true });
    gsap.to(".w11", { scaleY: 0.7, duration: 3, ease: "none", repeat: -1, yoyo: true });
    gsap.from(".wavyWork", { y: 100, duration: 1, ease: "back", stagger: { each: 0.2, from: "start" }, scrollTrigger: { trigger: ".foooter", start: "top bottom", markers: false, toggleActions: "play reverse play reverse" } });
    gsap.from(".wavyWave", { y: 100, duration: 1, ease: "back", stagger: { each: 0.2, from: "end" }, scrollTrigger: { trigger: ".foooter", start: "top bottom", toggleActions: "play reverse play reverse" } });
  }, []);

  return (
    <>
      <div className={`foooter ${styles.footer}`}>
        <div className={styles.workLetters}>
          <img className={`wavyWork ${styles.letterImg} ${styles.letterImgFirst}`} src={W} alt="" />
          <img className={`wavyWork ${styles.letterImg}`} src={O} alt="" />
          <img className={`wavyWork ${styles.letterImg}`} src={R} alt="" />
          <img className={`wavyWork ${styles.letterImg}`} src={K} alt="" />
        </div>
        <div className={styles.barsContainer}>
          <div className={`w1 ${styles.bar}`} style={{ height: '70px' }}></div>
          <div className={`w2 ${styles.bar}`} style={{ height: '100px' }}></div>
          <div className={`w3 ${styles.bar}`} style={{ height: '25px' }}></div>
          <div className={`w4 ${styles.bar}`} style={{ height: '50px' }}></div>
          <div className={`w5 ${styles.bar}`} style={{ height: '70px' }}></div>
          <div className={`w6 ${styles.bar}`} style={{ height: '60px' }}></div>
          <div className={`w7 ${styles.bar} ${styles.barRoundMd}`} style={{ height: '80px' }}></div>
          <div className={`w8 ${styles.bar}`} style={{ height: '90px' }}></div>
          <div className={`w9 ${styles.bar}`} style={{ height: '20px' }}></div>
          <div className={`w10 ${styles.bar}`} style={{ height: '100px' }}></div>
          <div className={`w11 ${styles.bar}`} style={{ height: '35px' }}></div>
        </div>
        <div className={styles.waveLetters}>
          <img className={`wavyWave ${styles.letterImg} ${styles.letterImgFirst}`} src={W} alt="" />
          <img className={`wavyWave ${styles.letterImg} ${styles.waveA}`} src={A} alt="" />
          <img className={`wavyWave ${styles.letterImg} ${styles.waveV}`} src={V} alt="" />
          <img className={`wavyWave ${styles.letterImg} ${styles.waveE}`} src={E} alt="" />
        </div>
      </div>
    </>
  );
};

export default Footer;
