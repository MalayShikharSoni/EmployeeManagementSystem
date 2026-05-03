'use client';

import React, { useContext, useEffect, useRef, useState, FormEvent } from "react";
import { AuthContext } from "@/context/AuthProvider";
import { taskAPI, authAPI } from "@/services/api";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import styles from "./CreateTask.module.css";

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
    <div className={styles.container}>
      <div className={`heading ${styles.heading}`}>Assign a Task</div>
      <div className={styles.formWrap}>
        <form onSubmit={submitHandler} className={styles.form}>
          <div className={styles.formInner}>
            <div className={`nameAndCategory ${styles.nameAndCategory}`}>
              <div className={styles.cardWrap}>
                <div className={`idCard ${styles.idCard}`}>
                  <div className={styles.idCardHeader}>
                    <div className={styles.headerDot}></div>
                    <div className={styles.headerBar}></div>
                    <div className={styles.headerDot}></div>
                  </div>
                  <div className={styles.idCardBody}>
                    <div className={styles.avatarBox}>
                      <div className={styles.avatarHead}></div>
                      <div className={styles.avatarBody}></div>
                    </div>
                    <div className={styles.idCardRight}>
                      <div className={styles.assignLabel}>Assign To :</div>
                      <select value={assignTo} onChange={(e) => setAssignTo(e.target.value)} required
                        className={styles.employeeSelect}>
                        <option value="">Select Employee</option>
                        {employees.map((emp) => (
                          <option key={emp.id} value={emp.id}>{emp.first_name}</option>
                        ))}
                      </select>
                      <div className={`filler ${styles.fillerSection}`}>
                        <div className={styles.fillerRow}>
                          <div className={styles.fillerBarSm}></div>
                          <div className={styles.fillerBarSm}></div>
                          <div className={styles.fillerBarSm}></div>
                        </div>
                        <div className={styles.fillerRow}>
                          <div className={styles.fillerBarLg}></div>
                          <div className={styles.fillerBarLg}></div>
                        </div>
                        <div className={styles.fillerRow}>
                          <div className={styles.fillerBarSm}></div>
                          <div className={styles.fillerBarSm}></div>
                          <div className={styles.fillerBarSm}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={`notepad ${styles.notepad}`}>
                <div className={styles.notepadSpirals}>
                  {[...Array(6)].map((_, i) => <div key={i} className={styles.spiral}></div>)}
                </div>
                <div className={styles.notepadHoles}>
                  {[...Array(6)].map((_, i) => <div key={i} className={styles.hole}></div>)}
                </div>
                <div className={styles.notepadContent}>
                  <div className={styles.notepadLines}>
                    {[...Array(7)].map((_, i) => <div key={i} className={styles.noteLine}></div>)}
                  </div>
                  <input value={category} onChange={(e) => setCategory(e.target.value)} required
                    className={styles.categoryInput}
                    type="text" placeholder="Enter Category" />
                </div>
              </div>
            </div>
            <div className={`window ${styles.window}`}>
              <div className={styles.windowControls}>
                <div className={styles.controlDash}></div>
                <div className={styles.controlSquare}></div>
                <div className={styles.controlCircle}></div>
              </div>
              <div className={styles.windowBody}>
                <div className={styles.windowLeft}>
                  <div className={styles.windowLeftInner}>
                    <div className={styles.windowTopRow}>
                      <div className={styles.titleInputWrap}>
                        <input value={title} onChange={(e) => setTitle(e.target.value)} required
                          className={styles.titleInput}
                          type="text" placeholder="Enter Task Title" />
                      </div>
                      <div className={styles.dateInputWrap}>
                        <input value={date} onChange={(e) => setDate(e.target.value)} required
                          className={styles.dateInput}
                          type="date" style={{ color: "#9c815a", backgroundColor: "#cec0ad" }} />
                        <div className={styles.dateDisplay}>{date}</div>
                      </div>
                    </div>
                    <div className={styles.descriptionWrap}>
                      <textarea value={description} onChange={(e) => setDescription(e.target.value)} required
                        className={styles.descriptionTextarea}
                        placeholder="Enter Task Description" />
                    </div>
                  </div>
                </div>
                <div className={styles.windowRight}>
                  <button ref={taskBoxRef} onClick={animateWavyLetters} disabled={isSubmitting} type="submit"
                    className={styles.createBtn}>
                    <div ref={createButtonTextRef} className={styles.createBtnText}>
                      {isSubmitting ? "Creating..." : "Create Task"}
                    </div>
                    <div ref={hoverTransitionRef} className={`hoverTransition ${styles.createBtnHover}`}></div>
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
