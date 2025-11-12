import React, { useContext, useEffect, useReducer, useRef } from "react";
import Header from "../other/Header";
import CreateTask from "../other/CreateTask";
import AllTasks from "../other/AllTasks";
import { AuthContext } from "../../context/AuthProvider";
import { data } from "autoprefixer";
import HeaderUser from "../../pages/HeaderUser";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import V from "../../assets/V.svg";
import E from "../../assets/E.svg";
import W from "../../assets/W.svg";
import O from "../../assets/O.svg";
import R from "../../assets/R.svg";
import K from "../../assets/K.svg";
import A from "../../assets/A.svg";
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

        <div className="flex flex-col gap-[20px] h-full rounded-es-[200px] bg-[#ad9676] mb-[16vh] w-[30vw] mt-[16vh] overflow-hidden max-sm:hidden">
          <div className="titleLine bg-transparent flex flex-row items-center gap-[0px] justify-center w-auto max-w-[30vw]">

            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src={V}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src={E}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src={W}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src={O}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src={R}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src={K}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src={W}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src={A}
              alt=""
            />
          </div>

          <div className="titleLine bg-transparent flex flex-row items-center gap-[0px] justify-center w-auto">
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src={W}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src={O}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src={R}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src={K}
              alt=""
            />

            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src={W}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src={A}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src={V}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src={E}
              alt=""
            />
          </div>

          <div className="titleLine bg-transparent flex flex-row items-center gap-[0px] justify-center w-auto">
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src={O}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src={R}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src={K}
              alt=""
            />

            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src={W}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src={A}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src={V}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src={E}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src={W}
              alt=""
            />
          </div>

          <div className="titleLine bg-transparent flex flex-row items-center gap-[0px] justify-center w-auto">
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src={R}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src={K}
              alt=""
            />

            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src={W}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src={A}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src={V}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src={E}
              alt=""
            />

            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src={W}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src={O}
              alt=""
            />
          </div>

          <div className="titleLine bg-transparent flex flex-row items-center gap-[0px] justify-center w-auto">
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src={K}
              alt=""
            />

            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src={W}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src={A}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src={V}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src={E}
              alt=""
            />

            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src={W}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src={O}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src={R}
              alt=""
            />
          </div>

          <div className="titleLine bg-transparent flex flex-row items-center gap-[0px] justify-center w-auto">
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src={W}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src={A}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src={V}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src={E}
              alt=""
            />

            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src={W}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src={O}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src={R}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src={K}
              alt=""
            />
          </div>

          <div className="titleLine bg-transparent flex flex-row items-center gap-[0px] justify-center w-auto">
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src={A}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src={V}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src={E}
              alt=""
            />

            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src={W}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src={O}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src={R}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src={K}
              alt=""
            />

            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src={W}
              alt=""
            />
          </div>

          <div className="titleLine bg-transparent flex flex-row items-center gap-[0px] justify-center w-auto">
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src={W}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src={A}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src={V}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src={E}
              alt=""
            />

            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src={W}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src={O}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src={R}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src={K}
              alt=""
            />
          </div>

          <div className="titleLine bg-transparent flex flex-row items-center gap-[0px] justify-center w-auto">
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src={A}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src={V}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src={E}
              alt=""
            />

            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src={W}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src={O}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src={R}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src={K}
              alt=""
            />

            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src={W}
              alt=""
            />
          </div>

          <div className="titleLine bg-transparent flex flex-row items-center gap-[0px] justify-center w-auto">
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src={W}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src={A}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src={V}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src={E}
              alt=""
            />

            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src={W}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src={O}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src={R}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src={K}
              alt=""
            />
          </div>

          <div className="titleLine bg-transparent flex flex-row items-center gap-[0px] justify-center w-auto">
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src={A}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src={V}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src={E}
              alt=""
            />

            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src={W}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src={O}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src={R}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src={K}
              alt=""
            />

            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src={W}
              alt=""
            />
          </div>

          <div className="titleLine bg-transparent flex flex-row items-center gap-[0px] justify-center w-auto">
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src={W}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src={A}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src={V}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src={E}
              alt=""
            />

            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src={W}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src={O}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src={R}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src={K}
              alt=""
            />
          </div>

          <div className="titleLine bg-transparent flex flex-row items-center gap-[0px] justify-center w-auto">
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src={A}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src={V}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src={E}
              alt=""
            />

            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src={W}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src={O}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src={R}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src={K}
              alt=""
            />

            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src={W}
              alt=""
            />
          </div>

          {/* <div className="titleLine bg-transparent flex flex-row items-center gap-[0px] justify-center w-auto">
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src={W}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src={A}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src={V}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src={E}
              alt=""
            />

            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src={W}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src={O}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src={R}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src={K}
              alt=""
            />
          </div>

          <div className="titleLine bg-transparent flex flex-row items-center gap-[0px] justify-center w-auto">
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src={A}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src={V}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src={E}
              alt=""
            />

            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src={W}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src={O}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src={R}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src={K}
              alt=""
            />

            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src={W}
              alt=""
            />
          </div>

          <div className="titleLine bg-transparent flex flex-row items-center gap-[0px] justify-center w-auto">
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src={W}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src={A}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src={V}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src={E}
              alt=""
            />

            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src={W}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src={O}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src={R}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src={K}
              alt=""
            />
          </div>

          <div className="titleLine bg-transparent flex flex-row items-center gap-[0px] justify-center w-auto">
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src={A}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src={V}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src={E}
              alt=""
            />

            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src={W}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src={O}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src={R}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src={K}
              alt=""
            />

            <img
              className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]"
              src={W}
              alt=""
            />
          </div>

          <div className="titleLine bg-transparent flex flex-row items-center gap-[0px] justify-center w-auto">
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src={W}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src={A}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src={V}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src={E}
              alt=""
            />

            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src={W}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src={O}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src={R}
              alt=""
            />
            <img
              className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]"
              src={K}
              alt=""
            />
          </div> */}
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
