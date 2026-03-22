'use client';

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import styles from "./TaskCard.module.css";

interface Task {
  id: number;
  title: string;
  description: string;
  category: string;
  due_date: string;
  status: string;
}

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
      if (hover) { hover.style.left = `${e.clientX - rect.left}px`; hover.style.top = `${e.clientY - rect.top}px`; }
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
    <div ref={taskBoxRef} className={styles.taskCard}>
      <div className={styles.cardContent}>
        <div className={styles.cardHeader}>
          <h3 ref={categoryRef} className={`beforeHover ${styles.categoryBadge}`}>{data?.category}</h3>
          <h3 ref={dateRef} className={styles.dateBadge}>{data?.due_date}</h3>
        </div>
        <div ref={titleRef} className={`beforeHover ${styles.titleFailed}`}>{data?.title}</div>
        <div ref={descriptionRef} className={`afterHover ${styles.descriptionOverlay}`}>{data?.description}</div>
      </div>
      <div ref={buttonRef} className={`afterHover ${styles.buttonOverlay}`}>
        <button className={styles.failedLabel}>Failed</button>
      </div>
      <div ref={hoverTransitionRef} className={`hoverTransition ${styles.hoverTransition}`}></div>
    </div>
  );
};

export default FailedTask;
