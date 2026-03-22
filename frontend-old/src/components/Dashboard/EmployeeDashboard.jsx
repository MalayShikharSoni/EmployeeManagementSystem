import React, { useContext, useEffect, useRef, useState, useCallback, memo } from "react";
import { Navigate } from "react-router-dom";
import TaskList from "../TaskList/TaskList";
import HeaderUser from "../../pages/HeaderUser";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { AuthContext } from "../../context/AuthProvider";
import { taskAPI, invitationAPI } from "../../services/api";

const EmployeeDashboard = memo(() => {
  console.log('🔄 EmployeeDashboard RE-RENDERED');

  const [tasks, setTasks] = useState([]);
  const [taskCounts, setTaskCounts] = useState({
    active: 0,
    new_task: 0,
    completed: 0,
    failed: 0
  });
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);
  const [error, setError] = useState("");
  const [invitations, setInvitations] = useState([]);
  const [invitationLoading, setInvitationLoading] = useState(false);

  const firstWaveRef = useRef(null);
  const thirdWaveRef = useRef(null);

  const { userData, isLoading: authLoading } = useContext(AuthContext);

  const changeUser = useCallback(() => { }, []);

  // ──────────────────────────────────────────────────────────
  // DECLARE fetchMyTasks FIRST (as a regular function)
  // ──────────────────────────────────────────────────────────
  const fetchMyTasks = useCallback(async () => {
    try {
      setIsLoadingTasks(true);
      setError("");

      const [tasksResponse, countsResponse] = await Promise.all([
        taskAPI.getMyTasks(),
        taskAPI.getMyTaskCounts()
      ]);

      setTasks(tasksResponse.data.data);
      setTaskCounts(countsResponse.data.data);

      console.log("✅ Tasks fetched:", tasksResponse.data.data);
      console.log("✅ Task counts:", countsResponse.data.data);
    } catch (err) {
      console.error("❌ Failed to fetch tasks:", err);
      setError("Failed to load tasks. Please refresh.");
    } finally {
      setIsLoadingTasks(false);
    }
  }, []); // Empty dependencies - uses latest state via setters

  // NOW refreshTasks can safely call fetchMyTasks
  const refreshTasks = useCallback(() => {
    fetchMyTasks();
  }, [fetchMyTasks]); // Add fetchMyTasks as dependency

  // Fetch tasks on mount
  useEffect(() => {
    if (userData && userData.role === 'employee') {
      fetchMyTasks();
    }
  }, [userData, fetchMyTasks]);

  // Fetch invitations
  const fetchInvitations = useCallback(async () => {
    try {
      const res = await invitationAPI.getMyInvitations();
      setInvitations(res.data.data);
    } catch (err) {
      console.error("Failed to fetch invitations:", err);
    }
  }, []);

  useEffect(() => {
    if (userData && userData.role === 'employee') {
      fetchInvitations();
    }
  }, [userData, fetchInvitations]);

  const handleRespondInvitation = async (invitationId, status) => {
    setInvitationLoading(true);
    try {
      await invitationAPI.respondToInvitation(invitationId, status);
      await fetchInvitations();
      if (status === 'accepted') {
        alert('You have joined the team! 🎉');
      }
    } catch (err) {
      alert(err.response?.data?.error || `Failed to ${status} invitation`);
    } finally {
      setInvitationLoading(false);
    }
  };

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

  // Check if employee
  if (!userData || userData.role !== 'employee') {
    return <Navigate to="/login" replace />;
  }

  // Tasks loading state
  if (isLoadingTasks) {
    return (
      <div className="w-screen bg-[#cec0ad] flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#ad9676] mb-4"></div>
          <p className="text-2xl font-semibold text-[#9c815a]">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  // Main render
  return (
    <div className="w-screen">
      <HeaderUser
        ref={{ firstWaveRef, thirdWaveRef }}
        changeUser={changeUser}
        data={userData?.data}
        user={userData?.data?.email}
      />

      <div className="employeeDashboard bg-[#cec0ad] p-10 pt-[25vh] max-sm:px-[0px]">
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={fetchMyTasks}
              className="ml-4 px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Retry
            </button>
          </div>
        )}

        {/* Invitation Notifications */}
        {invitations.length > 0 && (
          <div className="mb-8 bg-transparent">
            <div className="text-[#9c815a] font-black text-2xl mb-4 bg-transparent">
              📩 Team Invitations
            </div>
            <div className="flex flex-col gap-3 bg-transparent">
              {invitations.map((inv) => (
                <div
                  key={inv.id}
                  className="bg-[#ad9676] rounded-se-[20px] rounded-es-[20px] rounded-ee-[20px] p-5 flex flex-row items-center justify-between max-sm:flex-col max-sm:gap-3"
                >
                  <div className="bg-transparent">
                    <span className="text-[#cec0ad] font-black text-lg bg-transparent">
                      {inv.admin_name}
                    </span>
                    <span className="text-[#cec0ad] font-bold text-sm ml-2 opacity-80 bg-transparent">
                      wants you to join their team
                    </span>
                  </div>
                  <div className="flex gap-2 bg-transparent">
                    <button
                      onClick={() => handleRespondInvitation(inv.id, 'accepted')}
                      disabled={invitationLoading}
                      className="bg-[#8b6c3e] text-[#cec0ad] font-bold px-5 py-2 rounded-se-[12px] rounded-es-[12px] rounded-ee-[12px] hover:bg-[#7a5622] transition-colors disabled:opacity-50"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleRespondInvitation(inv.id, 'rejected')}
                      disabled={invitationLoading}
                      className="bg-[#cec0ad] text-[#9c815a] font-bold px-5 py-2 rounded-se-[12px] rounded-es-[12px] rounded-ee-[12px] hover:bg-[#c4b49e] transition-colors disabled:opacity-50"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <TaskList
          tasks={tasks}
          taskCounts={taskCounts}
          refreshTasks={refreshTasks}
          data={userData?.data}
        />
      </div>
    </div>
  );
});

EmployeeDashboard.displayName = 'EmployeeDashboard';

export default EmployeeDashboard;