import React, { useContext, useEffect, useReducer, useRef } from "react";
import Header from "../other/Header";
import CreateTask from "../other/CreateTask";
import AllTasks from "../other/AllTasks";
import { AuthContext } from "../../context/AuthProvider";
import { data } from "autoprefixer";
import HeaderUser from "../../pages/HeaderUser";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const AdminDashboard = (props) => {
  const [userData, setuserData] = useContext(AuthContext);

  const firstWaveRef = useRef(null);
  const thirdWaveRef = useRef(null);

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      setuserData(JSON.parse(storedUserData));
    }
  }, [setuserData]);

  useGSAP(() => {
    if (!firstWaveRef.current || !thirdWaveRef.current) {
      console.log("waveRef is null");
      return;
    } else {
      console.log("waveRef is not null");
    }

    gsap.fromTo(
      firstWaveRef.current,
      { x: 0 },

      {
        x: "-40vw",
        ease: "none",
        scrollTrigger: {
          trigger: ".employeeDashboard",
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      },
    );

    gsap.fromTo(
      thirdWaveRef.current,
      { x: 0 },

      {
        x: "42.5vw",
        ease: "none",
        scrollTrigger: {
          trigger: ".employeeDashboard",
          start: "top top",
          end: "bottom top",
          scrub: 1,
          markers: false,
        },
      },
    );
  });

  return (
    <>
      <HeaderUser
        ref={{ firstWaveRef, thirdWaveRef }}
        data={props.data}
        changeUser={props.changeUser}
      />
      <div className="bg-[#cec0ad] flex flex-row">
        <div className="bg-transparent w-[70vw]">
          <div className="adminDashboard bg-[#cec0ad]">
            {/* <Header data={props.data} changeUser={props.changeUser} /> */}
            <CreateTask setuserData={props.setuserData} />
            <AllTasks />
          </div>
        </div>

        <div className="flex flex-col gap-[20px] h-full rounded-es-[200px] bg-[#ad9676] mb-[16vh] w-[30vw] mt-[16vh] overflow-hidden ">
          <div className="titleLine bg-transparent flex flex-row items-center gap-[0px] justify-center w-auto">
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src="/src/assets/V.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src="/src/assets/E.svg"
              alt=""
            />

            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src="/src/assets/W.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src="/src/assets/O.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src="/src/assets/R.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src="/src/assets/K.svg"
              alt=""
            />

            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src="/src/assets/W.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src="/src/assets/A.svg"
              alt=""
            />
          </div>

          <div className="titleLine bg-transparent flex flex-row items-center gap-[0px] justify-center w-auto">
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src="/src/assets/W.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src="/src/assets/O.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src="/src/assets/R.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src="/src/assets/K.svg"
              alt=""
            />

            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src="/src/assets/W.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src="/src/assets/A.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src="/src/assets/V.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src="/src/assets/E.svg"
              alt=""
            />
          </div>

          <div className="titleLine bg-transparent flex flex-row items-center gap-[0px] justify-center w-auto">
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src="/src/assets/O.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src="/src/assets/R.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src="/src/assets/K.svg"
              alt=""
            />

            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src="/src/assets/W.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src="/src/assets/A.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src="/src/assets/V.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src="/src/assets/E.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src="/src/assets/W.svg"
              alt=""
            />
          </div>

          <div className="titleLine bg-transparent flex flex-row items-center gap-[0px] justify-center w-auto">
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src="/src/assets/R.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src="/src/assets/K.svg"
              alt=""
            />

            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src="/src/assets/W.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src="/src/assets/A.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src="/src/assets/V.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src="/src/assets/E.svg"
              alt=""
            />

            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src="/src/assets/W.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src="/src/assets/O.svg"
              alt=""
            />
          </div>

          <div className="titleLine bg-transparent flex flex-row items-center gap-[0px] justify-center w-auto">
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src="/src/assets/K.svg"
              alt=""
            />

            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src="/src/assets/W.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src="/src/assets/A.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src="/src/assets/V.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src="/src/assets/E.svg"
              alt=""
            />

            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src="/src/assets/W.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src="/src/assets/O.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src="/src/assets/R.svg"
              alt=""
            />
          </div>

          <div className="titleLine bg-transparent flex flex-row items-center gap-[0px] justify-center w-auto">
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src="/src/assets/W.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src="/src/assets/A.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src="/src/assets/V.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src="/src/assets/E.svg"
              alt=""
            />

            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src="/src/assets/W.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src="/src/assets/O.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src="/src/assets/R.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src="/src/assets/K.svg"
              alt=""
            />
          </div>

          <div className="titleLine bg-transparent flex flex-row items-center gap-[0px] justify-center w-auto">
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src="/src/assets/A.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src="/src/assets/V.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src="/src/assets/E.svg"
              alt=""
            />

            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src="/src/assets/W.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src="/src/assets/O.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src="/src/assets/R.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src="/src/assets/K.svg"
              alt=""
            />

            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src="/src/assets/W.svg"
              alt=""
            />
          </div>

          <div className="titleLine bg-transparent flex flex-row items-center gap-[0px] justify-center w-auto">
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src="/src/assets/W.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src="/src/assets/A.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src="/src/assets/V.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src="/src/assets/E.svg"
              alt=""
            />

            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src="/src/assets/W.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src="/src/assets/O.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src="/src/assets/R.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src="/src/assets/K.svg"
              alt=""
            />
          </div>

          <div className="titleLine bg-transparent flex flex-row items-center gap-[0px] justify-center w-auto">
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src="/src/assets/A.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src="/src/assets/V.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src="/src/assets/E.svg"
              alt=""
            />

            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src="/src/assets/W.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src="/src/assets/O.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src="/src/assets/R.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src="/src/assets/K.svg"
              alt=""
            />

            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src="/src/assets/W.svg"
              alt=""
            />
          </div>

          <div className="titleLine bg-transparent flex flex-row items-center gap-[0px] justify-center w-auto">
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src="/src/assets/W.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src="/src/assets/A.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src="/src/assets/V.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src="/src/assets/E.svg"
              alt=""
            />

            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src="/src/assets/W.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src="/src/assets/O.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src="/src/assets/R.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src="/src/assets/K.svg"
              alt=""
            />
          </div>

          <div className="titleLine bg-transparent flex flex-row items-center gap-[0px] justify-center w-auto">
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src="/src/assets/A.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src="/src/assets/V.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src="/src/assets/E.svg"
              alt=""
            />

            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src="/src/assets/W.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src="/src/assets/O.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src="/src/assets/R.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src="/src/assets/K.svg"
              alt=""
            />

            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src="/src/assets/W.svg"
              alt=""
            />
          </div>

          <div className="titleLine bg-transparent flex flex-row items-center gap-[0px] justify-center w-auto">
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src="/src/assets/W.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src="/src/assets/A.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src="/src/assets/V.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src="/src/assets/E.svg"
              alt=""
            />

            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src="/src/assets/W.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src="/src/assets/O.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src="/src/assets/R.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src="/src/assets/K.svg"
              alt=""
            />
          </div>

          <div className="titleLine bg-transparent flex flex-row items-center gap-[0px] justify-center w-auto">
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src="/src/assets/A.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src="/src/assets/V.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src="/src/assets/E.svg"
              alt=""
            />

            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src="/src/assets/W.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src="/src/assets/O.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src="/src/assets/R.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src="/src/assets/K.svg"
              alt=""
            />

            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src="/src/assets/W.svg"
              alt=""
            />
          </div>

          {/* <div className="titleLine bg-transparent flex flex-row items-center gap-[0px] justify-center w-auto">
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src="/src/assets/W.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src="/src/assets/A.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src="/src/assets/V.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src="/src/assets/E.svg"
              alt=""
            />

            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src="/src/assets/W.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src="/src/assets/O.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src="/src/assets/R.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src="/src/assets/K.svg"
              alt=""
            />
          </div>

          <div className="titleLine bg-transparent flex flex-row items-center gap-[0px] justify-center w-auto">
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src="/src/assets/A.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src="/src/assets/V.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src="/src/assets/E.svg"
              alt=""
            />

            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src="/src/assets/W.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src="/src/assets/O.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src="/src/assets/R.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src="/src/assets/K.svg"
              alt=""
            />

            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src="/src/assets/W.svg"
              alt=""
            />
          </div>

          <div className="titleLine bg-transparent flex flex-row items-center gap-[0px] justify-center w-auto">
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src="/src/assets/W.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src="/src/assets/A.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src="/src/assets/V.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src="/src/assets/E.svg"
              alt=""
            />

            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src="/src/assets/W.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src="/src/assets/O.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src="/src/assets/R.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src="/src/assets/K.svg"
              alt=""
            />
          </div>

          <div className="titleLine bg-transparent flex flex-row items-center gap-[0px] justify-center w-auto">
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src="/src/assets/A.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src="/src/assets/V.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src="/src/assets/E.svg"
              alt=""
            />

            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src="/src/assets/W.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src="/src/assets/O.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src="/src/assets/R.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src="/src/assets/K.svg"
              alt=""
            />

            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src="/src/assets/W.svg"
              alt=""
            />
          </div>

          <div className="titleLine bg-transparent flex flex-row items-center gap-[0px] justify-center w-auto">
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src="/src/assets/W.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src="/src/assets/A.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src="/src/assets/V.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src="/src/assets/E.svg"
              alt=""
            />

            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src="/src/assets/W.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src="/src/assets/O.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src="/src/assets/R.svg"
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src="/src/assets/K.svg"
              alt=""
            />
          </div> */}
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
