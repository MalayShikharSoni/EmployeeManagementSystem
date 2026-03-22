'use client';

import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import LoadingScreen from "@/components/LoadingScreen";
import HeaderHomePage from "@/components/HeaderHomePage";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./LandingPage.module.css";

gsap.registerPlugin(ScrollTrigger);

const LandingPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const pageRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const pathRef2 = useRef<SVGPathElement>(null);
  const firstWaveRef = useRef<HTMLDivElement>(null);
  const thirdWaveRef = useRef<HTMLDivElement>(null);
  const horizontalWaveRef = useRef<SVGPathElement>(null);

  useGSAP(() => {
    const tl1 = gsap.timeline();
    const tl2 = gsap.timeline();
    const tl3 = gsap.timeline();
    const tl4 = gsap.timeline();
    const tl5 = gsap.timeline();
    const tl6 = gsap.timeline();
    const tl7 = gsap.timeline();

    tl1.from(".logo6", { x: -1000, duration: 1.4, scale: 0, opacity: 0, ease: "back.out" });
    tl2.from(".logo5", { x: -1000, duration: 1.4, delay: 0.1, scale: 0, opacity: 0, ease: "back.out" });
    tl3.from(".logo4", { x: -1000, duration: 1.4, delay: 0.2, scale: 0, opacity: 0, ease: "back.out" });
    tl4.from(".logo3", { x: -1000, duration: 1.4, delay: 0.3, scale: 0, opacity: 0, ease: "back.out" });
    tl5.from(".logo2", { x: -1000, duration: 1.4, delay: 0.4, scale: 0, opacity: 0, ease: "back.out" });
    tl6.from(".logo1", { x: -1000, duration: 1.4, delay: 0.5, scale: 0, opacity: 0, ease: "back.out" });

    tl6.to(".logo-container", {
      y: "-42vh", x: "-44vw", scale: 0.2, opacity: 0, duration: 0.7,
      onComplete: () => {
        setLoading(false);
        window.dispatchEvent(new Event("resize"));
        gsap.to(pageRef.current, { opacity: 1, duration: 1.2, ease: "power2.out" });
        gsap.to(".landing-page", { opacity: 1, duration: 1.2, ease: "power2.out" });
      },
    });
    tl6.to(".loading-screen", { opacity: 0, duration: 1, ease: "power2.out" });

    tl7.from(".WORK", { x: -100, duration: 1, ease: "sine" });
    tl7.from(".WAVE", { x: 100, duration: 1, ease: "sine" }, "-=1");
    tl7.from(".blackbox", { opacity: 0, duration: 0.5, scale: 0.9, ease: "sine" });

    const path = pathRef.current;
    const path2 = pathRef2.current;
    if (path && path2) {
      const pathLength = path.getTotalLength();
      const pathLength2 = path2.getTotalLength();

      gsap.set(path, { strokeDasharray: pathLength, strokeDashoffset: pathLength });
      gsap.set(path2, { strokeDasharray: pathLength2, strokeDashoffset: pathLength2 });
      gsap.to(path, { strokeDashoffset: "0", duration: 2, repeat: -1 });
      gsap.to(path, { duration: 2, opacity: 0, stagger: 0.3, repeat: -1 });
      gsap.to(path2, { strokeDashoffset: "0", duration: 2, repeat: -1 });
      gsap.to(path2, { duration: 2, opacity: 0, stagger: 0.3, repeat: -1 });
    }

    if (firstWaveRef.current && thirdWaveRef.current) {
      gsap.fromTo(firstWaveRef.current, { x: 0 }, { x: "-40vw", ease: "none", scrollTrigger: { trigger: ".mainLandingPage", start: "top top", end: "bottom top", scrub: 1 } });
      gsap.fromTo(thirdWaveRef.current, { x: 0 }, { x: "42.5vw", ease: "none", scrollTrigger: { trigger: ".mainLandingPage", start: "top top", end: "bottom top", scrub: 1, markers: false } });
    }

    gsap.to(".marque", { x: "-111vw", repeat: -1, duration: 8, ease: "none" });

    gsap.to(".scrollContainer", {
      x: "-200vw", duration: 5, ease: "none",
      scrollTrigger: { scroller: "html", trigger: ".wrapper", start: "top top", pin: true, scrub: 1 },
    });

    if (horizontalWaveRef.current) {
      const horizontalWaveLength = horizontalWaveRef.current.getTotalLength();
      gsap.set(".horizontalWavePath", { strokeDasharray: horizontalWaveLength });
      gsap.fromTo(".horizontalWavePath", { strokeDashoffset: horizontalWaveLength }, { strokeDashoffset: 0, delay: 5, scrollTrigger: { trigger: ".scrollContainer", scrub: 5, start: "top left", markers: false } });
    }

    gsap.from(".part1Text", { opacity: 0, y: 10, stagger: 0.2, duration: 1, scrollTrigger: { trigger: ".part1Text", markers: false } });
    gsap.from(".part1SVG", { opacity: 0, duration: 2, scrollTrigger: { trigger: ".part1SVG" } });
    gsap.from(".part2SVG", { opacity: 0, duration: 2, scrollTrigger: { trigger: ".part2Text", start: "top left" } });
    gsap.from(".part2Points", { x: -30, opacity: 0, stagger: 0.2, duration: 1, scrollTrigger: { trigger: ".part2Text", markers: false, start: "top top" } });
    gsap.from(".part2Text", { y: 50, opacity: 0, duration: 1, stagger: 0.2, scrollTrigger: { trigger: ".part2Text", markers: false, start: "top left" } });
    gsap.from(".popup", { scale: 0, x: "-250px", y: "-200px", duration: 0.6, scrollTrigger: { trigger: ".part2Text", markers: false, start: "top left" } });
    gsap.from(".circle", { scale: 0, ease: "back", duration: 0.6, delay: 0.6, scrollTrigger: { trigger: ".part2Text", markers: false, start: "top left" } });
    gsap.to(".circle", { y: "37.5vh", ease: "bounce", stagger: 0.2, duration: 1.8, delay: 1.6, scrollTrigger: { trigger: ".part2Text", markers: false, start: "top left" } });
    gsap.from(".popupText", { opacity: 0, duration: 0.6, delay: 2.1, scrollTrigger: { trigger: ".part2Text", markers: false, start: "top left", end: "top left" } });
    gsap.to(".circle1", { x: "50vw", ease: "back.inOut", duration: 3.5, backgroundColor: "#ad9676", scrollTrigger: { trigger: ".part3", markers: false, start: "right-=230px left" } });
    gsap.to(".circle2", { x: "75vw", ease: "back.inOut", duration: 3.5, backgroundColor: "#ad9676", scrollTrigger: { trigger: ".part3", markers: false, start: "right-=230px left" } });
    gsap.to(".circle3", { x: "100vw", ease: "back.inOut", duration: 3.5, backgroundColor: "#ad9676", scrollTrigger: { trigger: ".part3", markers: false, start: "right-=230px left" } });
    gsap.from(".flatlineCircle", { scale: 0.9, duration: 5, yoyo: true, repeat: -1, ease: "sine" });
    gsap.from(".getStartedDivs", { x: -50, opacity: 0, duration: 1, delay: 0.2, stagger: 0.1, ease: "back", scrollTrigger: { trigger: ".part4", markers: false, start: "top 80%" } });
  }, []);

  const BarSVG = ({ className }: { className?: string }) => (
    <svg className={`${className} ${styles.barSvg}`} width="20" height="auto" viewBox="0 0 349 520" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 123V407M170.5 24V249.5V496M324.5 123V407" stroke="#FF4902" strokeWidth="48" strokeLinecap="round" />
    </svg>
  );

  const BarSVGBrown = ({ className }: { className?: string }) => (
    <svg className={`${className} ${styles.barSvg}`} width="20" height="auto" viewBox="0 0 349 520" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 123V407M170.5 24V249.5V496M324.5 123V407" stroke="#a58c68" strokeWidth="48" strokeLinecap="round" />
    </svg>
  );

  return (
    <div className="mainLandingPage">
      {loading && <LoadingScreen />}

      <div ref={pageRef} className={`landing-page ${styles.landingPage}`}>
        <HeaderHomePage firstWaveRef={firstWaveRef} thirdWaveRef={thirdWaveRef} />

        <div className={styles.heroSection}>
          <div className={`WORK ${styles.workWrap}`}>
            <Image src="/assets/WORK.svg" alt="WORK" width={800} height={200} className={styles.heroImg} style={{ height: '20vh', width: 'auto' }} />
          </div>
          <div className={`WAVE ${styles.waveWrap}`}>
            <Image src="/assets/WAVE.svg" alt="WAVE" width={800} height={200} className={styles.heroImg} style={{ height: '20vh', width: 'auto' }} />
          </div>

          <div className={`blackbox ${styles.blackBox}`}>
            <div className={styles.heartbeatBox}>
              <div className={styles.heartbeatInner}>
                <svg className={styles.heartbeatSvg} viewBox="10 0 450 200" xmlns="http://www.w3.org/2000/svg">
                  <path ref={pathRef} d="M 10 100 L 100 100 L 120 50 L 140 150 L 160 100 L 300 100 L 320 50 L 340 150 L 360 100 L 490 100" stroke="white" strokeWidth="9" fill="none" />
                </svg>
              </div>
            </div>

            <div className={styles.marqueeContainer}>
              {["EFFICIENT AMPLITUDE", "PRODUCTIVE PHASE", "FLAWLESS FREQUENCY", "EFFICIENT AMPLITUDE", "PRODUCTIVE PHASE"].map((text, i) => (
                <React.Fragment key={i}>
                  <div className={`marque ${styles.marqueeItem}`}>{text}</div>
                  <div className={`marque ${styles.marqueeWaveform}`}>
                    <Image src="/assets/Waveform.svg" alt="Waveform" width={100} height={50} className={styles.waveformImg} style={{ height: '7vh', width: 'auto' }} />
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* HORIZONTAL SCROLL SECTION */}
      <div className={`wrapper ${styles.wrapper}`}>
        <div className={`scrollContainer ${styles.scrollContainer}`}>
          <svg className={`horizontalWave ${styles.horizontalWaveSvg}`} viewBox="0 0 6000 1000" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path strokeWidth="12" d="M308 694.39H361.805C362.223 694.39 362.597 694.13 362.742 693.738L378.672 650.92C378.915 650.267 378.432 649.572 377.735 649.572H321.49C320.807 649.572 320.325 648.902 320.541 648.254L335.123 604.683C335.259 604.275 335.641 604 336.071 604H394.351H410.985C411.308 604 411.611 604.156 411.799 604.419L444.5 650.182M444.5 650.182L459 604M444.5 650.182L431.877 693.108C431.689 693.748 432.169 694.39 432.836 694.39H463.669H517.474C517.892 694.39 518.266 694.13 518.412 693.738L534.341 650.92C534.584 650.267 534.101 649.572 533.404 649.572H477.159C476.476 649.572 475.994 648.902 476.211 648.254L490.792 604.683C490.928 604.275 491.31 604 491.74 604H550.02H587.26M587.26 604H624.5H639.143M587.26 604L559.5 694.39M639.143 604H703.433M639.143 604C638.703 604 638.315 604.287 638.187 604.708L624.503 649.5M624.503 649.5L610.998 693.708C610.802 694.35 611.283 695 611.955 695H680.598M624.503 649.5H727.385M841.187 695L809.36 605.925C809.08 605.141 808.022 605.022 807.575 605.724L777.014 653.733C776.618 654.356 775.707 654.349 775.319 653.721L745.701 605.728C745.266 605.022 744.209 605.123 743.915 605.898L727.385 649.5M710.134 695L727.385 649.5" stroke="black" strokeLinecap="round" />
            <path className="horizontalWavePath" ref={horizontalWaveRef} strokeWidth="12" d="M443.851 430.5L460.588 386.355C460.836 385.7 460.353 385 459.653 385H405.726C405.296 385 404.915 385.275 404.778 385.682L375.679 472.419C375.352 473.392 373.947 473.301 373.749 472.293L357.334 388.707C357.137 387.699 355.732 387.608 355.405 388.581L326.306 475.318C326.169 475.725 325.788 476 325.358 476H290.247C289.849 476 289.488 475.763 289.33 475.398L270.12 431.102C269.961 430.737 269.601 430.5 269.202 430.5H230.394M443.851 430.5L426.601 476M443.851 430.5H485.006C485.41 430.5 485.775 430.744 485.93 431.117L504.282 475.383C504.436 475.756 504.801 476 505.205 476H534.074M230.394 430.5L210.922 475.398C210.764 475.763 210.403 476 210.005 476H191.758C191.335 476 190.958 475.734 190.816 475.336L159.226 386.925C158.946 386.141 157.887 386.022 157.44 386.724L126.88 434.733C126.483 435.356 125.573 435.349 125.185 434.721L95.567 386.728C95.1313 386.022 94.075 386.123 93.7809 386.898L60.2447 475.355C60.0974 475.743 59.7252 476 59.3097 476H0.5M230.394 430.5L250.126 385M585.453 476L598.478 431.783C598.667 431.142 598.187 430.5 597.519 430.5H574.78M585.453 476H624.669M585.453 476H534.074M611.266 385H554.736C554.266 385 553.859 385.327 553.759 385.787L534.074 476M624.669 476L638.569 430.5M624.669 476H694.663M717.498 385H653.208C652.769 385 652.381 385.287 652.252 385.708L638.569 430.5M638.569 430.5H741.45M724.2 476L741.45 430.5M741.45 430.5L757.981 386.898C758.275 386.123 759.331 386.022 759.767 386.728L789.385 434.721C789.772 435.349 790.683 435.356 791.08 434.733L821.64 386.724C822.087 386.022 823.146 386.141 823.426 386.925L855.016 475.336C855.158 475.734 855.535 476 855.957 476H882.059M882.059 476L895.959 430.5M882.059 476H952.053H989.806C990.236 476 990.617 475.725 990.754 475.318L1019.85 388.581C1020.18 387.608 1021.58 387.699 1021.78 388.707L1038.2 472.293C1038.4 473.301 1039.8 473.392 1040.13 472.419L1069.23 385.682C1069.36 385.275 1069.74 385 1070.17 385H1126.54M974.888 385H910.598C910.159 385 909.771 385.287 909.642 385.708L895.959 430.5M895.959 430.5H931.204M1126.54 385H1167H1581.73C1589.67 385 1597.38 382.3 1603.58 377.342L1927.92 118.158C1934.12 113.2 1941.83 110.5 1949.77 110.5H2031.32C2032.68 110.5 2033.94 109.807 2034.68 108.662L2067.34 57.8074C2069.33 54.7183 2074.08 55.7103 2074.66 59.3354L2091.51 164.38C2092.2 168.646 2098.22 168.947 2099.33 164.771L2133.61 35.33C2134.75 31.0626 2140.94 31.5031 2141.45 35.8875L2159.53 189.751C2160.07 194.28 2166.55 194.533 2167.43 190.06L2200.29 23.8404C2201.17 19.3991 2207.59 19.6047 2208.18 24.0931L2231.8 203.256C2232.4 207.749 2238.82 207.949 2239.69 203.501L2274.97 23.1682C2275.83 18.7463 2282.21 18.9079 2282.85 23.3679L2307.99 198.506C2308.63 203 2315.08 203.115 2315.88 198.646L2345.6 33.4307C2346.41 28.9597 2352.86 29.0774 2353.5 33.5746L2374.31 179.617C2374.94 184.045 2381.26 184.257 2382.18 179.881L2408.98 53.342C2409.9 48.994 2416.16 49.1653 2416.85 53.5571L2433.41 160.252C2433.97 163.868 2438.69 164.894 2440.7 161.838L2473.31 112.301C2474.05 111.177 2475.31 110.5 2476.66 110.5H3639.69C3650.32 110.5 3660.37 115.325 3667.01 123.615L4036.99 585.385C4043.63 593.675 4053.68 598.5 4064.31 598.5H4241.5H5042L5070.77 597.934C5074.05 597.87 5077.08 596.208 5078.9 593.483L5111.34 544.823C5113.36 541.796 5118.04 542.816 5118.62 546.408L5135.51 651.712C5136.2 655.978 5142.22 656.279 5143.33 652.102L5177.62 522.662C5178.75 518.394 5184.94 518.835 5185.45 523.219L5203.53 677.083C5204.07 681.612 5210.55 681.865 5211.43 677.392L5244.29 511.172C5245.17 506.731 5251.58 506.936 5252.18 511.425L5275.8 690.588C5276.4 695.081 5282.82 695.28 5283.69 690.833L5318.97 510.5C5319.83 506.078 5326.21 506.24 5326.85 510.7L5351.99 685.838C5352.63 690.332 5359.08 690.447 5359.88 685.978L5389.6 520.762C5390.41 516.292 5396.86 516.409 5397.5 520.906L5418.31 666.949C5418.94 671.377 5425.26 671.589 5426.18 667.213L5452.98 540.674C5453.9 536.326 5460.16 536.497 5460.85 540.889L5477.37 647.308C5477.93 650.958 5482.72 651.955 5484.7 648.835L5514.05 602.496C5515.88 599.593 5519.08 597.837 5522.52 597.847L5763.5 598.5M1126.54 385L1098 476" stroke="black" strokeLinecap="round" />
            <path strokeWidth="12" d="M665.479 185H601.189C600.749 185 600.361 185.287 600.232 185.708L586.549 230.5M586.549 230.5L573.044 274.708C572.848 275.35 573.329 276 574.001 276H642.644M586.549 230.5H689.431M672.18 276L689.431 230.5M689.431 230.5L705.961 186.899C706.255 186.123 707.312 186.022 707.747 186.728L737.365 234.721C737.753 235.349 738.664 235.356 739.06 234.733L769.621 186.724C770.067 186.022 771.126 186.141 771.406 186.925L803.003 275.355C803.142 275.744 803.505 276.007 803.918 276.018L828.162 276.662C828.598 276.674 828.991 276.402 829.134 275.99L843.425 234.733L860.183 186.355C860.323 185.952 860.702 185.682 861.128 185.682H912.193M912.193 185.682L898.895 233.987C898.776 234.421 898.382 234.721 897.931 234.722L850.059 234.727M912.193 185.682H936.375C937.037 185.682 937.516 186.314 937.337 186.952L912.549 275.412C912.37 276.05 912.85 276.682 913.512 276.682H980.052H1000.6C1001.07 276.682 1001.47 276.359 1001.57 275.904L1022.07 185.778C1022.17 185.323 1022.58 185 1023.04 185H1073.19M1073.19 185L1054.36 275.885C1054.26 276.349 1053.85 276.682 1053.38 276.682H1006.8M1073.19 185H1086.68C1087 185 1087.3 185.156 1087.49 185.419L1120.19 231.182M1120.19 231.182L1134.69 185M1120.19 231.182L1107.57 274.108C1107.38 274.748 1107.86 275.39 1108.53 275.39H1150.24M1150.24 275.39L1163.74 231.182M1150.24 275.39C1150.04 276.033 1150.52 276.682 1151.19 276.682H1219.84M1163.74 231.182L1177.42 186.39C1177.55 185.969 1177.94 185.682 1178.38 185.682H1242.67H1259.38M1163.74 231.182H1198.99M1259.38 185.682H1323.67M1259.38 185.682C1258.94 185.682 1258.55 185.969 1258.42 186.39L1244.74 231.182M1244.74 231.182L1231.24 275.39C1231.04 276.033 1231.52 276.682 1232.19 276.682H1300.84M1244.74 231.182H1279.99" stroke="black" strokeLinecap="round" />
            <path strokeWidth="12" d="M463.346 186L434.018 273.419C433.691 274.392 432.286 274.301 432.088 273.294L415.673 189.707C415.475 188.699 414.07 188.608 413.744 189.581L384.645 276.318C384.508 276.726 384.126 277 383.697 277H348.586C348.187 277 347.827 276.764 347.668 276.398L328.458 232.102C328.3 231.737 327.939 231.5 327.541 231.5H288.732M269 277L288.732 231.5M288.732 231.5L308.465 186" stroke="black" strokeLinecap="round" />
          </svg>

          <div className={styles.section}>
            {/* PART 1 */}
            <div className={styles.part1}>
              <div className={styles.part1Inner}>
                <div className={`part1Text ${styles.part1TextItem}`}>STREAMLINE TASKS</div>
                <BarSVG className="part1SVG" />
                <div className={`part1Text ${styles.part1TextItem}`}>TRACK PROGRESS</div>
                <BarSVG className="part1SVG" />
                <div className={`part1Text ${styles.part1TextItem}`}>ENHANCE PRODUCTIVITY</div>
              </div>
            </div>

            {/* PART 2 */}
            <div className={styles.part2}>
              <div className={styles.part2Left}>
                <div className={`part2Text ${styles.part2Title}`}>As an</div>
                <div className={`part2Text ${styles.part2TitleSm}`}>Employee</div>
                {["Interactive Status Update", "Tagged Task Categorization", "Due Date Tracking"].map((text, i) => (
                  <div key={i} className={i === 0 ? styles.featureRowFirst : styles.featureRowNext}>
                    <BarSVGBrown className="part2SVG" />
                    <div className={`part2Points ${styles.featureText}`}>{text}</div>
                  </div>
                ))}
              </div>
              <div className={styles.part2Right}>
                <div className={`popup ${styles.popup}`}>
                  <div className={`circles ${styles.circlesWrap}`}>
                    <div className={`circle circle1 ${styles.circle}`}></div>
                    <div className={`circle circle2 ${styles.circle}`}></div>
                    <div className={`circle circle3 ${styles.circle}`}></div>
                  </div>
                  <div className={`popupText ${styles.popupTextBlue}`}>Accept</div>
                  <div className={`popupText ${styles.popupTextYellow}`}>Track</div>
                  <div className={`popupText ${styles.popupTextGreen}`}>Complete</div>
                  <div className={`popupText ${styles.popupTextRed}`}>(or Decline)</div>
                  <div className={`popupText ${styles.popupTextWhite}`}>your tasks</div>
                </div>
              </div>
            </div>

            {/* PART 3 */}
            <div className={`part3 ${styles.part3Wrap}`}>
              <div className={styles.part3Top}>
                <div className={styles.part3Left}>
                  <div className={`part2Text ${styles.part3Title}`}>As the</div>
                  <div className={`part2Text ${styles.part3TitleFollowing}`}>Admin</div>
                </div>
                <div className={`flatlineCircle ${styles.flatlineCircle}`}>
                  <div className={styles.flatlineInner}>
                    <svg className={styles.flatlineSvg} viewBox="10 0 450 200" xmlns="http://www.w3.org/2000/svg">
                      <path ref={pathRef2} d="M 10 100 L 100 100 L 120 50 L 140 150 L 160 100 L 300 100 L 320 50 L 340 150 L 360 100 L 490 100" stroke="white" strokeWidth="9" fill="none" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className={`part3 ${styles.part3Bottom}`}>
                <div className={`${styles.part3BottomTextFirst}`}>Assign Tasks to Employees</div>
                <div className={styles.part3BottomText}>View Employee Progress</div>
                <div className={styles.part3BottomText}>Recieve Updates Dynamically</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* GET STARTED BUTTON */}
      <Link href="/main">
        <div className={`part4 section ${styles.getStartedSection}`}>
          <div className={`getStartedDivs ${styles.getStartedMain}`}>
            <div className={styles.getStartedText}>GET STARTED</div>
          </div>
          <div className={`getStartedDivs getStartedDiv1 ${styles.getStartedBar1}`}></div>
          <div className={`getStartedDivs ${styles.getStartedBar2}`}></div>
          <div className={`getStartedDivs ${styles.getStartedBar3}`}></div>
          <div className={`getStartedDivs ${styles.getStartedBar4}`}></div>
        </div>
      </Link>
    </div>
  );
};

export default LandingPage;
