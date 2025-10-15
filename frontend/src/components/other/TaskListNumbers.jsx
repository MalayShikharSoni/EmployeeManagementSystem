import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthProvider";

const TaskListNumbers = () => {
  // const { taskNumbers } = data;

  // console.log(taskNumbers)

  const [userData, setuserData] = useContext(AuthContext);

  const CurrentUser = userData.loggedInUser;

  // console.log('TaskListNumbers ka userData: ',CurrentUser?.data.taskNumbers.newTask)
  // console.log('uska taskNumbers: ',userData.loggedInUser.data.taskNumbers)

  return (
    <div className="flex p-10 justify-between gap-5 screen bg-transparent">
      <div className="rounded-xl w-[45%] px-9 py-6 bg-blue-400">
        <h2 className="bg-blue-400 text-3xl font-semibold">
          {CurrentUser?.data.taskNumbers.newTask}
        </h2>
        <h3 className="bg-blue-400 text-xl font-medium">New Task</h3>
      </div>

      <div className="rounded-xl w-[45%] px-9 py-6 bg-yellow-400">
        <h2 className="bg-yellow-400 text-3xl font-semibold">
          {CurrentUser?.data.taskNumbers.active}
        </h2>
        <h3 className="bg-yellow-400 text-xl font-medium">Active Task</h3>
      </div>

      <div className="rounded-xl w-[45%] px-9 py-6 bg-green-400">
        <h2 className="bg-green-400 text-3xl font-semibold">
          {CurrentUser?.data.taskNumbers.completed}
        </h2>
        <h3 className="bg-green-400 text-xl font-medium">Completed Task</h3>
      </div>

      <div className="rounded-xl w-[45%] px-9 py-6 bg-red-400">
        <h2 className="bg-red-400 text-3xl font-semibold">
          {CurrentUser?.data.taskNumbers.failed}
        </h2>
        <h3 className="bg-red-400 text-xl font-medium">Failed Task</h3>
      </div>
    </div>
  );
};

export default TaskListNumbers;
