import React, { useContext, useEffect } from 'react'
import AcceptedTask from './AcceptedTask'
import NewTask from './NewTask'
import CompletedTask from './CompletedTask'
import FailedTask from './FailedTask'
import { AuthContext } from '../../context/AuthProvider'


const TaskList = (props) => {
    const [userData, setuserData] = useContext(AuthContext)

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
    
      <div className='flex items-baseline bg-transparent border-[4px] border-[#9c815a] rounded-se-[35px] rounded-es-[35px] rounded-ee-[35px] w-[290px] h-[100px] '>
          <span className='bg-transparent ml-[20px] mt-[5px] font-bold text-[#9c815a] text-7xl'>
            {CurrentUser?.data.taskNumbers.newTask}
          </span>
          <span className='bg-transparent ml-[40px] font-medium text-[#9c815a] text-3xl'>
            New Tasks
          </span>
        </div>
      <div id='tasklist' className='bg-transparent flex overflow-x-auto gap-5 flex-nowrap items-center justify-start h-[55%]  w-full py-5 mt-10 mb-[20vh]'>
        

        {tasks?.map((ele, idx)=>{
            if(ele.newTask){
                return <NewTask key={idx} data={ele} wholeData={props.data} AcceptClickButton={props.AcceptClickButton} setuserData={props.setuserData} setLoggedInUserData={props.setLoggedInUserData}/>
            }
        })}

      </div>

      <div className='flex items-baseline bg-transparent border-[4px] border-[#9c815a] rounded-se-[35px] rounded-es-[35px] rounded-ee-[35px] w-[290px] h-[100px] '>
          <span className='bg-transparent ml-[20px] mt-[5px] font-bold text-[#9c815a] text-7xl'>
            {CurrentUser?.data.taskNumbers.active}
          </span>
          <span className='bg-transparent ml-[40px] font-medium text-[#9c815a] text-3xl'>
            Active Tasks
          </span>
        </div>
      <div id='tasklist' className='bg-transparent flex overflow-x-auto gap-5 flex-nowrap items-center justify-start h-[55%]  w-full py-5 mt-10'>
        

        {tasks?.map((ele, idx)=>{
          
            if(ele.active){
                return <AcceptedTask key={idx} data={ele} wholeData={props.data} setuserData={props.setuserData}/>
            }
            
        })}

      </div>

      <div className='flex items-baseline bg-transparent border-[4px] border-[#9c815a] rounded-se-[35px] rounded-es-[35px] rounded-ee-[35px] w-[290px] h-[100px] '>
          <span className='bg-transparent ml-[20px] mt-[5px] font-bold text-[#9c815a] text-7xl'>
            {CurrentUser?.data.taskNumbers.completed}
          </span>
          <span className='bg-transparent ml-[33px]  font-medium text-[#9c815a] text-[23px]'>
            Completed Tasks
          </span>
        </div>
      <div id='tasklist' className='bg-transparent flex overflow-x-auto gap-5 flex-nowrap items-center justify-start h-[55%]  w-full py-5 mt-10'>
        

        {tasks?.map((ele, idx)=>{
            
            if(ele.completed){
                return <CompletedTask key={idx} data={ele} wholeData={props.data} setuserData={props.setuserData}/>
            }
            
        })}

      </div>

      <div className='flex items-baseline bg-transparent border-[4px] border-[#9c815a] rounded-se-[35px] rounded-es-[35px] rounded-ee-[35px] w-[290px] h-[100px] '>
          <span className='bg-transparent ml-[20px] mt-[5px] font-bold text-[#9c815a] text-7xl'>
            {CurrentUser?.data.taskNumbers.failed}
          </span>
          <span className='bg-transparent ml-[40px] font-medium text-[#9c815a] text-3xl'>
            Failed Tasks
          </span>
        </div>
      <div id='tasklist' className='bg-transparent flex overflow-x-auto gap-5 flex-nowrap items-center justify-start h-[55%]  w-full py-5 mt-10'>
        

        {tasks?.map((ele, idx)=>{
            
            if(ele.failed){
                return <FailedTask key={idx} data={ele} wholeData={props.data} setuserData={props.setuserData}/>
            }
        })}

      </div>

    </div>
  )
}

export default TaskList


