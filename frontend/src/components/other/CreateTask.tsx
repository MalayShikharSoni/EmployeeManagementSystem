import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext, type AuthContextType } from "../../context/AuthProvider";
import { taskAPI, authAPI } from "../../services/api";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import type { Employee, TaskPriority } from "../../types";
import AvatarUpload from "../AvatarUpload/AvatarUpload";
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
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ALLOWED_TYPES = [
    'image/jpeg', 'image/png', 'image/webp',
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];
  const MAX_FILES = 5;
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB

  const taskBoxRef = useRef<HTMLButtonElement>(null);
  const hoverTransitionRef = useRef<HTMLDivElement>(null);
  const createButtonTextRef = useRef<HTMLDivElement>(null);

  const { userData } = useContext(AuthContext) as AuthContextType;

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await authAPI.getEmployees();
        setEmployees(response.data.data);
        console.log("Employees fetched:", response.data.data);
      } catch (error) { console.error("Failed to fetch employees:", error); }
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const total = selectedFiles.length + files.length;
    if (total > MAX_FILES) {
      alert(`Maximum ${MAX_FILES} files allowed. You have ${selectedFiles.length} selected.`);
      return;
    }
    for (const f of files) {
      if (!ALLOWED_TYPES.includes(f.type)) {
        alert(`File type not allowed: ${f.name}. Accepted: images, PDF, DOCX, XLSX`);
        return;
      }
      if (f.size > MAX_SIZE) {
        alert(`File too large: ${f.name}. Maximum 10MB per file.`);
        return;
      }
    }
    setSelectedFiles(prev => [...prev, ...files]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const SubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (selectedFiles.length > 0) {
        // Use FormData for multipart submission
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('category', category);
        formData.append('dueDate', date);
        formData.append('priority', priority);
        formData.append('assignedTo', assignTo);
        selectedFiles.forEach(f => formData.append('files', f));
        const response = await taskAPI.createTaskWithFiles(formData);
        console.log("Task created with files:", response.data);
      } else {
        // JSON submission (no files)
        const response = await taskAPI.createTask({ title, description, category, dueDate: date, priority, assignedTo: parseInt(assignTo) });
        console.log("Task created:", response.data);
      }
      alert(`Task "${title}" assigned successfully!`);
      settitle(""); setdate(""); setassignTo(""); setcategory(""); setdescription(""); setPriority("medium"); setSelectedFiles([]);
      if (props.onTaskCreated) { props.onTaskCreated(); }
    } catch (error: unknown) {
      console.error("Create task error:", error);
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
                    <div className={styles.idCardAvatar} style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {assignTo && employees.find(e => e.id.toString() === assignTo)?.avatar_url ? (
                        <AvatarUpload currentAvatarUrl={employees.find(e => e.id.toString() === assignTo)?.avatar_url} name={employees.find(e => e.id.toString() === assignTo)?.first_name || ''} size={60} readOnly />
                      ) : (
                        <>
                          <div className={styles.idCardAvatarHead}></div>
                          <div className={styles.idCardAvatarBody}></div>
                        </>
                      )}
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
                    <div className={styles.priorityWrap}>
                      <div className={styles.priorityLabel}>Priority:</div>
                      <div className={styles.priorityControls}>
                        {(["low", "medium", "high", "urgent"] as TaskPriority[]).map(p => (
                          <button 
                            key={p} 
                            type="button" 
                            onClick={() => setPriority(p)}
                            className={`${styles.priorityBtn} ${priority === p ? styles[`priorityBtn_${p}_active`] : ""}`}
                          >
                            {p.charAt(0).toUpperCase() + p.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className={styles.attachWrap}>
                      <div className={styles.attachRow}>
                        <div className={styles.attachLabel}>Attach Files:</div>
                        <button
                          type="button"
                          className={styles.attachBtn}
                          onClick={() => fileInputRef.current?.click()}
                          disabled={selectedFiles.length >= MAX_FILES}
                        >
                          Browse
                        </button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          multiple
                          accept="image/jpeg,image/png,image/webp,application/pdf,.docx,.xlsx"
                          onChange={handleFileSelect}
                          style={{ display: 'none' }}
                        />
                      </div>
                      {selectedFiles.length > 0 && (
                        <div className={styles.fileChips}>
                          {selectedFiles.map((f, i) => (
                            <div key={i} className={styles.fileChip}>
                              <span className={styles.fileChipName}>{f.name}</span>
                              <button type="button" className={styles.fileChipRemove} onClick={() => removeFile(i)}>×</button>
                            </div>
                          ))}
                        </div>
                      )}
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
