'use client';

import React, { useRef, memo } from "react";
import AcceptedTask from "./AcceptedTask";
import NewTask from "./NewTask";
import CompletedTask from "./CompletedTask";
import FailedTask from "./FailedTask";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import styles from "./TaskList.module.css";

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

interface TaskListProps {
  tasks?: Task[];
  taskCounts?: TaskCounts;
  refreshTasks?: () => void;
  data?: unknown;
}

const TaskList = memo<TaskListProps>(({ tasks = [], taskCounts = { active: 0, new_task: 0, completed: 0, failed: 0 }, refreshTasks }) => {
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

      gsap.from(".taskNumberBubble", {
        scale: 0, duration: 0.6, translateX: "-145px", translateY: "-50px", stagger: 0.1,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const EmptyState = () => (
    <div className={styles.emptyStateWrap}>
      <div className={styles.emptyStateBox}>
        <div className={`popupBubble ${styles.popupBubbleWrap}`}>
          <div className={`popupBubble1 ${styles.bubble}`}></div>
          <div className={`popupBubble2 ${styles.bubble}`}></div>
          <div className={`popupBubble3 ${styles.bubble}`}></div>
        </div>
        <div className={`popupText ${styles.emptyText}`}>
          No Such Tasks
        </div>
      </div>
    </div>
  );

  const TaskCountBubble = ({ count, label }: { count: number; label: string }) => (
    <div className={`taskNumberBubble ${styles.taskNumberBubble}`}>
      <span className={styles.bubbleCount}>{count ?? 0}</span>
      <span className={styles.bubbleLabel}>{label}</span>
    </div>
  );

  const TaskRow = ({ children }: { children: React.ReactNode }) => (
    <div className={styles.taskRow}>
      {children}
    </div>
  );

  return (
    <div ref={containerRef} className={styles.container}>
      <TaskCountBubble count={taskCounts.new_task} label="New Tasks" />
      <TaskRow>
        {newTasks.length > 0 ? newTasks.map((task) => <NewTask key={task.id} data={task} refreshTasks={refreshTasks} />) : <EmptyState />}
      </TaskRow>

      <TaskCountBubble count={taskCounts.active} label="Active Tasks" />
      <TaskRow>
        {activeTasks.length > 0 ? activeTasks.map((task) => <AcceptedTask key={task.id} data={task} refreshTasks={refreshTasks} />) : <EmptyState />}
      </TaskRow>

      <TaskCountBubble count={taskCounts.completed} label="Completed Tasks" />
      <TaskRow>
        {completedTasks.length > 0 ? completedTasks.map((task) => <CompletedTask key={task.id} data={task} />) : <EmptyState />}
      </TaskRow>

      <TaskCountBubble count={taskCounts.failed} label="Failed Tasks" />
      <TaskRow>
        {failedTasks.length > 0 ? failedTasks.map((task) => <FailedTask key={task.id} data={task} />) : <EmptyState />}
      </TaskRow>
    </div>
  );
});

TaskList.displayName = 'TaskList';
export default TaskList;
