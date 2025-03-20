import React, { useContext, useEffect, useRef, useState } from 'react'
import AcceptedTask from './AcceptedTask'
import NewTask from './NewTask'
import CompletedTask from './CompletedTask'
import FailedTask from './FailedTask'
import { AuthContext } from '../../context/AuthProvider'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'


const TaskList = (props) => {
    const [userData, setuserData] = useContext(AuthContext)

    const popupBubbleRef = useRef(null);
    const popupTextRef = useRef(null);

    const [taskLengthChange, setTaskLengthChange] = useState(0);


    useGSAP(()=> {
      const tl1 = gsap.timeline();
      const tl2 = gsap.timeline();

      tl1.to(".popupBubble3", {
        duration: 0.6,
        scale: 1.2,
        // stagger: -0.1,
        yoyo: true,
        repeat: -1,
        // reversed: true,
      })
      tl1.to(".popupBubble2", {
        duration: 0.6,
        scale: 1.2,
        delay: 0.3,
        // stagger: -0.1,
        yoyo: true,
        repeat: -1,
        // reversed: true,
      })
      tl1.to(".popupBubble1", {
        duration: 0.6,
        scale: 1.2,
        delay: 0.3,
        // stagger: -0.1,
        yoyo: true,
        repeat: -1,
        // reversed: true,
      })
      tl2.to(".popupBubble", {
        duration: 3,
        opacity: 0,
        repeat: -1,
        yoyo: true,
        delay: 4.2,
        
      })
      tl1.to(".popupText", {
        duration: 3,
        delay: 2,
        opacity: 1,
        repeat: -1,
        yoyo: true,
      })

      gsap.from(".taskNumberBubble", {
        scale: 0,
        duration: 0.6,
        translateX: "-145px",
        translateY: "-50px",
      })

      
    })

    useEffect(() => {
        const storedEmployees = localStorage.getItem('employees');
        const storedLoggedInUser = localStorage.getItem('loggedInUser');
    
        if (storedEmployees || storedLoggedInUser) {
          setuserData((prevState) => ({
            ...prevState,
            employees: storedEmployees ? JSON.parse(storedEmployees) : prevState.employees,
            loggedInUser: storedLoggedInUser ? JSON.parse(storedLoggedInUser) : prevState.loggedInUser,
          }));
        }
    }, []);
    
    

    const tasks = userData.loggedInUser?.data?.tasks;
    const CurrentUser = userData.loggedInUser;
    
  return (
    <div className='bg-transparent ml-[3vw]'>
    
      <div className='taskNumberBubble flex items-baseline bg-transparent border-[4px] border-[#9c815a] rounded-se-[35px] rounded-es-[35px] rounded-ee-[35px] w-[290px] h-[100px] '>
          <span className='bg-transparent ml-[20px] mt-[5px] font-bold text-[#9c815a] text-7xl'>
            {CurrentUser?.data.taskNumbers.newTask}
          </span>
          <span className='bg-transparent ml-[40px] font-medium text-[#9c815a] text-3xl'>
            New Tasks
          </span>
        </div>
      <div id='tasklist' className='bg-transparent flex overflow-x-auto gap-5 flex-nowrap items-center justify-start h-[55%]  w-full py-5 mt-10 mb-[20vh]'>
        

      {tasks?.some(task => task.newTask) ? (
            tasks.map((ele, idx) =>
            ele.newTask ? <NewTask key={ele.id || idx} data={ele} wholeData={props.data} setuserData={props.setuserData} /> : null
           )
          ) : (
            
            <div className="bg-transparent flex items-center justify-center w-full" onMouseEnter={() => {setTaskLengthChange((prev) => prev + 1)
              console.log("taskLengthChange: ",taskLengthChange)}
            }>
              <div className="relative bg-[#ded5c8] rounded-se-[35px] rounded-es-[35px] rounded-ee-[35px] w-[320px] h-[300px] ">
                <div className='popupBubble absolute bg-transparent flex flex-row gap-[27px] items-center justify-center top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]'>
                  
                  <div  className='popupBubble1 w-[35px] h-[35px] bg-[#ad9676] rounded-full'></div>
                  <div  className='popupBubble2 w-[35px] h-[35px] bg-[#ad9676] rounded-full'></div>
                  <div  className='popupBubble3 w-[35px] h-[35px] bg-[#ad9676] rounded-full'></div>


                </div>

                <div ref={popupTextRef} className='popupText absolute w-auto bg-transparent top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-center text-5xl font-bold text-[#ad9676] opacity-0'>No Such Tasks</div>
              </div>
            </div>
          )}

      </div>

      <div className='taskNumberBubble flex items-baseline bg-transparent border-[4px] border-[#9c815a] rounded-se-[35px] rounded-es-[35px] rounded-ee-[35px] w-[290px] h-[100px] '>
          <span className='activeTaskNumber bg-transparent ml-[20px] mt-[5px] font-bold text-[#9c815a] text-7xl'>
            {CurrentUser?.data.taskNumbers.active}
          </span>
          <span className='bg-transparent ml-[40px] font-medium text-[#9c815a] text-3xl'>
            Active Tasks
          </span>
        </div>
        <div id="tasklist" className="bg-transparent flex overflow-x-auto gap-5 flex-nowrap items-center justify-start h-[55%] w-full py-5 mt-10 mb-[20vh]">
          {tasks?.some(task => task.active) ? (
            tasks.map((ele, idx) =>
            ele.active ? <AcceptedTask key={ele.id || idx} data={ele} wholeData={props.data} setuserData={props.setuserData} /> : null
           )
          ) : (
            <div className="bg-transparent flex items-center justify-center w-full"  onMouseEnter={() => {setTaskLengthChange((prev) => prev + 1)
              console.log("taskLengthChange: ",taskLengthChange)}}>
              <div className="relative bg-[#ded5c8] rounded-se-[35px] rounded-es-[35px] rounded-ee-[35px] w-[320px] h-[300px] ">
                <div className='popupBubble absolute bg-transparent flex flex-row gap-[27px] items-center justify-center top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]'>
                  
                  <div  className='popupBubble1 w-[35px] h-[35px] bg-[#ad9676] rounded-full'></div>
                  <div  className='popupBubble2 w-[35px] h-[35px] bg-[#ad9676] rounded-full'></div>
                  <div  className='popupBubble3 w-[35px] h-[35px] bg-[#ad9676] rounded-full'></div>


                </div>

                <div ref={popupTextRef} className='popupText absolute w-auto bg-transparent top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-center text-5xl font-bold text-[#ad9676] opacity-0'>No Such Tasks</div>
              </div>
            </div>
          )}
      </div>

      <div className='taskNumberBubble flex items-baseline bg-transparent border-[4px] border-[#9c815a] rounded-se-[35px] rounded-es-[35px] rounded-ee-[35px] w-[290px] h-[100px] '>
          <span className='bg-transparent ml-[20px] mt-[5px] font-bold text-[#9c815a] text-7xl'>
            {CurrentUser?.data.taskNumbers.completed}
          </span>
          <span className='bg-transparent ml-[33px]  font-medium text-[#9c815a] text-[23px]'>
            Completed Tasks
          </span>
        </div>
      <div id='tasklist' className='bg-transparent flex overflow-x-auto gap-5 flex-nowrap items-center justify-start h-[55%]  w-full py-5 mt-10 mb-[20vh]'>
        

        {tasks?.some(task => task.completed) ? (
            tasks.map((ele, idx) =>
            ele.completed ? <CompletedTask key={ele.id || idx} data={ele} wholeData={props.data} setuserData={props.setuserData} /> : null
           )
          ) : (
            <div className="bg-transparent flex items-center justify-center w-full" onMouseEnter={() => {setTaskLengthChange((prev) => prev + 1)
              console.log("taskLengthChange: ",taskLengthChange)}}>
              <div className="relative bg-[#ded5c8] rounded-se-[35px] rounded-es-[35px] rounded-ee-[35px] w-[320px] h-[300px] ">
                <div className='popupBubble absolute bg-transparent flex flex-row gap-[27px] items-center justify-center top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]'>
                  
                  <div  className='popupBubble1 w-[35px] h-[35px] bg-[#ad9676] rounded-full'></div>
                  <div  className='popupBubble2 w-[35px] h-[35px] bg-[#ad9676] rounded-full'></div>
                  <div  className='popupBubble3 w-[35px] h-[35px] bg-[#ad9676] rounded-full'></div>


                </div>

                <div ref={popupTextRef} className='popupText absolute w-auto bg-transparent top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-center text-5xl font-bold text-[#ad9676] opacity-0'>No Such Tasks</div>
              </div>
            </div>
          )}

      </div>

      <div className='taskNumberBubble flex items-baseline bg-transparent border-[4px] border-[#9c815a] rounded-se-[35px] rounded-es-[35px] rounded-ee-[35px] w-[290px] h-[100px] '>
          <span className='bg-transparent ml-[20px] mt-[5px] font-bold text-[#9c815a] text-7xl'>
            {CurrentUser?.data.taskNumbers.failed}
          </span>
          <span className='bg-transparent ml-[40px] font-medium text-[#9c815a] text-3xl'>
            Failed Tasks
          </span>
        </div>
      <div id='tasklist' className='bg-transparent flex overflow-x-auto gap-5 flex-nowrap items-center justify-start h-[55%]  w-full py-5 mt-10 mb-[20vh]'>
        

      {tasks?.some(task => task.failed) ? (
            tasks.map((ele, idx) =>
            ele.failed ? <FailedTask key={ele.id || idx} data={ele} wholeData={props.data} setuserData={props.setuserData} /> : null
           )
          ) : (
            <div className="bg-transparent flex items-center justify-center w-full"  onMouseEnter={() => {setTaskLengthChange((prev) => prev + 1)
              console.log("taskLengthChange: ",taskLengthChange)}}>
              <div className="relative bg-[#ded5c8] rounded-se-[35px] rounded-es-[35px] rounded-ee-[35px] w-[320px] h-[300px] ">
                <div className='popupBubble absolute bg-transparent flex flex-row gap-[27px] items-center justify-center top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]'>
                  
                  <div  className='popupBubble1 w-[35px] h-[35px] bg-[#ad9676] rounded-full'></div>
                  <div  className='popupBubble2 w-[35px] h-[35px] bg-[#ad9676] rounded-full'></div>
                  <div  className='popupBubble3 w-[35px] h-[35px] bg-[#ad9676] rounded-full'></div>


                </div>

                <div ref={popupTextRef} className='popupText absolute w-auto bg-transparent top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-center text-5xl font-bold text-[#ad9676] opacity-0'>No Such Tasks</div>
              </div>
            </div>
          )}

      </div>

    </div>
  )
}

export default TaskList


