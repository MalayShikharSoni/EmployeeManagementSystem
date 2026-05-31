import React, { useRef, useState } from "react";
import { taskAPI } from "../../services/api";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import type { Task } from "../../types";
import TaskAttachments, { AttachmentBadge } from "./TaskAttachments";
import styles from "./TaskCard.module.css";

interface AcceptedTaskProps {
  data: Task;
  refreshTasks?: () => void;
}

const AcceptedTask: React.FC<AcceptedTaskProps> = ({ data, refreshTasks }) => {
  const taskBoxRef = useRef<HTMLDivElement>(null);
  const hoverTransitionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLHeadingElement>(null);
  const hasAnimatedRef = useRef(false);

  const [isProcessing, setIsProcessing] = useState(false);

  useGSAP(() => {
    const box = taskBoxRef.current;
    const hover = hoverTransitionRef.current;
    const title = titleRef.current;
    const category = categoryRef.current;
    const description = descriptionRef.current;
    const button = buttonRef.current;
    const date = dateRef.current;

    // Only animate on first mount
    if (!hasAnimatedRef.current) {
      gsap.from(box, { scale: 0, duration: 0.6, delay: 0.4, x: -160, y: -150 });
      hasAnimatedRef.current = true;
    }

    box?.addEventListener("mousemove", (e: MouseEvent) => {
      const rect = box.getBoundingClientRect();
      let x = e.clientX - rect.left;
      let y = e.clientY - rect.top;
      hover!.style.left = `${x}px`;
      hover!.style.top = `${y}px`;
    });

    box?.addEventListener("mouseenter", () => {
      gsap.killTweensOf([hover, title, category, description, button, date]);
      gsap.to(hover, { duration: 0.6, width: "800px", height: "800px" });
      gsap.to([title, category], { opacity: 0, duration: 0.4 });
      gsap.to([description, button], { opacity: 1, duration: 0.4, delay: 0.2 });
      gsap.to(date, { color: "#3b3123", duration: 0.4 });
    });

    box?.addEventListener("mouseleave", () => {
      gsap.killTweensOf([hover, title, category, description, button, date]);
      gsap.to(hover, { duration: 0.4, width: "0px", height: "0px" });
      gsap.to([title, category], { opacity: 1, duration: 0.4, delay: 0.2 });
      gsap.to([description, button], { opacity: 0, duration: 0.4 });
      gsap.to(date, { color: "#f9ff83", duration: 0.4 });
    });
  }, []);

  const handleCompleteTask = async () => {
    setIsProcessing(true);
    try {
      await taskAPI.completeTask(data.id);
      console.log("Task completed:", data.title);
      if (refreshTasks) { refreshTasks(); }
    } catch (error) {
      console.error("Failed to complete task:", error);
      alert("Failed to complete task. Please try again.");
    } finally { setIsProcessing(false); }
  };

  const handleDeclineTask = async () => {
    setIsProcessing(true);
    try {
      await taskAPI.failTask(data.id);
      console.log("Task declined:", data.title);
      if (refreshTasks) { refreshTasks(); }
    } catch (error) {
      console.error("Failed to decline task:", error);
      alert("Failed to decline task. Please try again.");
    } finally { setIsProcessing(false); }
  };

  return (
    <div ref={taskBoxRef} className={`${styles.taskCard} ${data?.is_overdue ? styles.overdue : ''}`}>
      <div className={styles.content}>
        <div className={styles.topBar}>
          <h3 ref={categoryRef} className={`beforeHover ${styles.category}`}>{data?.category}</h3>
          
          <div className={styles.badgesWrap}>
            {data?.is_overdue && (
              <span className={styles.overdueLabel}>OVERDUE</span>
            )}
            <span className={`${styles.priorityBadge} ${styles[`priority_${data?.priority}`]}`}>
              {data?.priority}
            </span>
            <AttachmentBadge count={data?.attachment_count || 0} />
          </div>

          <h3 ref={dateRef} className={styles.date}>{data?.due_date}</h3>
        </div>
        <div ref={titleRef} className={`beforeHover ${styles.title} ${styles.titleYellow}`}>{data?.title}</div>
        <div ref={descriptionRef} className={`afterHover ${styles.description}`}>
          {data?.description}
          <TaskAttachments taskId={data.id} />
        </div>
      </div>

      <div ref={buttonRef} className={`afterHover ${styles.buttonWrapCenter}`}>
        <button onClick={handleCompleteTask} disabled={isProcessing} className={styles.completeBtn}>Check Off</button>
        <button onClick={handleDeclineTask} disabled={isProcessing} className={styles.declineBtn}>Decline</button>
      </div>

      <div ref={hoverTransitionRef} className={`hoverTransition ${styles.hoverCircle}`}></div>
    </div>
  );
};

export default AcceptedTask;
