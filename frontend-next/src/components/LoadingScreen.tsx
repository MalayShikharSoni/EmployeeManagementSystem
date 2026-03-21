'use client';

import React from "react";
import Image from "next/image";

const LoadingScreen: React.FC = () => {
  return (
    <>
      <div className="loading-screen relative w-screen h-screen bg-transparent flex items-center justify-center">
        <div className="logo-container flex items-center bg-transparent">
          <Image src="/assets/WorkWaveLogo1.svg" alt="1" width={200} height={250} className="logo1 bg-transparent pr-4" />
          <Image src="/assets/WorkWaveLogo2.svg" alt="2" width={200} height={250} className="logo2 bg-transparent -mr-2.5" />
          <Image src="/assets/WorkWaveLogo6.svg" alt="3" width={180} height={225} className="logo3 bg-transparent pr-1" />
          <Image src="/assets/WorkWaveLogo5.svg" alt="4" width={146} height={182} className="logo4 bg-transparent pr-2" />
          <Image src="/assets/WorkWaveLogo4.svg" alt="5" width={102} height={127} className="logo5 bg-transparent pr-2" />
          <Image src="/assets/WorkWaveLogo3.svg" alt="6" width={61} height={76} className="logo6 bg-transparent" />
        </div>
      </div>
    </>
  );
};

export default LoadingScreen;
