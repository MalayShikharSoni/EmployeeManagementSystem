import { forwardRef, react } from "react";
import { Link } from "react-router-dom";

const HeaderHomePage = forwardRef(({}, ref) => {
  const { firstWaveRef, thirdWaveRef } = ref || {};

  return (
    <>
      <div
        className="fixed z-[9999] bg-transparent top-0 w-full h-[16%]"
        style={{ mixBlendMode: "difference" }}
      >
        <div className="relative flex items-center justify-between h-[100%] w-[100%] bg-transparent">
          <div className="bg-transparent pl-[3rem]">
            <img
              src="/src/assets/WorkWaveLogo.svg"
              alt=""
              className="bg-transparent w-auto h-12"
            />
          </div>

          <Link to="/main" className="bg-transparent">
            <div className="bg-transparent pr-[3rem]">
              <img
                src="/src/assets/LogIn.svg"
                alt=""
                className="bg-transparent w-auto h-16"
              />
            </div>
          </Link>

          <div className="absolute w-[95%] h-[2.5px] bottom-[0%] left-[2.5%] rounded-md bg-[#cec0ad]"></div>

          <div
            ref={firstWaveRef}
            className="absolute top-[calc(100%-22px)] left-[calc(50%+29px-45px)] translate-x-[-50%] h-[0px] w-[150px] bg-transparent"
          >
            <img
              src="/src/assets/HeaderWave1.svg"
              alt=""
              className="bg-transparent w-auto h-[40px]"
            />
          </div>
          <div className="absolute top-[calc(100%-36px)] left-[calc(50%+29px)] translate-x-[-50%] h-[0px] w-[150px] bg-transparent">
            <img
              src="/src/assets/HeaderWave2.svg"
              alt=""
              className="bg-transparent w-auto h-[70px]"
            />
          </div>
          <div
            ref={thirdWaveRef}
            className="absolute top-[calc(100%-22px)] left-[calc(50%+29px+45px)] translate-x-[-50%] h-[0px] w-[150px] bg-transparent"
          >
            <img
              src="/src/assets/HeaderWave3.svg"
              alt=""
              className="bg-transparent w-auto h-[40px]"
            />
          </div>
        </div>
      </div>
    </>
  );
});
export default HeaderHomePage;
