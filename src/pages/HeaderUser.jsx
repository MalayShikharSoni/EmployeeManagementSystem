// import { useGSAP } from "@gsap/react";
import { forwardRef, react } from "react";
// import { Link } from "react-router-dom";

import WorkWaveLogoBlack from "../assets/WorkWaveLogoBlack.svg";
import LogOutBlack from "../assets/LogOutBlack.svg";
import HeaderWave1Black from "../assets/HeaderWave1Black.svg";
import HeaderWave2Black from "../assets/HeaderWave2Black.svg";
import HeaderWave3Black from "../assets/HeaderWave3Black.svg";

const HeaderUser = forwardRef((props, ref) => {
  const { firstWaveRef, thirdWaveRef } = ref || {};

  const LogOutUser = () => {
    localStorage.setItem("loggedInUser", "");
    // window.location.reload()
    props.changeUser("");
  };

  return (
    <>
      <div className="fixed z-[9] bg-[#cec0ad] top-0 w-full h-[16vh] ">
        <div className="relative flex items-center justify-between h-[100%] w-[100%] bg-transparent">
          <div className="bg-transparent pl-[3rem] max-sm:pl-[1rem]">
            <img src={WorkWaveLogoBlack} alt="" className="bg-transparent w-auto h-12" />
          </div>

          <div className="bg-transparent left-[13vw] flex items-center font-extrabold text-5xl text-black overflow-hidden max-sm:text-[20px]">
            Welcome, {props.data.firstname}
          </div>

          <div className="bg-transparent h-auto w-[45vw] max-sm:w-[0vw]"></div>

          <div className="bg-transparent pr-[7rem] max-sm:pr-[1rem]" onClick={LogOutUser}>

            <img
              src={LogOutBlack}
              alt=""
              className="bg-transparent w-auto h-16"
            />
          </div>

          <div className="absolute w-[95%] h-[2.5px] bottom-[0%] translate-x-[2.5%] rounded-md bg-[#000000]"></div>

          <div
            ref={firstWaveRef}
            className="absolute top-[calc(100%-22px)] left-[calc(50%+29px-45px)] translate-x-[-50%] h-[0px] w-[150px] bg-transparent"
          >

            <img
              src={HeaderWave1Black}
              alt=""
              className="bg-transparent w-auto h-[40px]"
            />
          </div>
          <div className="absolute top-[calc(100%-36px)] left-[calc(50%+29px)] translate-x-[-50%] h-[0px] w-[150px] bg-transparent">
            <img
              src={HeaderWave2Black}
              alt=""
              className="bg-transparent w-auto h-[70px]"
            />
          </div>
          <div
            ref={thirdWaveRef}
            className="absolute top-[calc(100%-22px)] left-[calc(50%+29px+45px)] translate-x-[-50%] h-[0px] w-[150px] bg-transparent"
          >
            <img
              src={HeaderWave3Black}
              alt=""
              className="bg-transparent w-auto h-[40px]"
            />
          </div>
        </div>
      </div>
    </>
  );
});
export default HeaderUser;