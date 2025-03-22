import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthProvider";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const AllTasks = () => {
  const [userData, setUserData] = useContext(AuthContext);

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
      // delay: 1,
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
      // delay: 1,
      scrollTrigger: {
        trigger: ".popupRow",
      }
    });
  })

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

          <div id="allTasks" className=" bg-[#cec0ad] overflow-auto">
            
            {userData?.employees?.map((ele, idx) => {
              return (
                <div
                  key={idx}
                  className="popup popupRow flex justify-between bg-[#ad9676] p-[15px] rounded-se-[16px] rounded-es-[16px] rounded-ee-[16px] mb-[10px]"
                >
                  <div className="text-[#cec0ad] font-black text-[25px] w-1/5 text-center bg-transparent max-sm:text-[20px]">
                    {ele.firstname}
                  </div>
                  <div className="text-[#cec0ad] font-black text-[25px] w-1/5 text-center bg-transparent max-sm:text-[20px]">
                    {ele.taskNumbers.newTask}
                  </div>
                  <div className="text-[#cec0ad] font-black text-[25px] w-1/5 text-center bg-transparent max-sm:text-[20px]">
                    {ele.taskNumbers.active}
                  </div>
                  <div className="text-[#cec0ad] font-black text-[25px] w-1/5 text-center bg-transparent max-sm:text-[20px]">
                    {ele.taskNumbers.completed}
                  </div>
                  <div className="text-[#cec0ad] font-black text-[25px] w-1/5 text-center bg-transparent max-sm:text-[20px]">
                    {ele.taskNumbers.failed}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default AllTasks;
