'use client';

import React, { useContext, useEffect, useRef, useState, useCallback, memo } from "react";
import { redirect } from "next/navigation";
import TaskList from "@/components/TaskList/TaskList";
import HeaderUser from "@/components/HeaderUser";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { AuthContext } from "@/context/AuthProvider";
import { taskAPI, invitationAPI } from "@/services/api";

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
    return (<div className="w-screen bg-[#cec0ad] flex items-center justify-center h-screen"><div className="text-center"><div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#ad9676] mb-4"></div><p className="text-2xl font-semibold text-[#9c815a]">Checking authentication...</p></div></div>);
  }

  if (!userData || userData.role !== 'employee') {
    redirect("/login");
  }

  if (isLoadingTasks) {
    return (<div className="w-screen bg-[#cec0ad] flex items-center justify-center h-screen"><div className="text-center"><div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#ad9676] mb-4"></div><p className="text-2xl font-semibold text-[#9c815a]">Loading your tasks...</p></div></div>);
  }

  return (
    <div className="w-screen">
      <HeaderUser firstWaveRef={firstWaveRef} thirdWaveRef={thirdWaveRef} changeUser={() => {}} data={userData?.data} user={userData?.data?.email} />
      <div className="employeeDashboard bg-[#cec0ad] p-10 pt-[25vh] max-sm:px-[0px]">
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex justify-between items-center">
            <span>{error}</span>
            <button onClick={fetchMyTasks} className="ml-4 px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600">Retry</button>
          </div>
        )}
        {invitations.length > 0 && (
          <div className="mb-8 bg-transparent">
            <div className="text-[#9c815a] font-black text-2xl mb-4 bg-transparent">📩 Team Invitations</div>
            <div className="flex flex-col gap-3 bg-transparent">
              {invitations.map((inv) => (
                <div key={inv.id} className="bg-[#ad9676] rounded-se-[20px] rounded-es-[20px] rounded-ee-[20px] p-5 flex flex-row items-center justify-between max-sm:flex-col max-sm:gap-3">
                  <div className="bg-transparent">
                    <span className="text-[#cec0ad] font-black text-lg bg-transparent">{inv.admin_name}</span>
                    <span className="text-[#cec0ad] font-bold text-sm ml-2 opacity-80 bg-transparent">wants you to join their team</span>
                  </div>
                  <div className="flex gap-2 bg-transparent">
                    <button onClick={() => handleRespondInvitation(inv.id, 'accepted')} disabled={invitationLoading} className="bg-[#8b6c3e] text-[#cec0ad] font-bold px-5 py-2 rounded-se-[12px] rounded-es-[12px] rounded-ee-[12px] hover:bg-[#7a5622] transition-colors disabled:opacity-50">Accept</button>
                    <button onClick={() => handleRespondInvitation(inv.id, 'rejected')} disabled={invitationLoading} className="bg-[#cec0ad] text-[#9c815a] font-bold px-5 py-2 rounded-se-[12px] rounded-es-[12px] rounded-ee-[12px] hover:bg-[#c4b49e] transition-colors disabled:opacity-50">Decline</button>
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
