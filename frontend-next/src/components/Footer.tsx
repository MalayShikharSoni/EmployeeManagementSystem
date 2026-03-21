'use client';

import React from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

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
      <div className="foooter flex items-center justify-center gap-5 bg-[#ad9676] w-screen h-[20vh] overflow-hidden max-sm:flex-col">
        <div className="bg-transparent gap-3 translate-y-[55px] relative flex flex-shrink-0 items-center justify-start max-sm:w-0">
          <Image className="wavyWork bg-transparent translate-x-2" src="/assets/W.svg" alt="" width={60} height={90} />
          <Image className="wavyWork bg-transparent" src="/assets/O.svg" alt="" width={60} height={90} />
          <Image className="wavyWork bg-transparent" src="/assets/R.svg" alt="" width={60} height={90} />
          <Image className="wavyWork bg-transparent" src="/assets/K.svg" alt="" width={60} height={90} />
        </div>

        {/* SPOTIFY LIKE WAVEFORM */}
        <div className="bg-transparent flex items-center justify-center gap-10">
          <div className="w1 bg-[#cec0ad] w-[10px] h-[70px] rounded-full"></div>
          <div className="w2 bg-[#cec0ad] w-[10px] h-[100px] rounded-full"></div>
          <div className="w3 bg-[#cec0ad] w-[10px] h-[25px] rounded-full"></div>
          <div className="w4 bg-[#cec0ad] w-[10px] h-[50px] rounded-full"></div>
          <div className="w5 bg-[#cec0ad] w-[10px] h-[70px] rounded-full"></div>
          <div className="w6 bg-[#cec0ad] w-[10px] h-[60px] rounded-full"></div>
          <div className="w7 bg-[#cec0ad] w-[10px] h-[80px] rounded-md"></div>
          <div className="w8 bg-[#cec0ad] w-[10px] h-[90px] rounded-full"></div>
          <div className="w9 bg-[#cec0ad] w-[10px] h-[20px] rounded-full"></div>
          <div className="w10 bg-[#cec0ad] w-[10px] h-[100px] rounded-full"></div>
          <div className="w11 bg-[#cec0ad] w-[10px] h-[35px] rounded-full"></div>
        </div>

        <div className="bg-transparent translate-y-[55px] translate-x-[-2px] relative flex flex-shrink-0 items-center justify-start">
          <Image className="wavyWave bg-transparent translate-x-2" src="/assets/W.svg" alt="" width={60} height={90} />
          <Image className="wavyWave bg-transparent -ml-5" src="/assets/A.svg" alt="" width={60} height={90} />
          <Image className="wavyWave bg-transparent -ml-7" src="/assets/V.svg" alt="" width={60} height={90} />
          <Image className="wavyWave bg-transparent ml-2" src="/assets/E.svg" alt="" width={60} height={90} />
        </div>
      </div>
    </>
  );
};

export default Footer;
