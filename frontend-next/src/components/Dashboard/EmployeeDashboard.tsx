'use client';

import React, { useContext, useEffect, useRef, useState, useCallback, memo } from "react";
import { redirect } from "next/navigation";
import TaskList from "@/components/TaskList/TaskList";
import HeaderUser from "@/components/HeaderUser";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { AuthContext } from "@/context/AuthProvider";
import { taskAPI, invitationAPI } from "@/services/api";
import styles from "./Dashboard.module.css";

interface Task {
  id: number;
  title: string;
  description: string;
  category: string;
  due_date: string;
  status: string;
}

interface TaskCounts {
  active: number;
  new_task: number;
  completed: number;
  failed: number;
}

interface Invitation {
  id: number;
  admin_name: string;
  status: string;
}

const EmployeeDashboard = memo(() => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskCounts, setTaskCounts] = useState<TaskCounts>({ active: 0, new_task: 0, completed: 0, failed: 0 });
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);
  const [error, setError] = useState("");
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [invitationLoading, setInvitationLoading] = useState(false);

  const firstWaveRef = useRef<HTMLDivElement>(null);
  const thirdWaveRef = useRef<HTMLDivElement>(null);
  const { userData, isLoading: authLoading } = useContext(AuthContext);

  const fetchMyTasks = useCallback(async () => {
    try {
      setIsLoadingTasks(true); setError("");
      const [tasksResponse, countsResponse] = await Promise.all([taskAPI.getMyTasks(), taskAPI.getMyTaskCounts()]);
      setTasks(tasksResponse.data.data);
      setTaskCounts(countsResponse.data.data);
    } catch {
      setError("Failed to load tasks. Please refresh.");
    } finally {
      setIsLoadingTasks(false);
    }
  }, []);

  const refreshTasks = useCallback(() => { fetchMyTasks(); }, [fetchMyTasks]);

  useEffect(() => {
    if (userData && userData.role === 'employee') fetchMyTasks();
  }, [userData, fetchMyTasks]);

  const fetchInvitations = useCallback(async () => {
    try {
      const res = await invitationAPI.getMyInvitations();
      setInvitations(res.data.data);
    } catch { /* silently fail */ }
  }, []);

  useEffect(() => {
    if (userData && userData.role === 'employee') fetchInvitations();
  }, [userData, fetchInvitations]);

  const handleRespondInvitation = async (invitationId: number, status: string) => {
    setInvitationLoading(true);
    try {
      await invitationAPI.respondToInvitation(invitationId, status);
      await fetchInvitations();
      if (status === 'accepted') alert('You have joined the team! 🎉');
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { error?: string } } };
      alert(axiosError.response?.data?.error || `Failed to ${status} invitation`);
    } finally {
      setInvitationLoading(false);
    }
  };

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

  if (!userData || userData.role !== 'employee') {
    redirect("/login");
  }

  if (isLoadingTasks) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.loadingCenter}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.employeeWrap}>
      <HeaderUser firstWaveRef={firstWaveRef} thirdWaveRef={thirdWaveRef} changeUser={() => {}} data={userData?.data} user={userData?.data?.email} />
      <div className={`employeeDashboard ${styles.employeeDashboardContent}`}>
        {error && (
          <div className={styles.errorBar}>
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
                    <button onClick={() => handleRespondInvitation(inv.id, 'accepted')} disabled={invitationLoading} className={styles.acceptBtn}>Accept</button>
                    <button onClick={() => handleRespondInvitation(inv.id, 'rejected')} disabled={invitationLoading} className={styles.declineBtn}>Decline</button>
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
