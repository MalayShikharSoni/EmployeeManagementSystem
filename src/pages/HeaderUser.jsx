import { useGSAP } from "@gsap/react";
import { forwardRef, react } from "react";
import { Link } from "react-router-dom";

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
          <div className="bg-transparent pl-[3rem]">
            <img
              src="/src/assets/WorkWaveLogoBlack.svg"
              alt=""
              className="bg-transparent w-auto h-12"
            />
          </div>

          <div className="bg-transparent left-[13vw] flex items-center font-extrabold text-5xl text-black overflow-hidden">
            Welcome, {props.data.firstname}
          </div>

          <div className="bg-transparent h-auto w-[45vw]"></div>

          <div className="bg-transparent pr-[7rem]" onClick={LogOutUser}>
            <img
              src="/src/assets/LogOutBlack.svg"
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
              src="/src/assets/HeaderWave1Black.svg"
              alt=""
              className="bg-transparent w-auto h-[40px]"
            />
          </div>
          <div className="absolute top-[calc(100%-36px)] left-[calc(50%+29px)] translate-x-[-50%] h-[0px] w-[150px] bg-transparent">
            <img
              src="/src/assets/HeaderWave2Black.svg"
              alt=""
              className="bg-transparent w-auto h-[70px]"
            />
          </div>
          <div
            ref={thirdWaveRef}
            className="absolute top-[calc(100%-22px)] left-[calc(50%+29px+45px)] translate-x-[-50%] h-[0px] w-[150px] bg-transparent"
          >
            <img
              src="/src/assets/HeaderWave3Black.svg"
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