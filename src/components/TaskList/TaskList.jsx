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
    
  return (
    <div id='tasklist' className='flex overflow-x-auto gap-5 flex-nowrap items-center justify-start h-[55%]  w-full py-5 mt-10'>
        
        {tasks?.map((ele, idx)=>{
            if(ele.newTask){
                return <NewTask key={idx} data={ele} wholeData={props.data} AcceptClickButton={props.AcceptClickButton} setuserData={props.setuserData} setLoggedInUserData={props.setLoggedInUserData}/>
            }
            if(ele.active){
                return <AcceptedTask key={idx} data={ele} wholeData={props.data} setuserData={props.setuserData}/>
            }
            if(ele.completed){
                return <CompletedTask key={idx} data={ele} wholeData={props.data} setuserData={props.setuserData}/>
            }
            if(ele.failed){
                return <FailedTask key={idx} data={ele} wholeData={props.data} setuserData={props.setuserData}/>
            }
        })}

        {/* <NewTask />
        <AcceptedTask /> */}

    </div>
  )
}

export default TaskList


