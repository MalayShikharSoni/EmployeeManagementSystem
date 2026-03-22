import React, { useState, useEffect } from "react";
import { taskAPI } from "../../services/api";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const AllTasks = ({ refreshTrigger }) => {
  const [employeeTaskData, setEmployeeTaskData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch tasks grouped by employee from API (re-fetch when refreshTrigger changes)
  useEffect(() => {
    fetchEmployeeTaskData();
  }, [refreshTrigger]);

  const fetchEmployeeTaskData = async () => {
    try {
      setIsLoading(true);
      const response = await taskAPI.getTasksByEmployee();
      setEmployeeTaskData(response.data.data);
      console.log("✅ Employee task data:", response.data.data);
    } catch (err) {
      console.error("❌ Failed to fetch employee tasks:", err);
      setError("Failed to load employee data.");
    } finally {
      setIsLoading(false);
    }
  };

  useGSAP(() => {
    gsap.from(".heading2", {
      opacity: 0,
      duration: 1,
      delay: 0.5,
      scrollTrigger: {
        trigger: ".heading2",
      }
    });

    gsap.from(".popupHeading", {
      scale: 0,
      translateX: "-50%",
      translateY: "-50%",
      duration: 1,
      ease: "power2",
      scrollTrigger: {
        trigger: ".popupHeading",
      }
    });

    gsap.from(".popupRow", {
      scale: 0,
      translateX: "-50%",
      translateY: "-50%",
      duration: 1,
      ease: "power2",
      stagger: 0.1,
      scrollTrigger: {
        trigger: ".popupRow",
      }
    });
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center mt-[24vh] h-[30vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#ad9676] mb-4"></div>
          <p className="text-xl font-semibold text-[#9c815a]">Loading tasks...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center mt-[24vh] h-[30vh]">
        <div className="text-center">
          <p className="text-xl font-semibold text-red-500">{error}</p>
          <button
            onClick={fetchEmployeeTaskData}
            className="mt-4 px-6 py-2 bg-[#ad9676] text-white rounded-lg hover:bg-[#8b6c3e]"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="heading2 bg-transparent text-[#9c815a] mt-[24vh] mb-[10vh] text-7xl font-black ml-[3vw] max-sm:text-[55px]">
        Employee Task Overview
      </div>
      <div
        id="alltasks"
        className="bg-[#cec0ad] w-screen flex flex-col ml-[3vw] mb-[16vh]"
      >
        <div className="bg-transparent flex flex-col w-[62vw] max-sm:w-[90vw]">

          {/* Header Row */}
          <div className="popup popupHeading bg-[#cec0ad] border-[4px] border-[#ad9676] flex justify-between gap-1 rounded-se-[16px] p-[15px] rounded-es-[16px] rounded-ee-[16px] mb-[20px]">
            <div className="text-[#ad9676] font-black text-[22px] w-1/5 text-center bg-transparent max-sm:text-[13px]">
              Employee Name
            </div>
            <div className="text-[#ad9676] font-black text-[22px] w-1/5 text-center bg-transparent max-sm:text-[13px]">
              New Tasks
            </div>
            <div className="text-[#ad9676] font-black text-[22px] w-1/5 text-center bg-transparent max-sm:text-[13px]">
              Active Tasks
            </div>
            <div className="text-[#ad9676] font-black text-[22px] w-1/5 text-center bg-transparent max-sm:text-[13px]">
              Completed Tasks
            </div>
            <div className="text-[#ad9676] font-black text-[22px] w-1/5 text-center bg-transparent max-sm:text-[13px]">
              Failed Tasks
            </div>
          </div>

          {/* Data Rows */}
          <div id="allTasks" className="bg-[#cec0ad] overflow-auto">

            {/* Empty state */}
            {employeeTaskData.length === 0 && (
              <div className="text-center py-10 text-[#9c815a] font-bold text-xl">
                No employees found.
              </div>
            )}

            {employeeTaskData.map((emp, idx) => (
              <div
                key={emp.user_id}
                className="popup popupRow flex justify-between bg-[#ad9676] p-[15px] rounded-se-[16px] rounded-es-[16px] rounded-ee-[16px] mb-[10px]"
              >
                <div className="text-[#cec0ad] font-black text-[25px] w-1/5 text-center bg-transparent max-sm:text-[20px]">
                  {emp.first_name}
                </div>
                <div className="text-[#cec0ad] font-black text-[25px] w-1/5 text-center bg-transparent max-sm:text-[20px]">
                  {emp.new_task_count}
                </div>
                <div className="text-[#cec0ad] font-black text-[25px] w-1/5 text-center bg-transparent max-sm:text-[20px]">
                  {emp.active_count}
                </div>
                <div className="text-[#cec0ad] font-black text-[25px] w-1/5 text-center bg-transparent max-sm:text-[20px]">
                  {emp.completed_count}
                </div>
                <div className="text-[#cec0ad] font-black text-[25px] w-1/5 text-center bg-transparent max-sm:text-[20px]">
                  {emp.failed_count}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AllTasks;