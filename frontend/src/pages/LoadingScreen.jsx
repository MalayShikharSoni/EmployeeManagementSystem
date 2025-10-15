// import { useEffect, useRef } from "react";
// import TVStaticEffect from "./TVStaticEffect";

import WorkWaveLogo1 from "/src/assets/WorkWaveLogo1.svg";
import WorkWaveLogo2 from "/src/assets/WorkWaveLogo2.svg";
import WorkWaveLogo3 from "/src/assets/WorkWaveLogo3.svg";
import WorkWaveLogo4 from "/src/assets/WorkWaveLogo4.svg";
import WorkWaveLogo5 from "/src/assets/WorkWaveLogo5.svg";
import WorkWaveLogo6 from "/src/assets/WorkWaveLogo6.svg";

const LoadingScreen = () => {
  return (
    <>
      {/* <TVStaticEffect /> */}
      <div className="loading-screen relative w-screen h-screen bg-transparent flex items-center justify-center">
        <div className="logo-container flex items-center bg-transparent">
          <img
            src={WorkWaveLogo1}
            alt="1"
            className="logo1 bg-transparent w-auto h-[250.0000px] pr-4"
          />
          <img
            src={WorkWaveLogo2}
            alt="2"
            className="logo2 bg-transparent w-auto h-[250.0000px] -mr-2.5"
          />
          <img
            src={WorkWaveLogo6}
            alt="3"
            className="logo3 bg-transparent w-auto h-[224.5762px] pr-1"
          />
          <img
            src={WorkWaveLogo5}
            alt="4"
            className="logo4 bg-transparent w-auto h-[182.2033px] pr-2"
          />
          <img
            src={WorkWaveLogo4}
            alt="5"
            className="logo5 bg-transparent w-auto h-[127.1186px] pr-2"
          />
          <img
            src={WorkWaveLogo3}
            alt="6"
            className="logo6 bg-transparent w-auto h-[76.2711px] pr-0"
          />

        </div>
      </div>
    </>
  );
};

export default LoadingScreen;
