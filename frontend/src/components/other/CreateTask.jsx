import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthProvider";
// import { setLocalStorage } from "../../../utils/LocalStorage";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";



const CreateTask = (props) => {
  const [title, settitle] = useState("");
  const [date, setdate] = useState("");
  const [assignTo, setassignTo] = useState("");
  const [category, setcategory] = useState("");
  const [description, setdescription] = useState("");

  const taskBoxRef = useRef(null);
  const hoverTransitionRef = useRef(null);
  const createButtonTextRef = useRef(null);

  const [userData, setuserData] = useContext(AuthContext);
  // console.log('CreateTask ka usecontext: ',userData)

  useGSAP(() => {

    gsap.from(".heading", {
      opacity: 0,
      duration: 1,
      // delay: 0.4,
    });

    gsap.from(".idCard", {
      opacity: 0,
      x: -50,
      duration: 1,
      delay: 0.4,
      ease: "power2"
    });


    gsap.from(".notepad", {
      opacity: 0,
      x: 50,
      duration: 1,
      delay: 0.4,
      ease: "power2"
    });

    gsap.from(".window", {
      opacity: 0,
      y: 150,
      duration: 1,
      delay: 0.4,
      ease: "power2"
    })

    gsap.from(taskBoxRef.current, {
      // scale: 1,
      duration: 0.6,
      delay: 0.4,
      translateX: "0px",
      translateY: "0px",
    });

    const box = taskBoxRef.current;
  const hover = hoverTransitionRef.current;
  const createText = createButtonTextRef.current;

  box?.addEventListener("mousemove", (e) => {
    const rect = box.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    hover.style.left = `${x}px`;
    hover.style.top = `${y}px`;
  });

  box?.addEventListener("mouseenter", () => {
    // Kill any ongoing tweens before starting new ones
    gsap.killTweensOf([hover, createText]);

    // Transition circle expansion
    gsap.to(hover, {
      duration: 0.6,
      width: "800px",
      height: "800px",
    });

    // Change button text color
    gsap.to(createText, {
      color: "#ded5c8",
      duration: 0.4,
    });
  });

  box?.addEventListener("mouseleave", () => {
    // Kill ongoing tweens to prevent overlaps
    gsap.killTweensOf([hover, createText]);

    // Shrink transition circle
    gsap.to(hover, {
      duration: 0.4,
      width: "0px",
      height: "0px",
    });

    // Reset button text color
    gsap.to(createText, {
      color: "#fff", // or whatever the original color is
      duration: 0.4,
    });
  });

    

  });

  useEffect(() => {
    const storedEmployees = localStorage.getItem("employees");
    // console.log('existence hai? ',storedEmployees)
    if (storedEmployees) {
      setuserData({ employees: JSON.parse(storedEmployees) });
    }

    
  }, []);

  const animateWavyLetters = () => {
    gsap.to(
      ".titleLineLetter1",

      {
        y: -10,
        ease: "back",
        // yoyo: true,
        stagger: -0.05,
        duration: 0.5,

        // repeat: 1,
      },
    );

    gsap.to(
      ".titleLineLetter2",

      {
        y: -10,
        ease: "back",
        // yoyo: true,
        stagger: 0.05,
        duration: 0.5,
        delay: 0.3,
        // repeat: 1,
      },
    );

    gsap.to(
      ".titleLineLetter1",

      {
        y: 10,
        ease: "back",
        // yoyo: true,
        stagger: -0.05,
        duration: 0.5,
        delay: 0.3,
        // repeat: 1,
      },
    );

    gsap.to(
      ".titleLineLetter2",

      {
        y: 10,
        ease: "back",
        // yoyo: true,
        stagger: 0.05,
        duration: 0.5,
        delay: 0.6,
        // repeat: 1,
      },
    );
  };

  useGSAP(() => {
    gsap.from(".titleLineLetter1", {
      x: -200,
      duration: 30,

      ease: "back.inOut",
      yoyo: true,
      repeat: -1,
    });

    gsap.from(".titleLineLetter2", {
      x: 200,
      duration: 30,

      ease: "back.inOut",
      yoyo: true,
      repeat: -1,
    });
  });

  const SubmitHandler = (e) => {
    e.preventDefault();

    const currentTask = {
      title,
      date,
      category,
      description,
      active: false,
      newTask: true,
      completed: false,
      failed: false,
    };
    console.log("current task is: ", currentTask);
    console.log("Task Created, it is:");
    // const data = [...userData.employees]

    // Update the employees array
    const updatedEmployees = userData?.employees?.map((ele) => {
      if (assignTo === ele.firstname) {
        ele.taskNumbers.newTask += 1;
        ele.tasks.push(currentTask);
      }
      return ele;
    });

    // Update the localStorage with the updated employees array
    localStorage.setItem("employees", JSON.stringify(updatedEmployees));

    // Update the state with the new employees array
    setuserData({ employees: updatedEmployees });

    // taskCreatedNotification();

    settitle("");
    setdate("");
    setassignTo("");
    setcategory("");
    setdescription("");
  };

  return (
    <div className="bg-[#cec0ad] pt-[24vh]">
      <div className="heading bg-transparent text-[#9c815a] mb-[10vh] text-7xl font-black ml-[3vw]">
        Assign a Task
      </div>

      <div className=" bg-transparent">
        <form
          onSubmit={(e) => {
            SubmitHandler(e);
          }}
          className="ml-[3vw] flex flex-wrap w-[70%] h-full items-start justify-between bg-[#cec0ad]"
        >
          <div className="flex flex-col gap-[5vh] bg-transparent">
            {/* NAME AND CATEGORY */}
            <div className="nameAndCategory flex flex-wrap gap-[4vw] bg-transparent max-sm:gap-[5vh]">
              {/* NAME */}
              <div className="bg-transparent">
                <div className="idCard w-[450px] h-[300px] bg-[#ad9676] rounded-[10px] flex flex-col overflow-hidden max-sm:w-[355px]">
                  <div className="flex flex-row gap-[10px] items-center justify-center h-[10%] w-full bg-[#9c815a]">
                    <div className="w-[10px] h-[10px] rounded-full bg-[#cec0ad]"></div>

                    <div className="w-[70px] h-[10px] rounded-full bg-[#cec0ad]"></div>

                    <div className="w-[10px] h-[10px] rounded-full bg-[#cec0ad]"></div>
                  </div>

                  {/* ID CARD */}
                  <div className="flex flex-row items-center h-[90%] justify-center bg-transparent">
                    {/* PFP */}
                    <div className="relative w-[30%] rounded-[5px] m-[10px] h-[130px] bg-[#cec0ad] overflow-hidden">
                      <div className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[62px] h-[62px] rounded-full bg-[#ded5c8]"></div>
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[115px] h-[115px] rounded-full bg-[#ded5c8]"></div>
                    </div>

                    <div className="bg-transparent w-full h-full flex flex-col">
                      <div className="bg-transparent font-black text-[35px] pl-[15px] text-[#cec0ad] w-full mt-[10px]">
                        Assign To :
                      </div>

                      <input
                        value={assignTo}
                        onChange={(e) => {
                          setassignTo(e.target.value);
                        }}
                        className="bg-[#cec0ad] w-[87%] h-[50%] mt-[6px] rounded-[5px] pl-[10px] font-black text-[#9c815a] text-[22px] placeholder:font-bold placeholder:text-[#bdab91] placeholder:text-[22px] outline-none focus:bg-[#ded5c8]"
                        type="text"
                        placeholder="Enter Employee Name"
                      />

                      {/* FILLER */}
                      <div className="filler flex flex-col gap-[18px] mt-[30px] bg-transparent h-full max-sm:w-[85%]">
                        <div className="bg-transparent flex flex-row gap-[8px]">
                          <div className="bg-[#cec0ad] h-[5px] w-[84px] rounded-full"></div>
                          <div className="bg-[#cec0ad] h-[5px] w-[84px] rounded-full"></div>
                          <div className="bg-[#cec0ad] h-[5px] w-[84px] rounded-full"></div>
                        </div>

                        <div className="bg-transparent flex flex-row gap-[8px]">
                          <div className="bg-[#cec0ad] h-[5px] w-[130px] rounded-full"></div>
                          <div className="bg-[#cec0ad] h-[5px] w-[130px] rounded-full"></div>
                          {/* <div className='bg-[#cec0ad] h-[5px] w-[84px] rounded-full'></div> */}
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
                {/* NOTEPAD SPIRAL */}
                <div className="absolute top-[-10px] flex flex-row items-center justify-around w-[100%] bg-transparent">
                  <div className="bg-[#9c815a] rounded-[3px] w-[8px] h-[40px]"></div>
                  <div className="bg-[#9c815a] rounded-[3px] w-[8px] h-[40px]"></div>
                  <div className="bg-[#9c815a] rounded-[3px] w-[8px] h-[40px]"></div>
                  <div className="bg-[#9c815a] rounded-[3px] w-[8px] h-[40px]"></div>
                  <div className="bg-[#9c815a] rounded-[3px] w-[8px] h-[40px]"></div>
                  <div className="bg-[#9c815a] rounded-[3px] w-[8px] h-[40px]"></div>
                </div>

                {/* NOTEPAD CIRCLES */}
                <div className="top-[-10px]  flex flex-row items-center justify-around w-[100%] bg-transparent mt-[8px]">
                  <div className="bg-[#cec0ad] rounded-full w-[35px] h-[35px]"></div>
                  <div className="bg-[#cec0ad] rounded-full w-[35px] h-[35px]"></div>
                  <div className="bg-[#cec0ad] rounded-full w-[35px] h-[35px]"></div>
                  <div className="bg-[#cec0ad] rounded-full w-[35px] h-[35px]"></div>
                  <div className="bg-[#cec0ad] rounded-full w-[35px] h-[35px]"></div>
                  <div className="bg-[#cec0ad] rounded-full w-[35px] h-[35px]"></div>
                </div>

                <div className="relative h-full w-full flex flex-col items-center justify-center bg-transparent">
                  <div className="absolute flex flex-col gap-[40px] w-full h-full items-center justify-center bg-transparent opacity-[40%] ">
                    <div className="bg-[#cec0ad] w-full h-[2px] "></div>
                    <div className="bg-[#cec0ad] w-full h-[2px] "></div>
                    <div className="bg-[#cec0ad] w-full h-[2px] "></div>
                    <div className="bg-[#cec0ad] w-full h-[2px] "></div>
                    <div className="bg-[#cec0ad] w-full h-[2px] "></div>
                    <div className="bg-[#cec0ad] w-full h-[2px] "></div>
                    <div className="bg-[#cec0ad] w-full h-[2px] "></div>
                  </div>

                  <input
                    value={category}
                    onChange={(e) => {
                      setcategory(e.target.value);
                    }}
                    className="translate-y-[-13px] mb-[22.5px] w-full h-full bg-transparent outline-none text-center font-black text-[#ded5c8] text-[38px] placeholder:text-center placeholder:font-black placeholder:text-[#cec0ad] placeholder:text-[38px] placeholder:text-opacity-[70%] z-10"
                    type="text"
                    placeholder="Enter Category"
                  />
                </div>
              </div>
            </div>

            {/* TITLE, DESCRIPTION, DATE */}
            <div className="window flex flex-col items-center w-full h-[300px] rounded-[10px] bg-[#9c815a] mt-[4vh] max-sm:h-[70vh]">
              {/* WINDOW TITLE BAR */}
              <div className="flex flex-row gap-[10px] translate-y-[4px] justify-end items-center w-full h-[35px] px-[10px] bg-transparent">
                <div className="h-[3.5px] w-[20px] rounded-full bg-[#cec0ad]"></div>
                <div className="h-[18px] w-[18px] border-[3.5px] border-[#cec0ad] bg-transparent"></div>
                <div className="h-[20px] w-[20px] rounded-full border-[3.5px] border-[#cec0ad] bg-transparent"></div>
              </div>

              {/* MAIN WINDOW */}
              <div className="bg-[#9c815a] rounded-[10px] flex flex-row gap-[0%] justify-center items-center p-[10px] h-full w-full max-sm:flex-col max-sm:gap-[10px]">
                <div className="flex rounded-ss-[10px] rounded-es-[10px] flex-col w-[70%] h-full bg-[#ad9676] p-[20px] max-sm:rounded-se-[10px] max-sm:rounded-ee-[10px] max-sm:w-full">
                  {/* INPUT FIELDS */}
                  <div className="flex flex-col bg-transparent h-full w-full">
                    {/* TITLE AND DATE */}
                    <div className="flex flex-row w-full h-[40%] bg-transparent max-sm:gap-[12px]">
                      {/* TITLE */}
                      <div className="flex items-center justify-center p-[10px] bg-transparent w-[84%] h-full">
                        <input
                          value={title}
                          onChange={(e) => {
                            settitle(e.target.value);
                          }}
                          className="bg-[#cec0ad] pl-[25px] w-full h-full rounded-[10px] outline-none font-black text-[#9c815a] text-[35px] placeholder:font-bold placeholder:text-[35px] placeholder:text-[#bdab91] max-sm:text-[26px] max-sm:placeholder:text-[26px]"
                          type="text"
                          placeholder="Enter Task Title"
                        />
                      </div>

                      {/* DATE */}
                      <div className="flex flex-col h-full w-[16%] items-center justify-center bg-transparent">
                        <input
                          value={date}
                          onChange={(e) => {
                            setdate(e.target.value);
                          }}
                          className="appearance-none flex justify-center items-center bg-[#cec0ad] outline-none w-[65px] h-[65px] rounded-full text-[#9c815a]"
                          type="date"
                          placeholder=" dddd"
                          style={{
                            color: "#9c815a", // Change selected date text color
                            backgroundColor: "#cec0ad", // Change background color
                          }}
                        />

                        <div className="bg-transparent font-bold text-[16px] text-[#9c815a]">
                          {date}
                        </div>
                      </div>
                    </div>

                    {/* DESCREPTION */}
                    <div className="flex bg-transparent h-full w-full p-[10px]">
                      <textarea
                        value={description}
                        onChange={(e) => {
                          setdescription(e.target.value);
                        }}
                        className="outline-none w-full h-full bg-[#cec0ad] rounded-[10px] font-bold text-[22px] text-[#9c815a] placeholder:text-[#bdab91] resize-none"
                        placeholder="Enter Task Description"
                      />
                    </div>
                  </div>

                  {/* SUBMIT BUTTON */}
                </div>

                <div className="flex items-center justify-center bg-[#ad9676] rounded-ee-[10px] rounded-se-[10px] h-full w-[30%] max-sm:w-full">
                  <button
                    ref={taskBoxRef}
                    onClick={animateWavyLetters}
                    className="relative overflow-hidden bg-[#cec0ad] w-[230px] h-[230px] rounded-full "
                  >
                    <div
                      ref={createButtonTextRef}
                      className="bg-transparent text-[#9c815a] font-black text-[55px]"
                    >
                      Create <br /> Task
                    </div>
                    <div
                      ref={hoverTransitionRef}
                      className="hoverTransition  bg-[#7a5622] rounded-full w-[0px] h-[0px] -translate-x-1/2 -translate-y-1/2 absolute -z-10"
                    ></div>
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
