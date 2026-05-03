import React, { useContext } from "react";
import { AuthContext, type AuthContextType } from "../../context/AuthProvider";

const TaskListNumbers: React.FC = () => {
  const authContext = useContext(AuthContext) as AuthContextType;
  const CurrentUser = authContext.userData;

  return (
    <div className="flex p-10 justify-between gap-5 screen bg-transparent">
      <div className="rounded-xl w-[45%] px-9 py-6 bg-blue-400">
        <h2 className="bg-blue-400 text-3xl font-semibold">{(CurrentUser?.data as unknown as { taskNumbers: { newTask: number } })?.taskNumbers?.newTask}</h2>
        <h3 className="bg-blue-400 text-xl font-medium">New Task</h3>
      </div>
      <div className="rounded-xl w-[45%] px-9 py-6 bg-yellow-400">
        <h2 className="bg-yellow-400 text-3xl font-semibold">{(CurrentUser?.data as unknown as { taskNumbers: { active: number } })?.taskNumbers?.active}</h2>
        <h3 className="bg-yellow-400 text-xl font-medium">Active Task</h3>
      </div>
      <div className="rounded-xl w-[45%] px-9 py-6 bg-green-400">
        <h2 className="bg-green-400 text-3xl font-semibold">{(CurrentUser?.data as unknown as { taskNumbers: { completed: number } })?.taskNumbers?.completed}</h2>
        <h3 className="bg-green-400 text-xl font-medium">Completed Task</h3>
      </div>
      <div className="rounded-xl w-[45%] px-9 py-6 bg-red-400">
        <h2 className="bg-red-400 text-3xl font-semibold">{(CurrentUser?.data as unknown as { taskNumbers: { failed: number } })?.taskNumbers?.failed}</h2>
        <h3 className="bg-red-400 text-xl font-medium">Failed Task</h3>
      </div>
    </div>
  );
};

export default TaskListNumbers;
