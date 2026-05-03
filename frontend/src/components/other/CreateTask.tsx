import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext, type AuthContextType } from "../../context/AuthProvider";
import { taskAPI, authAPI } from "../../services/api";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import type { Employee } from "../../types";
import styles from "./CreateTask.module.css";

interface CreateTaskProps {
  onTaskCreated?: () => void;
}

const CreateTask: React.FC<CreateTaskProps> = (props) => {
  const [title, settitle] = useState("");
  const [date, setdate] = useState("");
  const [assignTo, setassignTo] = useState("");
  const [category, setcategory] = useState("");
  const [description, setdescription] = useState("");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const taskBoxRef = useRef<HTMLButtonElement>(null);
  const hoverTransitionRef = useRef<HTMLDivElement>(null);
  const createButtonTextRef = useRef<HTMLDivElement>(null);

  const { userData } = useContext(AuthContext) as AuthContextType;

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await authAPI.getEmployees();
        setEmployees(response.data.data);
        console.log("✅ Employees fetched:", response.data.data);
      } catch (error) { console.error("❌ Failed to fetch employees:", error); }
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

    box?.addEventListener("mousemove", (e: MouseEvent) => {
      const rect = box.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      hover!.style.left = `${x}px`;
      hover!.style.top = `${y}px`;
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

  const SubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await taskAPI.createTask({ title, description, category, dueDate: date, assignedTo: parseInt(assignTo) });
      console.log("✅ Task created:", response.data);
      alert(`Task "${title}" assigned successfully!`);
      settitle(""); setdate(""); setassignTo(""); setcategory(""); setdescription("");
      if (props.onTaskCreated) { props.onTaskCreated(); }
    } catch (error: unknown) {
      console.error("❌ Create task error:", error);
      const err = error as { response?: { data?: { error?: string } } };
      alert(err.response?.data?.error || "Failed to create task. Please try again.");
    } finally { setIsSubmitting(false); }
  };

  return (
    <div className={styles.container}>
      <div className={`heading ${styles.title}`}>Assign a Task</div>
      <div className={styles.formWrap}>
        <form onSubmit={SubmitHandler} className={styles.form}>
          <div className={styles.formInner}>
            <div className={styles.nameAndCategory}>
              <div className={styles.idCardWrap}>
                <div className={`idCard ${styles.idCard}`}>
                  <div className={styles.idCardHeader}>
                    <div className={styles.idCardDot}></div>
                    <div className={styles.idCardBar}></div>
                    <div className={styles.idCardDot}></div>
                  </div>
                  <div className={styles.idCardBody}>
                    <div className={styles.idCardAvatar}>
                      <div className={styles.idCardAvatarHead}></div>
                      <div className={styles.idCardAvatarBody}></div>
                    </div>
                    <div className={styles.idCardInfo}>
                      <div className={styles.idCardLabel}>Assign To :</div>
                      <select value={assignTo} onChange={(e) => setassignTo(e.target.value)} required
                        className={styles.idCardSelect}>
                        <option value="">Select Employee</option>
                        {employees.map((emp) => (<option key={emp.id} value={emp.id}>{emp.first_name}</option>))}
                      </select>
                      <div className={styles.filler}>
                        <div className={styles.fillerRow}>
                          <div className={styles.fillerDotSmall}></div>
                          <div className={styles.fillerDotSmall}></div>
                          <div className={styles.fillerDotSmall}></div>
                        </div>
                        <div className={styles.fillerRow}>
                          <div className={styles.fillerDotLarge}></div>
                          <div className={styles.fillerDotLarge}></div>
                        </div>
                        <div className={styles.fillerRow}>
                          <div className={styles.fillerDotSmall}></div>
                          <div className={styles.fillerDotSmall}></div>
                          <div className={styles.fillerDotSmall}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={`notepad ${styles.notepad}`}>
                <div className={styles.notepadSpirals}>
                  <div className={styles.spiralPeg}></div>
                  <div className={styles.spiralPeg}></div>
                  <div className={styles.spiralPeg}></div>
                  <div className={styles.spiralPeg}></div>
                  <div className={styles.spiralPeg}></div>
                  <div className={styles.spiralPeg}></div>
                </div>
                <div className={styles.notepadHoles}>
                  <div className={styles.notepadHole}></div>
                  <div className={styles.notepadHole}></div>
                  <div className={styles.notepadHole}></div>
                  <div className={styles.notepadHole}></div>
                  <div className={styles.notepadHole}></div>
                  <div className={styles.notepadHole}></div>
                </div>
                <div className={styles.notepadLines}>
                  <div className={styles.notepadLinesInner}>
                    <div className={styles.notepadLine}></div><div className={styles.notepadLine}></div>
                    <div className={styles.notepadLine}></div><div className={styles.notepadLine}></div>
                    <div className={styles.notepadLine}></div><div className={styles.notepadLine}></div>
                    <div className={styles.notepadLine}></div>
                  </div>
                  <input value={category} onChange={(e) => setcategory(e.target.value)} required
                    className={styles.categoryInput}
                    type="text" placeholder="Enter Category" />
                </div>
              </div>
            </div>
            <div className={`window ${styles.window}`}>
              <div className={styles.windowControls}>
                <div className={styles.windowMin}></div>
                <div className={styles.windowMax}></div>
                <div className={styles.windowClose}></div>
              </div>
              <div className={styles.windowBody}>
                <div className={styles.windowLeft}>
                  <div className={styles.windowLeftInner}>
                    <div className={styles.windowTopRow}>
                      <div className={styles.titleInputWrap}>
                        <input value={title} onChange={(e) => settitle(e.target.value)} required
                          className={styles.titleInput}
                          type="text" placeholder="Enter Task Title" />
                      </div>
                      <div className={styles.dateCol}>
                        <input value={date} onChange={(e) => setdate(e.target.value)} required
                          className={styles.dateInput}
                          type="date" style={{ color: "#9c815a", backgroundColor: "#cec0ad" }} />
                        <div className={styles.dateLabel}>{date}</div>
                      </div>
                    </div>
                    <div className={styles.descWrap}>
                      <textarea value={description} onChange={(e) => setdescription(e.target.value)} required
                        className={styles.descInput}
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
                    <div ref={hoverTransitionRef} className={`hoverTransition ${styles.hoverCircle}`}></div>
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
