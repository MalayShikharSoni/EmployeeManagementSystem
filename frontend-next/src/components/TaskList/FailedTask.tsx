'use client';

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

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
    <div ref={taskBoxRef} className="overflow-hidden relative flex-shrink-0 h-[300px] w-[320px] bg-[#ad9676] rounded-se-[42px] rounded-es-[42px] rounded-ee-[42px] ml-2 z-1">
      <div className="bg-transparent absolute z-10 h-full w-full">
        <div className="bg-transparent flex justify-between items-center p-2">
          <h3 ref={categoryRef} className="beforeHover bg-[#8b6c3e] rounded-se-[13px] rounded-es-[13px] rounded-ee-[13px] px-3 py-1 text-[16px] text-[#cec0ad] font-medium opacity-1">{data?.category}</h3>
          <h3 ref={dateRef} className="bg-transparent text-sm text-[#f9ff83] text-[18px] font-semibold px-5 py-4 opacity-1">{data?.due_date}</h3>
        </div>
        <div ref={titleRef} className="beforeHover absolute p-2 bg-transparent ml-4 text-5xl text-[#923838] font-black opacity-1">{data?.title}</div>
        <div ref={descriptionRef} className="afterHover bg-transparent text-[20px] px-[25px] text-[#3b3123] font-extrabold mt-[5%] opacity-0">{data?.description}</div>
      </div>
      <div ref={buttonRef} className="afterHover absolute bottom-4 left-5 flex justify-between m-4 bg-transparent z-10 opacity-0">
        <button className="bg-transparent text-[33px] text-gray-300 font-bold cursor-default">Failed</button>
      </div>
      <div ref={hoverTransitionRef} className="hoverTransition bg-[#bdab91] rounded-full w-[0px] h-[0px] -translate-x-1/2 -translate-y-1/2 absolute z-0"></div>
    </div>
  );
};

export default FailedTask;
