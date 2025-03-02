import { useEffect, useRef } from "react";
import LoadingScreen from "./LoadingScreen";

const LandingPage = () => {

  return (
    <>
    
    <LoadingScreen />
    <div className=" bg-[#cec0ad] w-screen h-screen">
        
        {/* HEADER */}
        <div className="fixed bg-transparent w-full h-[16%]" style={{mixBlendMode: "difference"}}>
          <div className="relative flex items-center justify-between h-[100%] w-[100%] bg-transparent">
            
            <div className="bg-transparent pl-[3rem]">
              <img src="/src/assets/WorkWaveLogo.svg" alt="" className="bg-transparent w-auto h-12"/>
            </div>

            <div className="bg-transparent pr-[3rem]">
              <img src="/src/assets/AccountLogo2.svg" alt="" className="bg-transparent w-auto h-16"/>
            </div>

            <div className="absolute w-[95%] h-[2.5px] bottom-[0%] left-[2.5%] rounded-md bg-[#cec0ad]"></div>
          </div>
        </div>
    </div>
    </>
  );
};

export default LandingPage;
