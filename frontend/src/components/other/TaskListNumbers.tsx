import React, { useContext } from "react";
import { AuthContext, type AuthContextType } from "../../context/AuthProvider";
import styles from "./TaskListNumbers.module.css";

const TaskListNumbers: React.FC = () => {
  const authContext = useContext(AuthContext) as AuthContextType;
  const CurrentUser = authContext.userData;

  return (
    <div className={styles.container}>
      <div className={`${styles.card} ${styles.blue}`}>
        <h2 className={`${styles.count} ${styles.blue}`}>{(CurrentUser?.data as unknown as { taskNumbers: { newTask: number } })?.taskNumbers?.newTask}</h2>
        <h3 className={`${styles.label} ${styles.blue}`}>New Task</h3>
      </div>
      <div className={`${styles.card} ${styles.yellow}`}>
        <h2 className={`${styles.count} ${styles.yellow}`}>{(CurrentUser?.data as unknown as { taskNumbers: { active: number } })?.taskNumbers?.active}</h2>
        <h3 className={`${styles.label} ${styles.yellow}`}>Active Task</h3>
      </div>
      <div className={`${styles.card} ${styles.green}`}>
        <h2 className={`${styles.count} ${styles.green}`}>{(CurrentUser?.data as unknown as { taskNumbers: { completed: number } })?.taskNumbers?.completed}</h2>
        <h3 className={`${styles.label} ${styles.green}`}>Completed Task</h3>
      </div>
      <div className={`${styles.card} ${styles.red}`}>
        <h2 className={`${styles.count} ${styles.red}`}>{(CurrentUser?.data as unknown as { taskNumbers: { failed: number } })?.taskNumbers?.failed}</h2>
        <h3 className={`${styles.label} ${styles.red}`}>Failed Task</h3>
      </div>
    </div>
  );
};

export default TaskListNumbers;
