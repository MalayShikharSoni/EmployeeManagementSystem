import React, { useContext, useEffect, useRef, useState } from "react";
import TaskList from "../TaskList/TaskList";
import HeaderUser from "../../pages/HeaderUser";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { AuthContext } from "../../context/AuthProvider";

const EmployeeDashboard = ({
  changeUser,
  data,
  user,
  setuserData,
  AcceptClickButton,
  setLoggedInUserData,
}) => {
  // console.log(newData)

  const firstWaveRef = useRef(null);
  const thirdWaveRef = useRef(null);

  const [userData, setUserData] = useContext(AuthContext);
  const CurrentUser = userData.loggedInUser;

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
    <div className="w-screen">
      <HeaderUser
        ref={{ firstWaveRef, thirdWaveRef }}
        changeUser={changeUser}
        data={data}
        user={user}
      />

      <div className="employeeDashboard bg-[#cec0ad] p-10 pt-[25vh] max-sm:px-[0px]">
        {/* <TaskListNumbers /> */}
        <TaskList
          setuserData={setuserData}
          data={data}
          AcceptClickButton={AcceptClickButton}
          setLoggedInUserData={setLoggedInUserData}
        />
      </div>
    </div>
  );
};

export default EmployeeDashboard;
