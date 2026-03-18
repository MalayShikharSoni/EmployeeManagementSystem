import React, { useContext, useRef, memo, useCallback, useState } from "react";
import { Navigate } from "react-router-dom";
import CreateTask from "../other/CreateTask";
import AllTasks from "../other/AllTasks";
import TeamManagement from "../other/TeamManagement";
import { AuthContext } from "../../context/AuthProvider";
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

const AdminDashboard = memo(() => {
  // ─────────────────────────────────────────────────────────
  // ALL HOOKS MUST BE AT THE TOP
  // ─────────────────────────────────────────────────────────
  const firstWaveRef = useRef(null);
  const thirdWaveRef = useRef(null);

  const { userData, isLoading: authLoading } = useContext(AuthContext);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleTaskCreated = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  const changeUser = useCallback(() => { }, []);

  useGSAP(() => {
    if (!firstWaveRef.current || !thirdWaveRef.current) return;

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
      }
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
      }
    );
  }, []);

  // ─────────────────────────────────────────────────────────
  // NOW CONDITIONAL RETURNS (AFTER ALL HOOKS)
  // ─────────────────────────────────────────────────────────

  // Check auth loading first
  if (authLoading) {
    return (
      <div className="w-screen bg-[#cec0ad] flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#ad9676] mb-4"></div>
          <p className="text-2xl font-semibold text-[#9c815a]">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Redirect if not admin
  if (!userData || userData.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <HeaderUser
        ref={{ firstWaveRef, thirdWaveRef }}
        data={userData.data}
        changeUser={() => { }}
      />
      <div className="bg-[#cec0ad] flex flex-row">
        <div className="bg-transparent w-[70vw]">
          <div className="adminDashboard bg-[#cec0ad]">
            <TeamManagement />
            <CreateTask onTaskCreated={handleTaskCreated} />
            <AllTasks refreshTrigger={refreshTrigger} />
          </div>
        </div>

        <div className="flex flex-col gap-[20px] h-full rounded-es-[200px] bg-[#ad9676] mb-[16vh] w-[30vw] mt-[16vh] overflow-hidden max-sm:hidden">
          <div className="titleLine bg-transparent flex flex-row items-center gap-[0px] justify-center w-auto max-w-[30vw]">
            <img className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]" src={V} alt="" />
            <img className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]" src={E} alt="" />
            <img className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]" src={W} alt="" />
            <img className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]" src={O} alt="" />
            <img className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]" src={R} alt="" />
            <img className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]" src={K} alt="" />
            <img className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]" src={W} alt="" />
            <img className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]" src={A} alt="" />
          </div>

          <div className="titleLine bg-transparent flex flex-row items-center gap-[0px] justify-center w-auto">
            <img className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]" src={W} alt="" />
            <img className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]" src={O} alt="" />
            <img className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]" src={R} alt="" />
            <img className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]" src={K} alt="" />
            <img className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]" src={W} alt="" />
            <img className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]" src={A} alt="" />
            <img className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]" src={V} alt="" />
            <img className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]" src={E} alt="" />
          </div>

          <div className="titleLine bg-transparent flex flex-row items-center gap-[0px] justify-center w-auto">
            <img className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]" src={O} alt="" />
            <img className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]" src={R} alt="" />
            <img className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]" src={K} alt="" />
            <img className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]" src={W} alt="" />
            <img className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]" src={A} alt="" />
            <img className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]" src={V} alt="" />
            <img className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]" src={E} alt="" />
            <img className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]" src={W} alt="" />
          </div>

          <div className="titleLine bg-transparent flex flex-row items-center gap-[0px] justify-center w-auto">
            <img className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]" src={R} alt="" />
            <img className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]" src={K} alt="" />
            <img className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]" src={W} alt="" />
            <img className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]" src={A} alt="" />
            <img className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]" src={V} alt="" />
            <img className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]" src={E} alt="" />
            <img className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]" src={W} alt="" />
            <img className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]" src={O} alt="" />
          </div>

          <div className="titleLine bg-transparent flex flex-row items-center gap-[0px] justify-center w-auto">
            <img className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]" src={K} alt="" />
            <img className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]" src={W} alt="" />
            <img className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]" src={A} alt="" />
            <img className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]" src={V} alt="" />
            <img className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]" src={E} alt="" />
            <img className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]" src={W} alt="" />
            <img className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]" src={O} alt="" />
            <img className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]" src={R} alt="" />
          </div>

          <div className="titleLine bg-transparent flex flex-row items-center gap-[0px] justify-center w-auto">
            <img className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]" src={W} alt="" />
            <img className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]" src={A} alt="" />
            <img className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]" src={V} alt="" />
            <img className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]" src={E} alt="" />
            <img className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]" src={W} alt="" />
            <img className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]" src={O} alt="" />
            <img className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]" src={R} alt="" />
            <img className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]" src={K} alt="" />
          </div>

          <div className="titleLine bg-transparent flex flex-row items-center gap-[0px] justify-center w-auto">
            <img className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]" src={A} alt="" />
            <img className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]" src={V} alt="" />
            <img className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]" src={E} alt="" />
            <img className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]" src={W} alt="" />
            <img className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]" src={O} alt="" />
            <img className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]" src={R} alt="" />
            <img className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]" src={K} alt="" />
            <img className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]" src={W} alt="" />
          </div>

          <div className="titleLine bg-transparent flex flex-row items-center gap-[0px] justify-center w-auto">
            <img className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]" src={W} alt="" />
            <img className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]" src={A} alt="" />
            <img className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]" src={V} alt="" />
            <img className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]" src={E} alt="" />
            <img className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]" src={W} alt="" />
            <img className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]" src={O} alt="" />
            <img className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]" src={R} alt="" />
            <img className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]" src={K} alt="" />
          </div>

          <div className="titleLine bg-transparent flex flex-row items-center gap-[0px] justify-center w-auto">
            <img className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]" src={A} alt="" />
            <img className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]" src={V} alt="" />
            <img className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]" src={E} alt="" />
            <img className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]" src={W} alt="" />
            <img className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]" src={O} alt="" />
            <img className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]" src={R} alt="" />
            <img className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]" src={K} alt="" />
            <img className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]" src={W} alt="" />
          </div>

          <div className="titleLine bg-transparent flex flex-row items-center gap-[0px] justify-center w-auto">
            <img className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]" src={W} alt="" />
            <img className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]" src={A} alt="" />
            <img className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]" src={V} alt="" />
            <img className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]" src={E} alt="" />
            <img className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]" src={W} alt="" />
            <img className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]" src={O} alt="" />
            <img className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]" src={R} alt="" />
            <img className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]" src={K} alt="" />
          </div>

          <div className="titleLine bg-transparent flex flex-row items-center gap-[0px] justify-center w-auto">
            <img className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]" src={A} alt="" />
            <img className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]" src={V} alt="" />
            <img className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]" src={E} alt="" />
            <img className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]" src={W} alt="" />
            <img className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]" src={O} alt="" />
            <img className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]" src={R} alt="" />
            <img className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]" src={K} alt="" />
            <img className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]" src={W} alt="" />
          </div>

          <div className="titleLine bg-transparent flex flex-row items-center gap-[0px] justify-center w-auto">
            <img className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]" src={W} alt="" />
            <img className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]" src={A} alt="" />
            <img className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]" src={V} alt="" />
            <img className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]" src={E} alt="" />
            <img className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]" src={W} alt="" />
            <img className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]" src={O} alt="" />
            <img className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]" src={R} alt="" />
            <img className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]" src={K} alt="" />
          </div>

          <div className="titleLine bg-transparent flex flex-row items-center gap-[0px] justify-center w-auto">
            <img className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]" src={A} alt="" />
            <img className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]" src={V} alt="" />
            <img className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]" src={E} alt="" />
            <img className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]" src={W} alt="" />
            <img className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]" src={O} alt="" />
            <img className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]" src={R} alt="" />
            <img className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]" src={K} alt="" />
            <img className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]" src={W} alt="" />
          </div>
        </div>
      </div>
    </>
  );
});

AdminDashboard.displayName = 'AdminDashboard';

export default AdminDashboard;