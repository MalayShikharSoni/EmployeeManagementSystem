'use client';

import React, { useState, useEffect } from "react";
import { taskAPI } from "@/services/api";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import styles from "./AllTasks.module.css";

interface EmployeeTaskData {
  user_id: number;
  first_name: string;
  new_task_count: number;
  active_count: number;
  completed_count: number;
  failed_count: number;
}

interface AllTasksProps {
  refreshTrigger?: number;
}

const AllTasks: React.FC<AllTasksProps> = ({ refreshTrigger }) => {
  const [employeeTaskData, setEmployeeTaskData] = useState<EmployeeTaskData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchEmployeeTaskData = async () => {
    try {
      setIsLoading(true);
      const response = await taskAPI.getTasksByEmployee();
      setEmployeeTaskData(response.data.data);
    } catch {
      setError("Failed to load employee data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployeeTaskData();
  }, [refreshTrigger]);

  useGSAP(() => {
    gsap.from(".heading2", { opacity: 0, duration: 1, delay: 0.5, scrollTrigger: { trigger: ".heading2" } });
    gsap.from(".popupHeading", { scale: 0, translateX: "-50%", translateY: "-50%", duration: 1, ease: "power2", scrollTrigger: { trigger: ".popupHeading" } });
    gsap.from(".popupRow", { scale: 0, translateX: "-50%", translateY: "-50%", duration: 1, ease: "power2", stagger: 0.1, scrollTrigger: { trigger: ".popupRow" } });
  });

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingCenter}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingCenter}>
          <p className={styles.errorText}>{error}</p>
          <button onClick={fetchEmployeeTaskData} className={styles.retryBtn}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`heading2 ${styles.heading}`}>
        Employee Task Overview
      </div>
      <div id="alltasks" className={styles.container}>
        <div className={styles.tableWrap}>
          <div className={`popup popupHeading ${styles.tableHeader}`}>
            <div className={styles.headerCell}>Employee Name</div>
            <div className={styles.headerCell}>New Tasks</div>
            <div className={styles.headerCell}>Active Tasks</div>
            <div className={styles.headerCell}>Completed Tasks</div>
            <div className={styles.headerCell}>Failed Tasks</div>
          </div>
          <div id="allTasks" className={styles.tableBody}>
            {employeeTaskData.length === 0 && (
              <div className={styles.emptyTable}>No employees found.</div>
            )}
            {employeeTaskData.map((emp) => (
              <div key={emp.user_id} className={`popup popupRow ${styles.tableRow}`}>
                <div className={styles.rowCell}>{emp.first_name}</div>
                <div className={styles.rowCell}>{emp.new_task_count}</div>
                <div className={styles.rowCell}>{emp.active_count}</div>
                <div className={styles.rowCell}>{emp.completed_count}</div>
                <div className={styles.rowCell}>{emp.failed_count}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AllTasks;
