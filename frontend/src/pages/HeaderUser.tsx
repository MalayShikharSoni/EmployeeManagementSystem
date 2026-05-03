import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext, type AuthContextType } from "../context/AuthProvider";
import WorkWaveLogoBlack from "../assets/WorkWaveLogoBlack.svg";
import LogOutBlack from "../assets/LogOutBlack.svg";
import HeaderWave1Black from "../assets/HeaderWave1Black.svg";
import HeaderWave2Black from "../assets/HeaderWave2Black.svg";
import HeaderWave3Black from "../assets/HeaderWave3Black.svg";
import type { User } from "../types";

interface HeaderUserProps {
  data: User;
  changeUser?: () => void;
  user?: string;
  firstWaveRef?: React.RefObject<HTMLDivElement | null>;
  thirdWaveRef?: React.RefObject<HTMLDivElement | null>;
}

const HeaderUser = React.forwardRef<unknown, HeaderUserProps>((props, ref) => {
  // Support both ref-as-object (legacy) and explicit props patterns
  const refObj = ref as unknown as { firstWaveRef?: React.RefObject<HTMLDivElement | null>; thirdWaveRef?: React.RefObject<HTMLDivElement | null> } | null;
  const firstWaveRef = props.firstWaveRef || refObj?.firstWaveRef;
  const thirdWaveRef = props.thirdWaveRef || refObj?.thirdWaveRef;
  const { logout } = useContext(AuthContext) as AuthContextType;
  const navigate = useNavigate();

  const LogOutUser = async () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) { await logout(); navigate("/login", { replace: true }); }
  };

  return (
    <>
      <div className="fixed z-[9] bg-[#cec0ad] top-0 w-full h-[16vh] ">
        <div className="relative flex items-center justify-between h-[100%] w-[100%] bg-transparent">
          <div className="bg-transparent pl-[3rem] max-sm:pl-[1rem]">
            <img src={WorkWaveLogoBlack} alt="" className="bg-transparent w-auto h-12" />
          </div>
          <div className="bg-transparent left-[13vw] flex items-center font-extrabold text-5xl text-black overflow-hidden max-sm:text-[20px]">
            Welcome, {props.data.firstName || props.data.first_name}
          </div>
          <div className="bg-transparent h-auto w-[45vw] max-sm:w-[0vw]"></div>
          <div className="bg-transparent pr-[7rem] max-sm:pr-[1rem]" onClick={LogOutUser}>
            <img src={LogOutBlack} alt="" className="bg-transparent w-auto h-16" />
          </div>
          <div className="absolute w-[95%] h-[2.5px] bottom-[0%] translate-x-[2.5%] rounded-md bg-[#000000]"></div>
          <div ref={firstWaveRef as React.Ref<HTMLDivElement>} className="absolute top-[calc(100%-22px)] left-[calc(50%+29px-45px)] translate-x-[-50%] h-[0px] w-[150px] bg-transparent">
            <img src={HeaderWave1Black} alt="" className="bg-transparent w-auto h-[40px]" />
          </div>
          <div className="absolute top-[calc(100%-36px)] left-[calc(50%+29px)] translate-x-[-50%] h-[0px] w-[150px] bg-transparent">
            <img src={HeaderWave2Black} alt="" className="bg-transparent w-auto h-[70px]" />
          </div>
          <div ref={thirdWaveRef as React.Ref<HTMLDivElement>} className="absolute top-[calc(100%-22px)] left-[calc(50%+29px+45px)] translate-x-[-50%] h-[0px] w-[150px] bg-transparent">
            <img src={HeaderWave3Black} alt="" className="bg-transparent w-auto h-[40px]" />
          </div>
        </div>
      </div>
    </>
  );
});
HeaderUser.displayName = 'HeaderUser';
export default HeaderUser;
