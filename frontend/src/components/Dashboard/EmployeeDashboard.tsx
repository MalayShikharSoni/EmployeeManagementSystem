import React, { useContext, useEffect, useRef, useState, useCallback, memo } from "react";
import { Navigate } from "react-router-dom";
import TaskList from "../TaskList/TaskList";
import HeaderUser from "../../pages/HeaderUser";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { AuthContext, type AuthContextType } from "../../context/AuthProvider";
import { useSocket } from "../../context/SocketProvider";
import { taskAPI, invitationAPI, groupAPI } from "../../services/api";
import type { Task, TaskCounts, Invitation, EmployeeGroupTasks } from "../../types";
import styles from "./EmployeeDashboard.module.css";

const EmployeeDashboard = memo(() => {
  console.log('EmployeeDashboard RE-RENDERED');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskCounts, setTaskCounts] = useState<TaskCounts>({ active: 0, new_task: 0, completed: 0, failed: 0 });
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);
  const [error, setError] = useState("");
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [invitationLoading, setInvitationLoading] = useState(false);
  const [myGroups, setMyGroups] = useState<EmployeeGroupTasks[]>([]);
  const firstWaveRef = useRef<HTMLDivElement>(null);
  const thirdWaveRef = useRef<HTMLDivElement>(null);
  const { userData, isLoading: authLoading } = useContext(AuthContext) as AuthContextType;
  const { refreshTrigger } = useSocket();
  const changeUser = useCallback(() => { }, []);

  const fetchMyTasks = useCallback(async () => {
    try {
      setIsLoadingTasks(true); setError("");
      const [tasksResponse, countsResponse] = await Promise.all([taskAPI.getMyTasks(), taskAPI.getMyTaskCounts()]);
      setTasks(tasksResponse.data.data); setTaskCounts(countsResponse.data.data);
      console.log("Tasks fetched:", tasksResponse.data.data);
      console.log("Task counts:", countsResponse.data.data);
    } catch (err) { console.error("Failed to fetch tasks:", err); setError("Failed to load tasks. Please refresh."); }
    finally { setIsLoadingTasks(false); }
  }, []);

  const refreshTasks = useCallback(() => { fetchMyTasks(); }, [fetchMyTasks]);

  useEffect(() => { if (userData && userData.role === 'employee') { fetchMyTasks(); } }, [userData, fetchMyTasks, refreshTrigger]);

  const fetchInvitations = useCallback(async () => {
    try { const res = await invitationAPI.getMyInvitations(); setInvitations(res.data.data); }
    catch (err) { console.error("Failed to fetch invitations:", err); }
  }, []);

  useEffect(() => { if (userData && userData.role === 'employee') { fetchInvitations(); fetchMyGroups(); } }, [userData, fetchInvitations, refreshTrigger]);

  const fetchMyGroups = async () => {
    try {
      const res = await groupAPI.getMyGroupTasks();
      setMyGroups(res.data.data);
    } catch (err) { console.error('Failed to fetch group tasks:', err); }
  };

  const handleRespondInvitation = async (invitationId: number, status: string) => {
    setInvitationLoading(true);
    try {
      await invitationAPI.respondToInvitation(invitationId, status);
      await fetchInvitations();
      if (status === 'accepted') { alert('You have joined the team!'); }
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
            <div className={styles.invitationsTitle}>Team Invitations</div>
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

        {/* My Groups Section */}
        {myGroups.length > 0 && (
          <div className={styles.invitationsSection} style={{ marginTop: '2rem' }}>
            <div className={styles.invitationsTitle}>My Project Groups</div>
            {myGroups.map(group => (
              <div key={group.group_id} style={{ marginBottom: '1.5rem' }}>
                <div 
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', marginBottom: '8px' }}
                  onClick={() => window.location.href = `/groups/${group.group_id}`}
                >
                  <span style={{ fontWeight: 900, fontSize: '1.2rem', color: '#3b3123' }}>{group.group_name}</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ad9676', textDecoration: 'underline' }}>View Details</span>
                </div>
                {group.tasks.length === 0 ? (
                  <div style={{ color: '#ad9676', fontWeight: 700, fontSize: '0.95rem' }}>No active tasks in this group.</div>
                ) : (
                  group.tasks.map(task => (
                    <div key={task.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', backgroundColor: '#cec0ad', borderRadius: '10px', marginBottom: '6px', flexWrap: 'wrap', gap: '8px' }}>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 800, color: '#3b3123' }}>{task.title}</span>
                        <span style={{ padding: '2px 10px', borderRadius: '12px', fontWeight: 800, fontSize: '0.7rem', textTransform: 'uppercase', color: '#fff', backgroundColor: task.priority === 'urgent' ? '#d62828' : task.priority === 'high' ? '#e07b39' : task.priority === 'medium' ? '#f4a261' : '#8b6c3e' }}>{task.priority}</span>
                        <span style={{ fontWeight: 700, fontSize: '0.8rem', color: '#8b6c3e', textTransform: 'uppercase' }}>{task.status}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        {task.due_date && <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#8b6c3e' }}>{new Date(task.due_date).toLocaleDateString()}</span>}
                        {task.status === 'new' && (
                          <button onClick={async (e) => { e.stopPropagation(); await groupAPI.updateTaskStatus(group.group_id, task.id, 'active'); fetchMyGroups(); }} style={{ background: '#2a9d8f', color: '#fff', border: 'none', padding: '5px 12px', borderRadius: '8px', fontWeight: 800, cursor: 'pointer', fontSize: '0.8rem' }}>Accept</button>
                        )}
                        {task.status === 'active' && (
                          <button onClick={async (e) => { e.stopPropagation(); await groupAPI.updateTaskStatus(group.group_id, task.id, 'completed'); fetchMyGroups(); }} style={{ background: '#2a9d8f', color: '#fff', border: 'none', padding: '5px 12px', borderRadius: '8px', fontWeight: 800, cursor: 'pointer', fontSize: '0.8rem' }}>Complete</button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

EmployeeDashboard.displayName = 'EmployeeDashboard';
export default EmployeeDashboard;
