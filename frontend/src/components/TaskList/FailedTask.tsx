import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import type { Task } from "../../types";
import TaskAttachments, { AttachmentBadge } from "./TaskAttachments";
import styles from "./TaskCard.module.css";

interface FailedTaskProps {
  data: Task;
}

const FailedTask: React.FC<FailedTaskProps> = ({ data }) => {
  const taskBoxRef = useRef<HTMLDivElement>(null);
  const hoverTransitionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLHeadingElement>(null);
  const hasAnimatedRef = useRef(false);

  useGSAP(() => {
    const box = taskBoxRef.current;
    const hover = hoverTransitionRef.current;
    const title = titleRef.current;
    const category = categoryRef.current;
    const description = descriptionRef.current;
    const button = buttonRef.current;
    const date = dateRef.current;

    if (!hasAnimatedRef.current) {
      gsap.from(box, { scale: 0, duration: 0.6, delay: 0.4, x: -160, y: -150 });
      hasAnimatedRef.current = true;
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = box!.getBoundingClientRect();
      let x = e.clientX - rect.left;
      let y = e.clientY - rect.top;
      hover!.style.left = `${x}px`;
      hover!.style.top = `${y}px`;
    };

    const handleMouseEnter = () => {
      gsap.killTweensOf([hover, title, category, description, button, date]);
      gsap.to(hover, { duration: 0.6, width: "800px", height: "800px" });
      gsap.to([title, category], { opacity: 0, duration: 0.4 });
      gsap.to([description, button], { opacity: 1, duration: 0.4, delay: 0.2 });
      gsap.to(date, { color: "#3b3123", duration: 0.4 });
    };

    const handleMouseLeave = () => {
      gsap.killTweensOf([hover, title, category, description, button, date]);
      gsap.to(hover, { duration: 0.4, width: "0px", height: "0px" });
      gsap.to([title, category], { opacity: 1, duration: 0.4, delay: 0.2 });
      gsap.to([description, button], { opacity: 0, duration: 0.4 });
      gsap.to(date, { color: "#f9ff83", duration: 0.4 });
    };

    box?.addEventListener("mousemove", handleMouseMove);
    box?.addEventListener("mouseenter", handleMouseEnter);
    box?.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      box?.removeEventListener("mousemove", handleMouseMove);
      box?.removeEventListener("mouseenter", handleMouseEnter);
      box?.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

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
        <div ref={titleRef} className={`beforeHover ${styles.title} ${styles.titleRed}`}>{data?.title}</div>
        <div ref={descriptionRef} className={`afterHover ${styles.description}`}>
          {data?.description}
          <TaskAttachments taskId={data.id} />
        </div>
      </div>

      <div ref={buttonRef} className={`afterHover ${styles.buttonWrap}`}>
        <button className={styles.statusBtn}>Failed</button>
      </div>

      <div ref={hoverTransitionRef} className={`hoverTransition ${styles.hoverCircle}`}></div>
    </div>
  );
};

export default FailedTask;
