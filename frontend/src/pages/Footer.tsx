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
      <div className="foooter flex items-center justify-center gap-5 bg-[#ad9676] w-screen h-[20vh] overflow-hidden max-sm:flex-col">
        <div className="bg-transparent gap-3 translate-y-[55px] relative flex flex-shrink-0 items-center justify-start max-sm:w-0">
          <img className="wavyWork bg-transparent w-auto h-[90px] translate-x-2" src={W} alt="" />
          <img className="wavyWork bg-transparent w-auto h-[90px]" src={O} alt="" />
          <img className="wavyWork bg-transparent w-auto h-[90px]" src={R} alt="" />
          <img className="wavyWork bg-transparent w-auto h-[90px]" src={K} alt="" />
        </div>
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
        <div className="bg-transparent  translate-y-[55px] translate-x-[-2px] relative flex flex-shrink-0 items-center justify-start">
          <img className="wavyWave bg-transparent w-auto h-[90px] translate-x-2" src={W} alt="" />
          <img className="wavyWave bg-transparent -ml-5 w-auto h-[90px]" src={A} alt="" />
          <img className="wavyWave bg-transparent -ml-7 w-auto h-[90px]" src={V} alt="" />
          <img className="wavyWave bg-transparent ml-2 w-auto h-[90px]" src={E} alt="" />
        </div>
      </div>
    </>
  );
};

export default Footer;
