import { useEffect, useRef, useState } from "react";
import LoadingScreen from "./LoadingScreen";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import TVStaticEffect from "./TVStaticEffect";
import HeaderHomePage from "./HeaderHomePage";

gsap.registerPlugin(ScrollTrigger);

const LandingPage = () => {
  const [loading, setLoading] = useState(true);
  const pageRef = useRef(null);
  const pathRef = useRef(null);
  const firstWaveRef = useRef(null);
  const thirdWaveRef = useRef(null);

  useGSAP(() => {
    let tl1 = gsap.timeline();
    let tl2 = gsap.timeline();
    let tl3 = gsap.timeline();
    let tl4 = gsap.timeline();
    let tl5 = gsap.timeline();
    let tl6 = gsap.timeline();
    let tl7 = gsap.timeline();

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

    tl7.from(".WORK", {
      x: -100,
      duration: 1,
      ease: "sine",
    });

    tl7.from(".WAVE", {
      x: 100,
      duration: 1,
      ease: "sine",
    }, "-=1");

    tl7.from(".blackbox",{
      opacity: 0,
      duration: 0.5,
      scale: 0.9,
      ease: "sine",
    })

    const path = pathRef.current;
    const pathLength = path.getTotalLength();
    gsap.set(pathRef.current, { strokeDasharray: pathLength, strokeDashoffset: pathLength });
    
    gsap.to(pathRef.current, {
      strokeDashoffset: "0",
      duration: 2,
      // reversed: true,
      // Infinite loop
      repeat: -1,
    });
    gsap.to(pathRef.current, {
      // strokeDashoffset: pathLength,
      duration: 2,
      // delay: 1,
      opacity: 0,
      stagger: 0.3,
      repeat: -1,
    });

    if(!firstWaveRef.current || !thirdWaveRef.current){
      console.log("waveRef is null");
      return;
    }
    else{
      console.log("waveRef is not null");
    }

    gsap.fromTo(firstWaveRef.current, 
      {x: 0},

      {
        x: "-40vw",
        ease:"none",
        scrollTrigger: {
          trigger: ".landing-page",
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      }
    );

    gsap.fromTo(thirdWaveRef.current, 
      {x: 0},

      {
        x: "42.5vw",
        ease:"none",
        scrollTrigger: {
          trigger: ".landing-page",
          start: "top top",
          end: "bottom top",
          scrub: 1,
          markers: false,
        },
      }
    );

    // MARQUEE

    gsap.to(".marque", {
      x: "-111vw",
      repeat: -1,
      duration: 8,
      ease: "none",
      
    })

  


    // HORIZONTAL SCROLL
    const sections = gsap.utils.toArray(".scrollContainer .section");

    gsap.to(".scrollContainer", {
      xPercent: -300,
      // transform: "translateX(-100%)",
      duration:5,
      ease: "none",
      scrollTrigger: {
        scroller: "html",
        trigger: ".scrollContainer",
        start: "top top",
        // end: "top 50%", 
        // start: "bottom bottom",
        pin: true,
        scrub: 1,
        // snap: 1 / (sections.length - 1),
        // start: "-=100vh",
        // end: "+=3000",
        // markers: true,
      }
    })

    // sections.forEach(section => {
    //   gsap.from(".texts", {
    //     y: 100,
    //     opacity: 0,
    //     duration: 2,
    //     ease: "elastic",
    //     stagger: 0.5,
    //     scrollTrigger: {
    //       trigger: section,
    //       containerAnimation: scrollTween,
    //       start: "left center",
    //       markers: true,
    //     },
    //   })
    // })
    

  }, []);
  
  return (
    <>
      {/* {loading && <LoadingScreen className="loading-screen" />} */}

      <div ref={pageRef} className="landing-page bg-[#cec0ad] w-screen h-screen opacity-1">
        {/* HEADER */}
        <HeaderHomePage ref={{firstWaveRef, thirdWaveRef}}/>

        <div className="pt-[16vh]  bg-transparent flex flex-col justify-center items-center h-full w-full relative">
        
        
          {/* WORK */}
          
          <div className="WORK bg-transparent"  style={{ mixBlendMode: "difference" }}>
            <img src="/src/assets/WORK.svg" alt="WORK" className="bg-transparent w-auto h-[20vh]"/>
          </div>
          {/* WAVE */}
          <div className="WAVE mt-[3vh] bg-transparent mb-30"  style={{ mixBlendMode: "difference" }}>
            <img src="/src/assets/WAVE.svg" alt="W" className="bg-transparent w-auto h-[20vh]" />
          </div>


          {/* BLACKBOX */}
          <div className="blackbox flex justify-between items-center bg-[#cec0ad] mt-16 w-[80vw] h-[130px]"  style={{ mixBlendMode: "difference" }}>
              
            {/* FLATLINE WAVE BOX */}
            <div className="mx-[1rem] bg-[#0b7494] rounded-md w-[35%] h-[80%]" style={{mixBlendMode: "none"}}>
            

              <div className="relative flex items-center justify-center bg-transparent w-[100%] h-[100%] overflow-hidden"  style={{ isolation: "isolate" }}>
                <svg
                  className=" bg-transparent w-[110%] h-auto self-center"
                  //500,200
                    // width="900px" height="150px"
                    // preserveAspectRatio="xMidYMid meet"
                    
                  viewBox="10 0 450 200" xmlns="http://www.w3.org/2000/svg">
                  <path
                    // transform="scale(1.5)"
                    // transformOrigin="center"
                  ref={pathRef} d="M 10 100 L 100 100 L 120 50 L 140 150 L 160 100 L 300 100 L 320 50 L 340 150 L 360 100 L 490 100"
                  stroke="white" strokeWidth="9" fill="none"/>
                </svg>

              </div>

            </div> 

            {/* MARQUEE */}
            <div className="flex items-center gap-10 bg-[#cec0ad] h-full w-full overflow-hidden">

              <div className="flex marque flex-shrink-0 text-black font-bold text-5xl bg-[#cec0ad] h-full justify-center items-center">EFFICIENT AMPLITUDE</div>

              <div className="flex marque flex-shrink-0 bg-[#cec0ad] h-full justify-center items-center">
                <img src="/src/assets/Waveform.svg" alt="Waveform" className="bg-transparent w-auto h-[7vh]"/>
              </div>

              <div className="flex marque flex-shrink-0 text-black font-bold text-5xl bg-[#cec0ad] h-full justify-center items-center">PRODUCTIVE PHASE</div>

              <div className="flex marque flex-shrink-0 bg-[#cec0ad] h-full justify-center items-center">
                <img src="/src/assets/Waveform.svg" alt="Waveform" className="bg-transparent w-auto h-[7vh]"/>
              </div>

              <div className="marque flex flex-shrink-0 text-black font-bold text-5xl bg-[#cec0ad] h-full justify-center items-center">FLAWLESS FREQUENCY</div>

              <div className="flex marque flex-shrink-0 bg-[#cec0ad] h-full justify-center items-center">
                <img src="/src/assets/Waveform.svg" alt="Waveform" className="bg-transparent w-auto h-[7vh]"/>
              </div>

              <div className="flex marque flex-shrink-0 text-black font-bold text-5xl bg-[#cec0ad] h-full justify-center items-center">EFFICIENT AMPLITUDE</div>

              <div className="flex marque flex-shrink-0 bg-[#cec0ad] h-full justify-center items-center">
                <img src="/src/assets/Waveform.svg" alt="Waveform" className="bg-transparent w-auto h-[7vh]"/>
              </div>

              <div className="flex marque flex-shrink-0 text-black font-bold text-5xl bg-[#cec0ad] h-full justify-center items-center">PRODUCTIVE PHASE</div>

              <div className="flex marque flex-shrink-0 bg-[#cec0ad] h-full justify-center items-center">
                <img src="/src/assets/Waveform.svg" alt="Waveform" className="bg-transparent w-auto h-[7vh]"/>
              </div>

              
            
            </div>

            
          
          </div>
          
        
        </div>
          
      </div>

      {/* HORIZONTAL SCROLL SECTION */}
      <div className="wrapper h-[100vh] overflow-x-hidden overflow-y-hidden bg-[#0b7494]">
        <div className="scrollContainer w-[400vw] flex h-[100vh] bg-[#852b5e]">

          <div className="section flex items-center justify-center w-[100vw] h-[100vh] bg-[#940b0b]">
      
            <div className="texts">
              1
            </div>

          </div>

          <div className="section flex items-center justify-center w-[100vw] h-[100vh] bg-[#94660b]">
            
            <div className="texts">
              2
            </div>

          </div>

          <div className="section flex items-center justify-center w-[100vw] h-[100vh] bg-[#0b9414]">
            
            <div className="texts">
              3
            </div>

          </div>

          <div className="section flex items-center justify-center w-[100vw] h-[100vh] bg-[#940b8f]">
            
            <div className="texts">
              4
            </div>

          </div>

        </div>
      </div>
      
      
    </>
  );
};

export default LandingPage;
