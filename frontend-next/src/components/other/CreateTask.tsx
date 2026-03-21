'use client';

import React, { useContext, useEffect, useRef, useState, FormEvent } from "react";
import { AuthContext } from "@/context/AuthProvider";
import { taskAPI, authAPI } from "@/services/api";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

interface Employee {
  id: number;
  first_name: string;
  email: string;
}

interface CreateTaskProps {
  onTaskCreated?: () => void;
}

const CreateTask: React.FC<CreateTaskProps> = ({ onTaskCreated }) => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [assignTo, setAssignTo] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const taskBoxRef = useRef<HTMLButtonElement>(null);
  const hoverTransitionRef = useRef<HTMLDivElement>(null);
  const createButtonTextRef = useRef<HTMLDivElement>(null);

  const { } = useContext(AuthContext);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await authAPI.getEmployees();
        setEmployees(response.data.data);
      } catch (error) {
        console.error("Failed to fetch employees:", error);
      }
    };
    fetchEmployees();
  }, []);

  useGSAP(() => {
    gsap.from(".heading", { opacity: 0, duration: 1 });
    gsap.from(".idCard", { opacity: 0, x: -50, duration: 1, delay: 0.4, ease: "power2" });
    gsap.from(".notepad", { opacity: 0, x: 50, duration: 1, delay: 0.4, ease: "power2" });
    gsap.from(".window", { opacity: 0, y: 150, duration: 1, delay: 0.4, ease: "power2" });

    gsap.from(taskBoxRef.current, { duration: 0.6, delay: 0.4, translateX: "0px", translateY: "0px" });

    const box = taskBoxRef.current;
    const hover = hoverTransitionRef.current;
    const createText = createButtonTextRef.current;

    box?.addEventListener("mousemove", (e) => {
      const rect = box.getBoundingClientRect();
      if (hover) { hover.style.left = `${e.clientX - rect.left}px`; hover.style.top = `${e.clientY - rect.top}px`; }
    });
    box?.addEventListener("mouseenter", () => {
      gsap.killTweensOf([hover, createText]);
      gsap.to(hover, { duration: 0.6, width: "800px", height: "800px" });
      gsap.to(createText, { color: "#ded5c8", duration: 0.4 });
    });
    box?.addEventListener("mouseleave", () => {
      gsap.killTweensOf([hover, createText]);
      gsap.to(hover, { duration: 0.4, width: "0px", height: "0px" });
      gsap.to(createText, { color: "#fff", duration: 0.4 });
    });
  });

  const animateWavyLetters = () => {
    gsap.to(".titleLineLetter1", { y: -10, ease: "back", stagger: -0.05, duration: 0.5 });
    gsap.to(".titleLineLetter2", { y: -10, ease: "back", stagger: 0.05, duration: 0.5, delay: 0.3 });
    gsap.to(".titleLineLetter1", { y: 10, ease: "back", stagger: -0.05, duration: 0.5, delay: 0.3 });
    gsap.to(".titleLineLetter2", { y: 10, ease: "back", stagger: 0.05, duration: 0.5, delay: 0.6 });
  };

  useGSAP(() => {
    gsap.from(".titleLineLetter1", { x: -200, duration: 30, ease: "back.inOut", yoyo: true, repeat: -1 });
    gsap.from(".titleLineLetter2", { x: 200, duration: 30, ease: "back.inOut", yoyo: true, repeat: -1 });
  });

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await taskAPI.createTask({
        title, description, category, date, assignTo: parseInt(assignTo),
      });
      alert(`Task "${title}" assigned successfully!`);
      setTitle(""); setDate(""); setAssignTo(""); setCategory(""); setDescription("");
      if (onTaskCreated) onTaskCreated();
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { error?: string } } };
      alert(axiosError.response?.data?.error || "Failed to create task.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#cec0ad] pt-[24vh]">
      <div className="heading bg-transparent text-[#9c815a] mb-[10vh] text-7xl font-black ml-[3vw]">Assign a Task</div>
      <div className="bg-transparent">
        <form onSubmit={submitHandler} className="ml-[3vw] flex flex-wrap w-[70%] h-full items-start justify-between bg-[#cec0ad]">
          <div className="flex flex-col gap-[5vh] bg-transparent">
            <div className="nameAndCategory flex flex-wrap gap-[4vw] bg-transparent max-sm:gap-[5vh]">
              <div className="bg-transparent">
                <div className="idCard w-[450px] h-[300px] bg-[#ad9676] rounded-[10px] flex flex-col overflow-hidden max-sm:w-[355px]">
                  <div className="flex flex-row gap-[10px] items-center justify-center h-[10%] w-full bg-[#9c815a]">
                    <div className="w-[10px] h-[10px] rounded-full bg-[#cec0ad]"></div>
                    <div className="w-[70px] h-[10px] rounded-full bg-[#cec0ad]"></div>
                    <div className="w-[10px] h-[10px] rounded-full bg-[#cec0ad]"></div>
                  </div>
                  <div className="flex flex-row items-center h-[90%] justify-center bg-transparent">
                    <div className="relative w-[30%] rounded-[5px] m-[10px] h-[130px] bg-[#cec0ad] overflow-hidden">
                      <div className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[62px] h-[62px] rounded-full bg-[#ded5c8]"></div>
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[115px] h-[115px] rounded-full bg-[#ded5c8]"></div>
                    </div>
                    <div className="bg-transparent w-full h-full flex flex-col">
                      <div className="bg-transparent font-black text-[35px] pl-[15px] text-[#cec0ad] w-full mt-[10px]">Assign To :</div>
                      <select value={assignTo} onChange={(e) => setAssignTo(e.target.value)} required
                        className="bg-[#cec0ad] w-[87%] h-[50%] mt-[6px] rounded-[5px] pl-[10px] font-black text-[#9c815a] text-[22px] outline-none focus:bg-[#ded5c8] cursor-pointer">
                        <option value="">Select Employee</option>
                        {employees.map((emp) => (
                          <option key={emp.id} value={emp.id}>{emp.first_name}</option>
                        ))}
                      </select>
                      <div className="filler flex flex-col gap-[18px] mt-[30px] bg-transparent h-full max-sm:w-[85%]">
                        <div className="bg-transparent flex flex-row gap-[8px]">
                          <div className="bg-[#cec0ad] h-[5px] w-[84px] rounded-full"></div>
                          <div className="bg-[#cec0ad] h-[5px] w-[84px] rounded-full"></div>
                          <div className="bg-[#cec0ad] h-[5px] w-[84px] rounded-full"></div>
                        </div>
                        <div className="bg-transparent flex flex-row gap-[8px]">
                          <div className="bg-[#cec0ad] h-[5px] w-[130px] rounded-full"></div>
                          <div className="bg-[#cec0ad] h-[5px] w-[130px] rounded-full"></div>
                        </div>
                        <div className="bg-transparent flex flex-row gap-[8px]">
                          <div className="bg-[#cec0ad] h-[5px] w-[84px] rounded-full"></div>
                          <div className="bg-[#cec0ad] h-[5px] w-[84px] rounded-full"></div>
                          <div className="bg-[#cec0ad] h-[5px] w-[84px] rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="notepad relative bg-[#ad9676] rounded-[10px] w-[450px] h-[300px] flex flex-col items-start justify-center max-sm:w-[355px]">
                <div className="absolute top-[-10px] flex flex-row items-center justify-around w-[100%] bg-transparent">
                  {[...Array(6)].map((_, i) => <div key={i} className="bg-[#9c815a] rounded-[3px] w-[8px] h-[40px]"></div>)}
                </div>
                <div className="top-[-10px] flex flex-row items-center justify-around w-[100%] bg-transparent mt-[8px]">
                  {[...Array(6)].map((_, i) => <div key={i} className="bg-[#cec0ad] rounded-full w-[35px] h-[35px]"></div>)}
                </div>
                <div className="relative h-full w-full flex flex-col items-center justify-center bg-transparent">
                  <div className="absolute flex flex-col gap-[40px] w-full h-full items-center justify-center bg-transparent opacity-[40%]">
                    {[...Array(7)].map((_, i) => <div key={i} className="bg-[#cec0ad] w-full h-[2px]"></div>)}
                  </div>
                  <input value={category} onChange={(e) => setCategory(e.target.value)} required
                    className="translate-y-[-13px] mb-[22.5px] w-full h-full bg-transparent outline-none text-center font-black text-[#ded5c8] text-[38px] placeholder:text-center placeholder:font-black placeholder:text-[#cec0ad] placeholder:text-[38px] placeholder:text-opacity-[70%] z-10"
                    type="text" placeholder="Enter Category" />
                </div>
              </div>
            </div>
            <div className="window flex flex-col items-center w-full h-[300px] rounded-[10px] bg-[#9c815a] mt-[4vh] max-sm:h-[70vh]">
              <div className="flex flex-row gap-[10px] translate-y-[4px] justify-end items-center w-full h-[35px] px-[10px] bg-transparent">
                <div className="h-[3.5px] w-[20px] rounded-full bg-[#cec0ad]"></div>
                <div className="h-[18px] w-[18px] border-[3.5px] border-[#cec0ad] bg-transparent"></div>
                <div className="h-[20px] w-[20px] rounded-full border-[3.5px] border-[#cec0ad] bg-transparent"></div>
              </div>
              <div className="bg-[#9c815a] rounded-[10px] flex flex-row gap-[0%] justify-center items-center p-[10px] h-full w-full max-sm:flex-col max-sm:gap-[10px]">
                <div className="flex rounded-ss-[10px] rounded-es-[10px] flex-col w-[70%] h-full bg-[#ad9676] p-[20px] max-sm:rounded-se-[10px] max-sm:rounded-ee-[10px] max-sm:w-full">
                  <div className="flex flex-col bg-transparent h-full w-full">
                    <div className="flex flex-row w-full h-[40%] bg-transparent max-sm:gap-[12px]">
                      <div className="flex items-center justify-center p-[10px] bg-transparent w-[84%] h-full">
                        <input value={title} onChange={(e) => setTitle(e.target.value)} required
                          className="bg-[#cec0ad] pl-[25px] w-full h-full rounded-[10px] outline-none font-black text-[#9c815a] text-[35px] placeholder:font-bold placeholder:text-[35px] placeholder:text-[#bdab91] max-sm:text-[26px] max-sm:placeholder:text-[26px]"
                          type="text" placeholder="Enter Task Title" />
                      </div>
                      <div className="flex flex-col h-full w-[16%] items-center justify-center bg-transparent">
                        <input value={date} onChange={(e) => setDate(e.target.value)} required
                          className="appearance-none flex justify-center items-center bg-[#cec0ad] outline-none w-[65px] h-[65px] rounded-full text-[#9c815a]"
                          type="date" style={{ color: "#9c815a", backgroundColor: "#cec0ad" }} />
                        <div className="bg-transparent font-bold text-[16px] text-[#9c815a]">{date}</div>
                      </div>
                    </div>
                    <div className="flex bg-transparent h-full w-full p-[10px]">
                      <textarea value={description} onChange={(e) => setDescription(e.target.value)} required
                        className="outline-none w-full h-full bg-[#cec0ad] rounded-[10px] font-bold text-[22px] text-[#9c815a] placeholder:text-[#bdab91] resize-none p-4"
                        placeholder="Enter Task Description" />
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center bg-[#ad9676] rounded-ee-[10px] rounded-se-[10px] h-full w-[30%] max-sm:w-full">
                  <button ref={taskBoxRef} onClick={animateWavyLetters} disabled={isSubmitting} type="submit"
                    className="relative overflow-hidden bg-[#cec0ad] w-[230px] h-[230px] rounded-full disabled:opacity-50 disabled:cursor-not-allowed">
                    <div ref={createButtonTextRef} className="bg-transparent text-[#9c815a] font-black text-[55px]">
                      {isSubmitting ? "Creating..." : "Create Task"}
                    </div>
                    <div ref={hoverTransitionRef} className="hoverTransition bg-[#7a5622] rounded-full w-[0px] h-[0px] -translate-x-1/2 -translate-y-1/2 absolute -z-10"></div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTask;
