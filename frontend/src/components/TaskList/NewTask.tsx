import React, { useRef, useState } from "react";
import { taskAPI } from "../../services/api";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import type { Task } from "../../types";

interface NewTaskProps {
  data: Task;
  refreshTasks?: () => void;
}

const NewTask: React.FC<NewTaskProps> = ({ data, refreshTasks }) => {
  console.log('🔄 NewTask RE-RENDERED for:', data.title);
  
  const taskBoxRef = useRef<HTMLDivElement>(null);
  const hoverTransitionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLHeadingElement>(null);
  const hasAnimatedRef = useRef(false);

  const [isAccepting, setIsAccepting] = useState(false);

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
      console.log("✅ Task accepted:", data.title);
      
      // Refresh tasks from parent
      if (refreshTasks) {
        refreshTasks();
      }
    } catch (error) {
      console.error("❌ Failed to accept task:", error);
      alert("Failed to accept task. Please try again.");
    } finally {
      setIsAccepting(false);
    }
  };

  return (
    <div
      ref={taskBoxRef}
      className="overflow-hidden relative flex-shrink-0 h-[300px] w-[320px] bg-[#ad9676] rounded-se-[42px] rounded-es-[42px] rounded-ee-[42px] ml-2 z-1"
    >
      <div className="bg-transparent absolute z-10 h-full w-full">
        <div className="bg-transparent flex justify-between items-center p-2">
          <h3
            ref={categoryRef}
            className="beforeHover bg-[#8b6c3e] rounded-se-[13px] rounded-es-[13px] rounded-ee-[13px] px-3 py-1 text-[16px] text-[#cec0ad] font-medium opacity-1"
          >
            {data?.category}
          </h3>

          <h3
            ref={dateRef}
            className="bg-transparent text-sm text-[#f9ff83] text-[18px] font-semibold px-5 py-4 opacity-1"
          >
            {data?.due_date}
          </h3>
        </div>

        <div
          ref={titleRef}
          className="beforeHover absolute p-2 bg-transparent ml-4 text-5xl text-blue-200 font-black opacity-1"
        >
          {data?.title}
        </div>

        <div
          ref={descriptionRef}
          className="afterHover bg-transparent text-[20px] px-[25px] text-[#3b3123] font-extrabold mt-[5%] opacity-0"
        >
          {data?.description}
        </div>
      </div>

      <div
        ref={buttonRef}
        className="afterHover absolute bottom-4 left-5 flex justify-between m-4 bg-transparent z-10 opacity-0"
      >
        <button
          onClick={handleAcceptTask}
          disabled={isAccepting}
          className="bg-transparent text-[33px] text-yellow-200 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAccepting ? "Accepting..." : "Accept"}
        </button>
      </div>

      <div
        ref={hoverTransitionRef}
        className="hoverTransition bg-[#bdab91] rounded-full w-[0px] h-[0px] -translate-x-1/2 -translate-y-1/2 absolute z-0"
      ></div>
    </div>
  );
};

export default NewTask;
