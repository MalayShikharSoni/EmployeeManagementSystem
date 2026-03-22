'use client';

import React from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import styles from "./Footer.module.css";

const Footer: React.FC = () => {
  useGSAP(() => {
    const waveAnimations = [
      { cls: ".w1", scaleY: 0.7, dur: 2 },
      { cls: ".w2", scaleY: 1.3, dur: 5 },
      { cls: ".w3", scaleY: 1.3, dur: 1.5 },
      { cls: ".w4", scaleY: 1.7, dur: 4.6 },
      { cls: ".w5", scaleY: 0.7, dur: 1.5 },
      { cls: ".w6", scaleY: 1.7, dur: 6 },
      { cls: ".w7", scaleY: 1.4, dur: 2.3 },
      { cls: ".w8", scaleY: 1.5, dur: 5 },
      { cls: ".w9", scaleY: 1.2, dur: 5 },
      { cls: ".w10", scaleY: 0.7, dur: 3.3 },
      { cls: ".w11", scaleY: 0.7, dur: 3 },
    ];

    waveAnimations.forEach(({ cls, scaleY, dur }) => {
      gsap.to(cls, { scaleY, duration: dur, ease: "none", repeat: -1, yoyo: true });
    });

    gsap.from(".wavyWork", {
      y: 100,
      duration: 1,
      ease: "back",
      stagger: { each: 0.2, from: "start" },
      scrollTrigger: {
        trigger: ".foooter",
        start: "top bottom",
        markers: false,
        toggleActions: "play reverse play reverse",
      },
    });

    gsap.from(".wavyWave", {
      y: 100,
      duration: 1,
      ease: "back",
      stagger: { each: 0.2, from: "end" },
      scrollTrigger: {
        trigger: ".foooter",
        start: "top bottom",
        markers: false,
        toggleActions: "play reverse play reverse",
      },
    });
  }, []);

  return (
    <>
      <div className={`foooter ${styles.footer}`}>
        <div className={styles.lettersGroup}>
          <Image className={`wavyWork ${styles.letterImgFirst}`} src="/assets/W.svg" alt="" width={60} height={90} />
          <Image className={`wavyWork ${styles.letterImg}`} src="/assets/O.svg" alt="" width={60} height={90} />
          <Image className={`wavyWork ${styles.letterImg}`} src="/assets/R.svg" alt="" width={60} height={90} />
          <Image className={`wavyWork ${styles.letterImg}`} src="/assets/K.svg" alt="" width={60} height={90} />
        </div>

        {/* SPOTIFY LIKE WAVEFORM */}
        <div className={styles.waveformContainer}>
          <div className={`w1 ${styles.waveBar}`} style={{ height: '70px' }}></div>
          <div className={`w2 ${styles.waveBar}`} style={{ height: '100px' }}></div>
          <div className={`w3 ${styles.waveBar}`} style={{ height: '25px' }}></div>
          <div className={`w4 ${styles.waveBar}`} style={{ height: '50px' }}></div>
          <div className={`w5 ${styles.waveBar}`} style={{ height: '70px' }}></div>
          <div className={`w6 ${styles.waveBar}`} style={{ height: '60px' }}></div>
          <div className={`w7 ${styles.waveBarMd}`} style={{ height: '80px' }}></div>
          <div className={`w8 ${styles.waveBar}`} style={{ height: '90px' }}></div>
          <div className={`w9 ${styles.waveBar}`} style={{ height: '20px' }}></div>
          <div className={`w10 ${styles.waveBar}`} style={{ height: '100px' }}></div>
          <div className={`w11 ${styles.waveBar}`} style={{ height: '35px' }}></div>
        </div>

        <div className={styles.lettersGroupRight}>
          <Image className={`wavyWave ${styles.letterImgFirst}`} src="/assets/W.svg" alt="" width={60} height={90} />
          <Image className={`wavyWave ${styles.letterImgNegMargin5}`} src="/assets/A.svg" alt="" width={60} height={90} />
          <Image className={`wavyWave ${styles.letterImgNegMargin7}`} src="/assets/V.svg" alt="" width={60} height={90} />
          <Image className={`wavyWave ${styles.letterImgMargin2}`} src="/assets/E.svg" alt="" width={60} height={90} />
        </div>
      </div>
    </>
  );
};

export default Footer;
