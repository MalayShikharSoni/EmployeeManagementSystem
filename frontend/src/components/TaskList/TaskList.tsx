import React, { useRef, memo } from "react";
import AcceptedTask from "./AcceptedTask";
import NewTask from "./NewTask";
import CompletedTask from "./CompletedTask";
import FailedTask from "./FailedTask";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type { Task, TaskCounts, User } from "../../types";

interface TaskListProps {
  tasks?: Task[];
  taskCounts?: TaskCounts;
  refreshTasks?: () => void;
  data?: User;
}

const TaskList = memo<TaskListProps>(({ tasks = [], taskCounts = {} as TaskCounts, refreshTasks }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasAnimatedRef = useRef(false);
  
  const newTasks = tasks.filter(task => task.status === 'new');
  const activeTasks = tasks.filter(task => task.status === 'active');
  const completedTasks = tasks.filter(task => task.status === 'completed');
  const failedTasks = tasks.filter(task => task.status === 'failed');

  useGSAP(() => {
    if (hasAnimatedRef.current || !containerRef.current) return;
    hasAnimatedRef.current = true;
    const ctx = gsap.context(() => {
      const tl1 = gsap.timeline();
      const tl2 = gsap.timeline();
      tl1.to(".popupBubble3", { duration: 0.6, scale: 1.2, yoyo: true, repeat: -1 });
      tl1.to(".popupBubble2", { duration: 0.6, scale: 1.2, delay: 0.3, yoyo: true, repeat: -1 });
      tl1.to(".popupBubble1", { duration: 0.6, scale: 1.2, delay: 0.3, yoyo: true, repeat: -1 });
      tl2.to(".popupBubble", { duration: 3, opacity: 0, repeat: -1, yoyo: true, delay: 4.2 });
      tl1.to(".popupText", { duration: 3, delay: 2, opacity: 1, repeat: -1, yoyo: true });
      gsap.from(".taskNumberBubble", { scale: 0, duration: 0.6, translateX: "-145px", translateY: "-50px", stagger: 0.1 });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const EmptyState = () => (
    <div className="bg-transparent flex items-center justify-center w-full">
      <div className="relative bg-[#ded5c8] rounded-se-[35px] rounded-es-[35px] rounded-ee-[35px] w-[320px] h-[300px]">
        <div className="popupBubble absolute bg-transparent flex flex-row gap-[27px] items-center justify-center top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
          <div className="popupBubble1 w-[35px] h-[35px] bg-[#ad9676] rounded-full"></div>
          <div className="popupBubble2 w-[35px] h-[35px] bg-[#ad9676] rounded-full"></div>
          <div className="popupBubble3 w-[35px] h-[35px] bg-[#ad9676] rounded-full"></div>
        </div>
        <div className="popupText absolute w-auto bg-transparent top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-center text-5xl font-bold text-[#ad9676] opacity-0">
          No Such Tasks
        </div>
      </div>
    </div>
  );

  const TaskCountBubble: React.FC<{ count: number; label: string }> = ({ count, label }) => (
    <div className="taskNumberBubble flex items-baseline bg-transparent border-[4px] border-[#9c815a] rounded-se-[35px] rounded-es-[35px] rounded-ee-[35px] w-[290px] h-[100px]">
      <span className="bg-transparent ml-[20px] mt-[5px] font-bold text-[#9c815a] text-7xl">{count ?? 0}</span>
      <span className="bg-transparent ml-[33px] font-medium text-[#9c815a] text-[23px]">{label}</span>
    </div>
  );

  const TaskRow: React.FC<React.PropsWithChildren> = ({ children }) => (
    <div className="bg-transparent flex overflow-x-auto gap-5 flex-nowrap items-center justify-start h-[55%] w-full py-5 mt-10 mb-[20vh]">
      {children}
    </div>
  );

  return (
    <div ref={containerRef} className="bg-transparent ml-[3vw]">
      <TaskCountBubble count={taskCounts.new_task} label="New Tasks" />
      <TaskRow>
        {newTasks.length > 0 ? newTasks.map((task) => (<NewTask key={task.id} data={task} refreshTasks={refreshTasks} />)) : <EmptyState />}
      </TaskRow>
      <TaskCountBubble count={taskCounts.active} label="Active Tasks" />
      <TaskRow>
        {activeTasks.length > 0 ? activeTasks.map((task) => (<AcceptedTask key={task.id} data={task} refreshTasks={refreshTasks} />)) : <EmptyState />}
      </TaskRow>
      <TaskCountBubble count={taskCounts.completed} label="Completed Tasks" />
      <TaskRow>
        {completedTasks.length > 0 ? completedTasks.map((task) => (<CompletedTask key={task.id} data={task} />)) : <EmptyState />}
      </TaskRow>
      <TaskCountBubble count={taskCounts.failed} label="Failed Tasks" />
      <TaskRow>
        {failedTasks.length > 0 ? failedTasks.map((task) => (<FailedTask key={task.id} data={task} />)) : <EmptyState />}
      </TaskRow>
    </div>
  );
});

TaskList.displayName = 'TaskList';
export default TaskList;
