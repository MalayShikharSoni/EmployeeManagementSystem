import React, { useContext, useEffect, useRef, useState, useCallback, memo } from "react";
import { Navigate } from "react-router-dom";
import TaskList from "../TaskList/TaskList";
import HeaderUser from "../../pages/HeaderUser";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { AuthContext, type AuthContextType } from "../../context/AuthProvider";
import { taskAPI, invitationAPI } from "../../services/api";
import type { Task, TaskCounts, Invitation } from "../../types";
import styles from "./EmployeeDashboard.module.css";

const EmployeeDashboard = memo(() => {
  console.log('🔄 EmployeeDashboard RE-RENDERED');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskCounts, setTaskCounts] = useState<TaskCounts>({ active: 0, new_task: 0, completed: 0, failed: 0 });
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);
  const [error, setError] = useState("");
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [invitationLoading, setInvitationLoading] = useState(false);
  const firstWaveRef = useRef<HTMLDivElement>(null);
  const thirdWaveRef = useRef<HTMLDivElement>(null);
  const { userData, isLoading: authLoading } = useContext(AuthContext) as AuthContextType;
  const changeUser = useCallback(() => { }, []);

  const fetchMyTasks = useCallback(async () => {
    try {
      setIsLoadingTasks(true); setError("");
      const [tasksResponse, countsResponse] = await Promise.all([taskAPI.getMyTasks(), taskAPI.getMyTaskCounts()]);
      setTasks(tasksResponse.data.data); setTaskCounts(countsResponse.data.data);
      console.log("✅ Tasks fetched:", tasksResponse.data.data);
      console.log("✅ Task counts:", countsResponse.data.data);
    } catch (err) { console.error("❌ Failed to fetch tasks:", err); setError("Failed to load tasks. Please refresh."); }
    finally { setIsLoadingTasks(false); }
  }, []);

  const refreshTasks = useCallback(() => { fetchMyTasks(); }, [fetchMyTasks]);

  useEffect(() => { if (userData && userData.role === 'employee') { fetchMyTasks(); } }, [userData, fetchMyTasks]);

  const fetchInvitations = useCallback(async () => {
    try { const res = await invitationAPI.getMyInvitations(); setInvitations(res.data.data); }
    catch (err) { console.error("Failed to fetch invitations:", err); }
  }, []);

  useEffect(() => { if (userData && userData.role === 'employee') { fetchInvitations(); } }, [userData, fetchInvitations]);

  const handleRespondInvitation = async (invitationId: number, status: string) => {
    setInvitationLoading(true);
    try {
      await invitationAPI.respondToInvitation(invitationId, status);
      await fetchInvitations();
      if (status === 'accepted') { alert('You have joined the team! 🎉'); }
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } } };
      alert(e.response?.data?.error || `Failed to ${status} invitation`);
    } finally { setInvitationLoading(false); }
  };

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
  if (!userData || userData.role !== 'employee') { return <Navigate to="/login" replace />; }
  if (isLoadingTasks) {
    return (<div className={styles.loadingContainer}><div className={styles.loadingContent}>
      <div className={styles.spinner}></div>
      <p className={styles.loadingText}>Loading your tasks...</p></div></div>);
  }

  return (
    <div className={styles.wrapper}>
      <HeaderUser ref={{ firstWaveRef, thirdWaveRef } as unknown as React.Ref<unknown>} changeUser={changeUser} data={userData?.data} user={userData?.data?.email} />
      <div className={`employeeDashboard ${styles.dashboard}`}>
        {error && (
          <div className={styles.errorBox}>
            <span>{error}</span>
            <button onClick={fetchMyTasks} className={styles.retryBtn}>Retry</button>
          </div>
        )}
        {invitations.length > 0 && (
          <div className={styles.invitationsSection}>
            <div className={styles.invitationsTitle}>📩 Team Invitations</div>
            <div className={styles.invitationsList}>
              {invitations.map((inv) => (
                <div key={inv.id} className={styles.invitationCard}>
                  <div className={styles.invitationInfo}>
                    <span className={styles.invitationName}>{inv.admin_name}</span>
                    <span className={styles.invitationText}>wants you to join their team</span>
                  </div>
                  <div className={styles.invitationActions}>
                    <button onClick={() => handleRespondInvitation(inv.id, 'accepted')} disabled={invitationLoading}
                      className={styles.acceptBtn}>Accept</button>
                    <button onClick={() => handleRespondInvitation(inv.id, 'rejected')} disabled={invitationLoading}
                      className={styles.declineBtn}>Decline</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <TaskList tasks={tasks} taskCounts={taskCounts} refreshTasks={refreshTasks} data={userData?.data} />
      </div>
    </div>
  );
});

EmployeeDashboard.displayName = 'EmployeeDashboard';
export default EmployeeDashboard;
