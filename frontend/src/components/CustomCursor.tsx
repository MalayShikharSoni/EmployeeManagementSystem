'use client';

import React from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import styles from "./CustomCursor.module.css";

interface CustomCursorProps {
  x: number;
  y: number;
}

const CustomCursor: React.FC<CustomCursorProps> = ({ x, y }) => {
  useGSAP(() => {
    const handleClick = () => {
      gsap.to(".cursorr", {
        scale: 0.9,
        translateX: -1,
        translateY: -1,
        duration: 0.1,
        ease: "power1.out",
        onComplete: () => {
          gsap.to(".cursorr", {
            scale: 1,
            translateX: 1,
            translateY: 1,
            duration: 0.2,
            ease: "power2.out",
          });
        },
      });
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <div
      className={`cursorr ${styles.cursor}`}
      style={{
        top: `${y}px`,
        left: `${x}px`,
      }}
    >
      <Image
        src="/assets/CustomLinuxCursor.svg"
        alt="."
        width={24}
        height={24}
        style={{ background: "none", mixBlendMode: "multiply" }}
      />
    </div>
  );
};

export default CustomCursor;
