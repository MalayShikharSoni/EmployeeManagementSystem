import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthProvider";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const AcceptedTask = ({ data, wholeData }) => {
  const taskBoxRef = useRef(null);
  const hoverTransitionRef = useRef(null);

  const titleRef = useRef(null);
  const categoryRef = useRef(null);

  const descriptionRef = useRef(null);
  const buttonRef = useRef(null);

  const dateRef = useRef(null);

  useGSAP(() => {
    gsap.from(taskBoxRef.current, {
      scale: 0,
      duration: 0.6,
      delay: 0.4,
      translateX: "-160px",
      translateY: "-150px",
    });

    taskBoxRef.current?.addEventListener("mousemove", (e) => {
      const boxRect = taskBoxRef.current.getBoundingClientRect();
      let x = e.clientX - boxRect.left;
      let y = e.clientY - boxRect.top;

      hoverTransitionRef.current.style.left = `${x}px`;
      hoverTransitionRef.current.style.top = `${y}px`;
    });

    taskBoxRef.current?.addEventListener("mouseenter", (e) => {
      // TRANSITION CIRCLE
      gsap.to(hoverTransitionRef.current, {
        duration: 0.6,
        width: "800px",
        height: "800px",
      });

      // BEFORE HOVER ELEMENTS
      gsap.to(titleRef.current, {
        opacity: 0,
        duration: 0.4,
      });

      gsap.to(categoryRef.current, {
        opacity: 0,
        duration: 0.4,
      });

      // AFTER HOVER ELEMENTS
      gsap.to(descriptionRef.current, {
        opacity: 1,
        duration: 0.4,
        delay: 0.2,
      });

      gsap.to(buttonRef.current, {
        opacity: 1,
        duration: 0.4,
        delay: 0.2,
      });

      //DATE COLOR
      gsap.to(dateRef.current, {
        color: "#3b3123",
        duration: 0.4,
      });
    });

    taskBoxRef.current?.addEventListener("mouseleave", () => {
      // TRANSITION CIRCLE
      gsap.to(hoverTransitionRef.current, {
        duration: 0.4,
        width: "0px",
        height: "0px",
      });

      // BEFORE HOVER ELEMENTS
      gsap.to(titleRef.current, {
        opacity: 1,
        duration: 0.4,
        delay: 0.2,
      });

      gsap.to(categoryRef.current, {
        opacity: 1,
        duration: 0.4,
        delay: 0.2,
      });

      // AFTER HOVER ELEMENTS
      gsap.to(descriptionRef.current, {
        opacity: 0,
        duration: 0.4,
      });

      gsap.to(buttonRef.current, {
        opacity: 0,
        duration: 0.4,
      });

      //DATE COLOR
      gsap.to(dateRef.current, {
        color: "#f9ff83",
        duration: 0.4,
      });
    });
  });

  // console.log(data);

  // const MarkAsCompletedClickButton = () => {
  //   props.data.newTask = false
  //   props.data.completed = true
  //   props.data.failed = false
  //   props.data.active = false

  //   props.wholeData.taskNumbers.active -= 1;
  //   props.wholeData.taskNumbers.completed += 1;
  // }

  // const MarkAsFailedClickButton = () => {
  //   props.data.newTask = false
  //   props.data.completed = false
  //   props.data.failed = true
  //   props.data.active = false

  //   props.wholeData.taskNumbers.active -= 1;
  //   props.wholeData.taskNumbers.failed += 1;
  // }

  const [userData, setuserData] = useContext(AuthContext);

  const wholeDataa = userData.loggedInUser?.data;
  const dataa = userData.loggedInUser?.data.tasks.find(
    (theTask) => theTask.title === data.title,
  );

  const taskData = userData.loggedInUser?.data.tasks.find(
    (theTask) => theTask.title === data.title,
  );
  const [forceRender, setForceRender] = useState(false); // Force UI re-render

  useEffect(() => {
    const storedEmployees = localStorage.getItem("employees");
    const storedLoggedInUser = localStorage.getItem("loggedInUser");

    if (storedEmployees || storedLoggedInUser) {
      setuserData((prevState) => ({
        ...prevState,
        employees: storedEmployees
          ? JSON.parse(storedEmployees)
          : prevState.employees,
        loggedInUser: storedLoggedInUser
          ? JSON.parse(storedLoggedInUser)
          : prevState.loggedInUser,
      }));
    }
  }, []);

  // MARK AS COMPLETED CLICK BUTTON FUNCTION
  const MarkAsCompletedClickButton = (firstname, title) => {
    setuserData((prevState) => {
      const updatedEmployees = prevState?.employees?.map((employee) => {
        if (employee.firstname === firstname) {
          return {
            ...employee,
            tasks: employee?.tasks?.map((task) =>
              task.title === title
                ? {
                    ...task,
                    newTask: false,
                    completed: true,
                    failed: false,
                    active: false,
                  }
                : task,
            ),
            taskNumbers: {
              ...employee.taskNumbers,
              active: employee.taskNumbers.active - 1,
              completed: employee.taskNumbers.completed + 1,
            },
          };
        }
        return employee;
      });

      const updatedUserData = updatedEmployees?.find(
        (emp) => emp.firstname === firstname,
      );

      const updatedLoggedInUser = {
        role: prevState.loggedInUser.role,
        data: updatedUserData,
      };

      // Store in localStorage
      localStorage.setItem("employees", JSON.stringify(updatedEmployees));
      localStorage.setItem("loggedInUser", JSON.stringify(updatedLoggedInUser));

      // Trying to update wholeData and data
      // wholeDataa = userData.loggedInUser

      // dataa = userData.loggedInUser.d

      // Force a UI update
      setForceRender((prev) => !prev);

      return {
        ...prevState,
        employees: updatedEmployees,
        loggedInUser: updatedLoggedInUser,
      };
    });
  };

  // MARK AS COMPLETED CLICK BUTTON FUNCTION
  const DeclineClickButton = (firstname, title) => {
    setuserData((prevState) => {
      const updatedEmployees = prevState?.employees?.map((employee) => {
        if (employee.firstname === firstname) {
          return {
            ...employee,
            tasks: employee?.tasks?.map((task) =>
              task.title === title
                ? {
                    ...task,
                    newTask: false,
                    completed: false,
                    failed: true,
                    active: false,
                  }
                : task,
            ),
            taskNumbers: {
              ...employee.taskNumbers,
              active: employee.taskNumbers.active - 1,
              failed: employee.taskNumbers.failed + 1,
            },
          };
        }
        return employee;
      });

      const updatedUserData = updatedEmployees?.find(
        (emp) => emp.firstname === firstname,
      );

      const updatedLoggedInUser = {
        role: prevState.loggedInUser.role,
        data: updatedUserData,
      };

      // Store in localStorage
      localStorage.setItem("employees", JSON.stringify(updatedEmployees));
      localStorage.setItem("loggedInUser", JSON.stringify(updatedLoggedInUser));

      // Trying to update wholeData and data
      // wholeDataa = userData.loggedInUser

      // dataa = userData.loggedInUser.d

      // Force a UI update
      setForceRender((prev) => !prev);

      return {
        ...prevState,
        employees: updatedEmployees,
        loggedInUser: updatedLoggedInUser,
      };
    });
  };

  return (
    <div
      ref={taskBoxRef}
      className="overflow-hidden relative flex-shrink-0 h-[300px] w-[320px] bg-[#ad9676] rounded-se-[42px] rounded-es-[42px] rounded-ee-[42px] ml-2 z-1"
    >
      <div className="bg-transparent absolute z-10 h-full w-full">
        <div className="bg-transparent flex justify-between items-center p-2">
          {/* BEFORE HOVER */}
          <h3
            ref={categoryRef}
            className="beforeHover bg-[#8b6c3e] rounded-se-[13px] rounded-es-[13px] rounded-ee-[13px] px-3 py-1 text-[16px] text-[#cec0ad] font-medium opacity-1"
          >
            {dataa?.category}
          </h3>

          {/* BOTH */}
          <h3
            ref={dateRef}
            className="bg-transparent text-sm text-[#f9ff83] text-[18px] font-semibold px-5 py-4 opacity-1"
          >
            {data?.date}
          </h3>
        </div>

        {/* BEFORE HOVER */}
        <div
          ref={titleRef}
          className="beforeHover absolute p-2 bg-transparent ml-4 text-5xl text-yellow-200 font-black opacity-1"
        >
          {dataa?.title}
        </div>

        {/* AFTER HOVER */}
        <div
          ref={descriptionRef}
          className="afterHover bg-transparent text-[20px] px-[25px]  text-[#3b3123] font-extrabold mt-[5%] opacity-0"
        >
          {dataa?.description}
        </div>
      </div>

      {/* AFTER HOVER */}
      <div
        ref={buttonRef}
        className="afterHover absolute translate-x-[3px] bottom-[18px] flex justify-center gap-[60px] m-4 bg-transparent z-10 opacity-0"
      >
        <button
          onClick={() =>
            MarkAsCompletedClickButton(wholeDataa?.firstname, dataa?.title)
          }
          className="bg-transparent text-[28px] text-green-300 font-bold"
        >
          Check Off
        </button>
        <button
          onClick={() =>
            DeclineClickButton(wholeDataa?.firstname, dataa?.title)
          }
          className="bg-transparent text-[28px] text-[#923838] font-bold"
        >
          Decline
        </button>
      </div>

      <div
        ref={hoverTransitionRef}
        className="hoverTransition bg-[#bdab91] rounded-full w-[0px] h-[0px] -translate-x-1/2 -translate-y-1/2 absolute z-0"
      ></div>
    </div>

    //   <div ref={yellowBox} className='flex-shrink-0 h-[300px] w-[300px] bg-yellow-400 rounded-xl ml-2'>
    //   <div className='bg-transparent flex justify-between items-center p-2'>
    //       <h3 className='bg-red-600 px-3 py-1 text-sm rounded'>{dataa?.category}</h3>
    //       <h4 className='bg-transparent text-sm'>{dataa?.date}</h4>
    //   </div>
    //   <h2 className='p-2 bg-transparent mt-5 text-xl font-semibold'>{dataa?.title}</h2>
    //   <p className='p-2 bg-transparent text-sm mt-2'>{dataa?.description}</p>

    //   <div className='flex justify-between m-4 bg-transparent'>
    //     <button
    //       onClick={() => MarkAsCompletedClickButton(wholeDataa?.firstname, dataa?.title)}
    //       className='bg-green-500 px-2 py-1 text-sm'>
    //       Mark as Completed
    //     </button>

    //     <button
    //       onClick={() => DeclineClickButton(wholeDataa?.firstname, dataa?.title)}
    //       className='bg-red-500 px-2 py-1 text-sm'>
    //       Decline
    //     </button>

    //   </div>

    // </div>
  );
};

export default AcceptedTask;
