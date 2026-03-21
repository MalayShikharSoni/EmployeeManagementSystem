'use client';

import React from "react";
import Link from "next/link";
import Image from "next/image";

interface HeaderHomePageProps {
  firstWaveRef?: React.RefObject<HTMLDivElement | null>;
  thirdWaveRef?: React.RefObject<HTMLDivElement | null>;
}

const HeaderHomePage: React.FC<HeaderHomePageProps> = ({ firstWaveRef, thirdWaveRef }) => {
  return (
    <>
      <div className="fixed z-[9999] bg-transparent top-0 w-full h-[16%]" style={{ mixBlendMode: "difference" }}>
        <div className="relative flex items-center justify-between h-[100%] w-[100%] bg-transparent">
          <div className="bg-transparent pl-[2rem]">
            <Image src="/assets/WorkWaveLogo.svg" alt="" width={120} height={48} className="bg-transparent" />
          </div>

          <Link href="/main" className="bg-transparent">
            <div className="bg-transparent pr-[3rem] max-sm:pr-[2rem]">
              <Image src="/assets/LogIn.svg" alt="" width={64} height={64} className="bg-transparent" />
            </div>
          </Link>

          <div className="absolute w-[95%] h-[2.5px] bottom-[0%] left-[2.5%] rounded-md bg-[#cec0ad]"></div>

          <div ref={firstWaveRef} className="absolute top-[calc(100%-22px)] left-[calc(50%+29px-45px)] translate-x-[-50%] h-[0px] w-[150px] bg-transparent">
            <Image src="/assets/HeaderWave1.svg" alt="" width={150} height={40} className="bg-transparent" />
          </div>
          <div className="absolute top-[calc(100%-36px)] left-[calc(50%+29px)] translate-x-[-50%] h-[0px] w-[150px] bg-transparent">
            <Image src="/assets/HeaderWave2.svg" alt="" width={150} height={70} className="bg-transparent" />
          </div>
          <div ref={thirdWaveRef} className="absolute top-[calc(100%-22px)] left-[calc(50%+29px+45px)] translate-x-[-50%] h-[0px] w-[150px] bg-transparent">
            <Image src="/assets/HeaderWave3.svg" alt="" width={150} height={40} className="bg-transparent" />
          </div>
        </div>
      </div>
    </>
  );
};

export default HeaderHomePage;
