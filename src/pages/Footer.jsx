import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import React from "react"


const Footer = () => {
    useGSAP(() => {
        
        let tl = gsap.timeline();

        gsap.to(".w1", {
            // height: "50px",
            scaleY: 0.7,
            // borderRadius: "0%",
            // clipPath: "inset(0% 0% 0% 100%)",
            duration: 2,
            ease: "none",
            repeat: -1,
            yoyo: true,
        })

        gsap.to(".w2", {
            // height: "50px",
            scaleY: 1.3,
            duration: 5,
            ease: "none",
            repeat: -1,
            yoyo: true,
        })

        gsap.to(".w3", {
            // height: "50px",
            scaleY: 1.3,
            duration: 1.5,
            ease: "none",
            repeat: -1,
            yoyo: true,
        })

        gsap.to(".w4", {
            // height: "50px",
            scaleY: 1.7,
            duration: 4.6,
            ease: "none",
            repeat: -1,
            yoyo: true,
        })

        gsap.to(".w5", {
            // height: "50px",
            scaleY: 0.7,
            duration: 1.5,
            ease: "none",
            repeat: -1,
            yoyo: true,
        })

        gsap.to(".w6", {
            // height: "50px",
            scaleY: 1.7,
            duration: 6,
            ease: "none",
            repeat: -1,
            yoyo: true,
        })

        gsap.to(".w7", {
            // height: "50px",
            scaleY: 1.4,
            duration: 2.3,
            ease: "none",
            repeat: -1,
            yoyo: true,
        })
        
        gsap.to(".w8", {
            // height: "50px",
            scaleY: 1.5,
            duration: 5,
            ease: "none",
            repeat: -1,
            yoyo: true,
        })

        gsap.to(".w9", {
            // height: "50px",
            scaleY: 1.2,
            duration: 5,
            ease: "none",
            repeat: -1,
            yoyo: true,
        })

        gsap.to(".w10", {
            // height: "50px",
            scaleY: 0.7,
            duration: 3.3,
            ease: "none",
            repeat: -1,
            yoyo: true,
        })

        gsap.to(".w11", {
            // height: "50px",
            scaleY: 0.7,
            duration: 3,
            ease: "none",
            repeat: -1,
            yoyo: true,
        })

        gsap.from(".wavyWork", {
            y: 100,
            duration: 1,
            ease: "back",
            stagger: { each: 0.2, from: "start" },
            scrollTrigger: {
                trigger: ".foooter",
                start: "top 80%",
                end: "top 50%", 
                markers: true, 
                toggleActions: "play reverse play reverse",

            }
        })

        gsap.from(".wavyWave", {
            y: 100,
            duration: 1,
            ease: "back",
            stagger: { each: 0.2, from: "end" },
            scrollTrigger: {
                trigger: ".foooter",
                start: "top 80%",
                end: "top 50%", 
                markers: true, 
                toggleActions: "play reverse play reverse",

            }
        })
    
    },[]);

    return (
        <>
        <div className="foooter flex items-center justify-center gap-5 bg-[#ad9676] w-screen h-[20vh] overflow-hidden" >
            
            <div className="bg-transparent gap-3 translate-y-[55px] relative flex flex-shrink-0 items-center justify-start">
                    <img className="wavyWork bg-transparent w-auto h-[90px] translate-x-2" src="/src/assets/W.svg" alt="" />
                    <img className="wavyWork bg-transparent w-auto h-[90px]" src="/src/assets/O.svg" alt="" />
                    <img className="wavyWork bg-transparent w-auto h-[90px]" src="/src/assets/R.svg" alt="" />
                    <img className="wavyWork bg-transparent w-auto h-[90px]" src="/src/assets/K.svg" alt="" />
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

                <div className="bg-transparent  translate-y-[55px] translate-x-[-2px] relative flex flex-shrink-0 items-center justify-start">
                    <img className="wavyWave bg-transparent w-auto h-[90px] translate-x-2" src="/src/assets/W.svg" alt="" />
                    <img className="wavyWave bg-transparent -ml-5 w-auto h-[90px]" src="/src/assets/A.svg" alt="" />
                    <img className="wavyWave bg-transparent -ml-7 w-auto h-[90px]" src="/src/assets/V.svg" alt="" />
                    <img className="wavyWave bg-transparent ml-2 w-auto h-[90px]" src="/src/assets/E.svg" alt="" />
                </div>

        </div>
        </>
    )
}

export default Footer