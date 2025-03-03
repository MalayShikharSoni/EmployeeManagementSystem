import { useEffect, useRef, useState } from "react";
import LoadingScreen from "./LoadingScreen";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import TVStaticEffect from "./TVStaticEffect";
import HeaderHomePage from "./HeaderHomePage";

const LandingPage = () => {
  const [loading, setLoading] = useState(true);
  const pageRef = useRef(null);

  useGSAP(() => {
    let tl1 = gsap.timeline();
    let tl2 = gsap.timeline();
    let tl3 = gsap.timeline();
    let tl4 = gsap.timeline();
    let tl5 = gsap.timeline();
    let tl6 = gsap.timeline();

    tl1.from(".logo6", {
      x: -1000,
      duration: 1.4,
      scale: 0,
      opacity: 0,
      ease: "back.out",
    });

    tl2.from(".logo5", {
      x: -1000,
      duration: 1.4,
      delay: 0.1,
      scale: 0,
      opacity: 0,
      ease: "back.out",
    });

    tl3.from(".logo4", {
      x: -1000,
      duration: 1.4,
      delay: 0.2,
      scale: 0,
      opacity: 0,
      ease: "back.out",
    });

    tl4.from(".logo3", {
      x: -1000,
      duration: 1.4,
      delay: 0.3,
      scale: 0,
      opacity: 0,
      ease: "back.out",
    });

    tl5.from(".logo2", {
      x: -1000,
      duration: 1.4,
      delay: 0.4,
      scale: 0,
      opacity: 0,
      ease: "back.out",

      
      
    });

    tl6.from(".logo1", {
      x: -1000,
      duration: 1.4,
      delay: 0.5,
      scale: 0,
      opacity: 0,
      ease: "back.out",
      
      
    });

    tl6.to(".logo-container", {
      
      y: "-42vh",
      x: "-44vw",
      scale: 0.2,
      opacity: 0,
      duration: 0.7,
      onComplete: () => {
        setLoading(false);
        gsap.to(pageRef.current, { // ✅ Use ref to fade in the landing page
          opacity: 1,
          duration: 1.2,
          ease: "power2.out",
        });
        gsap.to(".landing-page", { opacity: 1, duration: 1.2, ease: "power2.out" }); // Fade-in Landing Page
      },
      
    });

    // Fade-out transition for Loading Screen
    tl6.to(".loading-screen", {
      opacity: 0,
      duration: 1,
      ease: "power2.out",
      
    });

  }, []);

  return (
    <>
      {/* {loading && <LoadingScreen className="loading-screen" />} */}

      <div ref={pageRef} className="landing-page bg-[#cec0ad] w-screen h-screen opacity-1">
        {/* HEADER */}
        <HeaderHomePage />

        <div className="pt-[21vh] bg-transparent flex justify-center items-center h-full w-full relative">
          <div className="bg-transparent relative">
            {/* WORK */}
            <div className=" bg-transparent w-full h-full flex justify-center items-center">
              <img src="/src/assets/WORK.svg" alt="" className="bg-transparent w-auto h-[20vh]" />
            </div>

            {/* WAVE */}
            <div className="absolute top-200 w-full h-full flex justify-center items-center bg-transparent mt-[5vh]">
              <img src="/src/assets/WAVE.svg" alt="" className="bg-transparent w-auto h-[20vh]" />
            </div>
            

          
          </div>
          
        </div>

        

      </div>
    </>
  );
};

export default LandingPage;
