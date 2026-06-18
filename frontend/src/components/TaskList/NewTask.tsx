import React, { useRef, useState } from "react";
import { taskAPI } from "../../services/api";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import type { Task } from "../../types";
import TaskAttachments, { AttachmentBadge, CommentBadge } from "./TaskAttachments";
import TaskCommentsModal from "./TaskCommentsModal";
import styles from "./TaskCard.module.css";

interface NewTaskProps {
  data: Task;
  refreshTasks?: () => void;
}

const NewTask: React.FC<NewTaskProps> = ({ data, refreshTasks }) => {
  console.log('NewTask RE-RENDERED for:', data.title);
  
  const taskBoxRef = useRef<HTMLDivElement>(null);
  const hoverTransitionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLHeadingElement>(null);
  const hasAnimatedRef = useRef(false);

  const [isAccepting, setIsAccepting] = useState(false);
  const [showComments, setShowComments] = useState(false);

  useGSAP(() => {
    const box = taskBoxRef.current;
    const hover = hoverTransitionRef.current;
    const title = titleRef.current;
    const category = categoryRef.current;
    const description = descriptionRef.current;
    const button = buttonRef.current;
    const date = dateRef.current;

    if (!hasAnimatedRef.current) {
      gsap.from(box, {
        scale: 0,
        duration: 0.6,
        delay: 0.4,
        x: -160,
        y: -150,
      });
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

  const handleAcceptTask = async () => {
    setIsAccepting(true);
    
    try {
      await taskAPI.acceptTask(data.id);
      console.log("Task accepted:", data.title);
      
      // Refresh tasks from parent
      if (refreshTasks) {
        refreshTasks();
      }
    } catch (error) {
      console.error("Failed to accept task:", error);
      alert("Failed to accept task. Please try again.");
    } finally {
      setIsAccepting(false);
    }
  };

  return (
    <div
      ref={taskBoxRef}
      className={`${styles.taskCard} ${data?.is_overdue ? styles.overdue : ''}`}
    >
      <div className={styles.content}>
        <div className={styles.topBar}>
          <h3
            ref={categoryRef}
            className={`beforeHover ${styles.category}`}
          >
            {data?.category}
          </h3>

          <div className={styles.badgesWrap}>
            {data?.is_overdue && (
              <span className={styles.overdueLabel}>OVERDUE</span>
            )}
            <span className={`${styles.priorityBadge} ${styles[`priority_${data?.priority}`]}`}>
              {data?.priority}
            </span>
            <AttachmentBadge count={data?.attachment_count || 0} />
            <CommentBadge count={data?.comment_count || 0} onClick={() => setShowComments(true)} />
          </div>

          <h3
            ref={dateRef}
            className={styles.date}
          >
            {data?.due_date}
          </h3>
        </div>

        <div
          ref={titleRef}
          className={`beforeHover ${styles.title} ${styles.titleBlue}`}
        >
          {data?.title}
        </div>

        <div
          ref={descriptionRef}
          className={`afterHover ${styles.description}`}
        >
          {data?.description}
          <TaskAttachments taskId={data.id} />
        </div>
      </div>

      <div
        ref={buttonRef}
        className={`afterHover ${styles.buttonWrap}`}
      >
        <button
          onClick={handleAcceptTask}
          disabled={isAccepting}
          className={styles.acceptBtn}
        >
          {isAccepting ? "Accepting..." : "Accept"}
        </button>
      </div>

      <div
        ref={hoverTransitionRef}
        className={`hoverTransition ${styles.hoverCircle}`}
      ></div>

      <TaskCommentsModal 
        taskId={data.id} 
        isOpen={showComments} 
        onClose={() => setShowComments(false)} 
      />
    </div>
  );
};

export default NewTask;
