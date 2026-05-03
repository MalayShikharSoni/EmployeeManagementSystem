import React, { useState, useEffect } from "react";
import { taskAPI } from "../../services/api";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type { GroupedEmployeeTasks } from "../../types";
import styles from "./AllTasks.module.css";

interface AllTasksProps {
  refreshTrigger: number;
}

const AllTasks: React.FC<AllTasksProps> = ({ refreshTrigger }) => {
  const [employeeTaskData, setEmployeeTaskData] = useState<GroupedEmployeeTasks[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => { fetchEmployeeTaskData(); }, [refreshTrigger]);

  const fetchEmployeeTaskData = async () => {
    try {
      setIsLoading(true);
      const response = await taskAPI.getTasksByEmployee();
      setEmployeeTaskData(response.data.data);
      console.log("✅ Employee task data:", response.data.data);
    } catch (err) {
      console.error("❌ Failed to fetch employee tasks:", err);
      setError("Failed to load employee data.");
    } finally { setIsLoading(false); }
  };

  useGSAP(() => {
    gsap.from(".heading2", { opacity: 0, duration: 1, delay: 0.5, scrollTrigger: { trigger: ".heading2" } });
    gsap.from(".popupHeading", { scale: 0, translateX: "-50%", translateY: "-50%", duration: 1, ease: "power2", scrollTrigger: { trigger: ".popupHeading" } });
    gsap.from(".popupRow", { scale: 0, translateX: "-50%", translateY: "-50%", duration: 1, ease: "power2", stagger: 0.1, scrollTrigger: { trigger: ".popupRow" } });
  });

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingContent}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingContent}>
          <p className={styles.errorText}>{error}</p>
          <button onClick={fetchEmployeeTaskData} className={styles.retryBtn}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`heading2 ${styles.title}`}>
        Employee Task Overview
      </div>
      <div id="alltasks" className={styles.container}>
        <div className={styles.inner}>
          <div className={`popup popupHeading ${styles.headerRow}`}>
            <div className={styles.headerCell}>Employee Name</div>
            <div className={styles.headerCell}>New Tasks</div>
            <div className={styles.headerCell}>Active Tasks</div>
            <div className={styles.headerCell}>Completed Tasks</div>
            <div className={styles.headerCell}>Failed Tasks</div>
          </div>
          <div id="allTasks" className={styles.tasksList}>
            {employeeTaskData.length === 0 && (
              <div className={styles.emptyText}>No employees found.</div>
            )}
            {employeeTaskData.map((emp) => (
              <div key={emp.user_id} className={`popup popupRow ${styles.taskRow}`}>
                <div className={styles.taskCell}>{emp.first_name}</div>
                <div className={styles.taskCell}>{emp.new_task_count}</div>
                <div className={styles.taskCell}>{emp.active_count}</div>
                <div className={styles.taskCell}>{emp.completed_count}</div>
                <div className={styles.taskCell}>{emp.failed_count}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AllTasks;
