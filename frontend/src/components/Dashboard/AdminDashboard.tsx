import React, { useContext, useRef, memo, useCallback, useState } from "react";
import { Navigate } from "react-router-dom";
import CreateTask from "../other/CreateTask";
import AllTasks from "../other/AllTasks";
import TeamManagement from "../other/TeamManagement";
import { AuthContext, type AuthContextType } from "../../context/AuthProvider";
import { useSocket } from "../../context/SocketProvider";
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
import styles from "./AdminDashboard.module.css";

const AdminDashboard = memo(() => {
  const firstWaveRef = useRef<HTMLDivElement>(null);
  const thirdWaveRef = useRef<HTMLDivElement>(null);
  const { userData, isLoading: authLoading } = useContext(AuthContext) as AuthContextType;
  const { refreshTrigger: socketRefreshTrigger } = useSocket();
  const [localRefreshTrigger, setLocalRefreshTrigger] = useState(0);
  const handleTaskCreated = useCallback(() => { setLocalRefreshTrigger(prev => prev + 1); }, []);
  const changeUser = useCallback(() => { }, []);
  
  const combinedRefreshTrigger = localRefreshTrigger + socketRefreshTrigger;

  useGSAP(() => {
    if (!firstWaveRef.current || !thirdWaveRef.current) return;
    gsap.fromTo(firstWaveRef.current, { x: 0 }, { x: "-40vw", ease: "none", scrollTrigger: { trigger: ".employeeDashboard", start: "top top", end: "bottom top", scrub: 1 } });
    gsap.fromTo(thirdWaveRef.current, { x: 0 }, { x: "42.5vw", ease: "none", scrollTrigger: { trigger: ".employeeDashboard", start: "top top", end: "bottom top", scrub: 1, markers: false } });
  }, []);

  if (authLoading) {
    return (<div className={styles.loadingContainer}><div className={styles.loadingContent}>
      <div className={styles.spinner}></div>
      <p className={styles.loadingText}>Checking authentication...</p></div></div>);
  }
  if (!userData || userData.role !== 'admin') { return <Navigate to="/login" replace />; }

  return (
    <>
      <HeaderUser ref={{ firstWaveRef, thirdWaveRef } as unknown as React.Ref<unknown>} data={userData.data} changeUser={() => { }} />
      <div className={styles.dashLayout}>
        <div className={styles.mainContent}>
          <div className={`adminDashboard ${styles.dashContent}`}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '2rem 3vw 0' }}>
              <button 
                onClick={() => window.location.href = '/leaderboard'}
                style={{ 
                  background: '#f4a261', 
                  color: '#fff', 
                  border: 'none', 
                  padding: '12px 24px', 
                  borderRadius: '12px', 
                  fontWeight: 900, 
                  fontSize: '1.2rem', 
                  cursor: 'pointer', 
                  boxShadow: '0 4px 15px rgba(244, 162, 97, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'transform 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                View EOM Leaderboard
              </button>
            </div>
            <TeamManagement /><CreateTask onTaskCreated={handleTaskCreated} /><AllTasks refreshTrigger={combinedRefreshTrigger} />
          </div>
        </div>
        <div className={styles.sidebar}>
          {[["V","E","W","O","R","K","W","A"],["W","O","R","K","W","A","V","E"],["O","R","K","W","A","V","E","W"],["R","K","W","A","V","E","W","O"],["K","W","A","V","E","W","O","R"],["W","A","V","E","W","O","R","K"],["A","V","E","W","O","R","K","W"],["W","A","V","E","W","O","R","K"],["A","V","E","W","O","R","K","W"],["W","A","V","E","W","O","R","K"],["A","V","E","W","O","R","K","W"],["W","A","V","E","W","O","R","K"]].map((row, i) => {
            const letterClass = i % 2 === 0 ? "titleLineLetter1" : "titleLineLetter2";
            const svgMap: Record<string, string> = { V, E, W, O, R, K, A };
            return (
              <div key={i} className={`titleLine ${styles.titleLine}`}>
                {row.map((letter, j) => <img key={j} className={`titleLineLetter ${letterClass} ${styles.letterImg}`} src={svgMap[letter]} alt="" />)}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
});

AdminDashboard.displayName = 'AdminDashboard';
export default AdminDashboard;
