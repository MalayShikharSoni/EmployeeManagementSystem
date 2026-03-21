'use client';

import React, { useContext, useRef, memo, useCallback, useState } from "react";
import { redirect } from "next/navigation";
import Image from "next/image";
import CreateTask from "@/components/other/CreateTask";
import AllTasks from "@/components/other/AllTasks";
import TeamManagement from "@/components/other/TeamManagement";
import { AuthContext } from "@/context/AuthProvider";
import HeaderUser from "@/components/HeaderUser";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const LETTERS = [
  { src: "/assets/V.svg", alt: "V" }, { src: "/assets/E.svg", alt: "E" },
  { src: "/assets/W.svg", alt: "W" }, { src: "/assets/O.svg", alt: "O" },
  { src: "/assets/R.svg", alt: "R" }, { src: "/assets/K.svg", alt: "K" },
  { src: "/assets/A.svg", alt: "A" },
];

const TITLE_LINES = [
  ["V","E","W","O","R","K","W","A"], ["W","O","R","K","W","A","V","E"],
  ["O","R","K","W","A","V","E","W"], ["R","K","W","A","V","E","W","O"],
  ["K","W","A","V","E","W","O","R"], ["W","A","V","E","W","O","R","K"],
  ["A","V","E","W","O","R","K","W"], ["W","A","V","E","W","O","R","K"],
  ["A","V","E","W","O","R","K","W"], ["W","A","V","E","W","O","R","K"],
  ["A","V","E","W","O","R","K","W"], ["W","A","V","E","W","O","R","K"],
];

const letterMap: Record<string, string> = {
  V: "/assets/V.svg", E: "/assets/E.svg", W: "/assets/W.svg",
  O: "/assets/O.svg", R: "/assets/R.svg", K: "/assets/K.svg", A: "/assets/A.svg",
};

const AdminDashboard = memo(() => {
  const firstWaveRef = useRef<HTMLDivElement>(null);
  const thirdWaveRef = useRef<HTMLDivElement>(null);
  const { userData, isLoading: authLoading } = useContext(AuthContext);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleTaskCreated = useCallback(() => { setRefreshTrigger(prev => prev + 1); }, []);

  useGSAP(() => {
    if (!firstWaveRef.current || !thirdWaveRef.current) return;
    gsap.fromTo(firstWaveRef.current, { x: 0 }, { x: "-40vw", ease: "none", scrollTrigger: { trigger: ".employeeDashboard", start: "top top", end: "bottom top", scrub: 1 } });
    gsap.fromTo(thirdWaveRef.current, { x: 0 }, { x: "42.5vw", ease: "none", scrollTrigger: { trigger: ".employeeDashboard", start: "top top", end: "bottom top", scrub: 1, markers: false } });
  }, []);

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

  if (!userData || userData.role !== 'admin') {
    redirect("/login");
  }

  return (
    <>
      <HeaderUser firstWaveRef={firstWaveRef} thirdWaveRef={thirdWaveRef} data={userData.data} changeUser={() => {}} />
      <div className="bg-[#cec0ad] flex flex-row">
        <div className="bg-transparent w-[70vw]">
          <div className="adminDashboard bg-[#cec0ad]">
            <TeamManagement />
            <CreateTask onTaskCreated={handleTaskCreated} />
            <AllTasks refreshTrigger={refreshTrigger} />
          </div>
        </div>

        <div className="flex flex-col gap-[20px] h-full rounded-es-[200px] bg-[#ad9676] mb-[16vh] w-[30vw] mt-[16vh] overflow-hidden max-sm:hidden">
          {TITLE_LINES.map((line, lineIdx) => (
            <div key={lineIdx} className="titleLine bg-transparent flex flex-row items-center gap-[0px] justify-center w-auto max-w-[30vw]">
              {line.map((letter, i) => (
                <Image key={i} className={`titleLineLetter ${lineIdx % 2 === 0 ? 'titleLineLetter1' : 'titleLineLetter2'} bg-transparent`}
                  src={letterMap[letter]} alt="" width={80} height={120} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
});

AdminDashboard.displayName = 'AdminDashboard';
export default AdminDashboard;
