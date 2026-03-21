'use client';

import React, { useContext } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthProvider";

interface HeaderUserProps {
  data?: { firstname?: string; first_name?: string };
  changeUser?: () => void;
  user?: string;
  firstWaveRef?: React.RefObject<HTMLDivElement | null>;
  thirdWaveRef?: React.RefObject<HTMLDivElement | null>;
}

const HeaderUser: React.FC<HeaderUserProps> = ({ data, firstWaveRef, thirdWaveRef }) => {
  const { logout } = useContext(AuthContext);
  const router = useRouter();

  const LogOutUser = async () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      await logout();
      router.push("/login");
    }
  };

  return (
    <>
      <div className="fixed z-[9] bg-[#cec0ad] top-0 w-full h-[16vh]">
        <div className="relative flex items-center justify-between h-[100%] w-[100%] bg-transparent">
          <div className="bg-transparent pl-[3rem] max-sm:pl-[1rem]">
            <Image src="/assets/WorkWaveLogoBlack.svg" alt="" width={120} height={48} className="bg-transparent" />
          </div>

          <div className="bg-transparent left-[13vw] flex items-center font-extrabold text-5xl text-black overflow-hidden max-sm:text-[20px]">
            Welcome, {data?.firstname || data?.first_name}
          </div>

          <div className="bg-transparent h-auto w-[45vw] max-sm:w-[0vw]"></div>

          <div className="bg-transparent pr-[7rem] max-sm:pr-[1rem] cursor-pointer" onClick={LogOutUser}>
            <Image src="/assets/LogOutBlack.svg" alt="" width={64} height={64} className="bg-transparent" />
          </div>

          <div className="absolute w-[95%] h-[2.5px] bottom-[0%] translate-x-[2.5%] rounded-md bg-[#000000]"></div>

          <div ref={firstWaveRef} className="absolute top-[calc(100%-22px)] left-[calc(50%+29px-45px)] translate-x-[-50%] h-[0px] w-[150px] bg-transparent">
            <Image src="/assets/HeaderWave1Black.svg" alt="" width={150} height={40} className="bg-transparent" />
          </div>
          <div className="absolute top-[calc(100%-36px)] left-[calc(50%+29px)] translate-x-[-50%] h-[0px] w-[150px] bg-transparent">
            <Image src="/assets/HeaderWave2Black.svg" alt="" width={150} height={70} className="bg-transparent" />
          </div>
          <div ref={thirdWaveRef} className="absolute top-[calc(100%-22px)] left-[calc(50%+29px+45px)] translate-x-[-50%] h-[0px] w-[150px] bg-transparent">
            <Image src="/assets/HeaderWave3Black.svg" alt="" width={150} height={40} className="bg-transparent" />
          </div>
        </div>
      </div>
    </>
  );
};

export default HeaderUser;
