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
import styles from "./Dashboard.module.css";

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
      <div className={styles.loadingScreen}>
        <div className={styles.loadingCenter}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Checking authentication...</p>
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
      <div className={styles.dashboardRow}>
        <div className={styles.mainContent}>
          <div className={`adminDashboard ${styles.dashboardBg}`}>
            <TeamManagement />
            <CreateTask onTaskCreated={handleTaskCreated} />
            <AllTasks refreshTrigger={refreshTrigger} />
          </div>
        </div>

        <div className={styles.sidebar}>
          {TITLE_LINES.map((line, lineIdx) => (
            <div key={lineIdx} className={`titleLine ${styles.titleLine}`}>
              {line.map((letter, i) => (
                <Image key={i} className={`titleLineLetter ${lineIdx % 2 === 0 ? 'titleLineLetter1' : 'titleLineLetter2'} ${styles.titleLetterImg}`}
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
