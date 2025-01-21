import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/AuthProvider'
import { setLocalStorage } from '../../../utils/localstorage';

const CreateTask = (props) => {

  
  

  useEffect(() => {
   
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      props.setuserData(JSON.parse(storedUserData)); 
    }
  }, [props.setuserData]);

  const handleChange1 = (event) => {
    const inputValue = event.target.value;
    setassignTo(inputValue);
    console.log(inputValue);
  };

  const handleChange2 = (event) => {
    const inputValue = event.target.value;
    settitle(inputValue);
    console.log(inputValue);
  };

  const [userData, setuserData] = useContext(AuthContext)
  
  const [title, settitle] = useState('')
  const [taskDate, settaskDate] = useState('')
  const [assignTo, setassignTo] = useState('')
  const [category, setcategory] = useState('')
  const [description, setdescription] = useState('')

  // const [newTask, setnewTask] = useState({})

  const SubmitHandler = (e) => {
    e.preventDefault()
    const currentTask = {
      title,
      taskDate,
      category,
      description,
      active: false,
      newTask: true,
      completed: false,
      failed: false,
    }
    console.log("current task is: ", currentTask)
    console.log("Task Created, it is:")
    const data = userData.employees
    
    data.forEach((ele) => {
      if(assignTo == ele.firstname){
        
        console.log(title)
        ele.taskNumbers.newTask = ele.taskNumbers.newTask + 1
        console.log(ele.taskNumbers.newTask)
        ele.tasks.push(currentTask)

      }
    })
    localStorage.setItem('userData', JSON.stringify(userData));
    console.log(data)
    

    settitle('')
    settaskDate('')
    setassignTo('')
    setcategory('')
    setdescription('')
  }


  return (
    <div className='p-5 mt-7 rounded bg-[#1C1C1C]'>
    <form onSubmit={(e)=>{
      SubmitHandler(e)
    }} className='p-10 flex flex-wrap w-full items-start justify-between bg-[#1C1C1C]'>

      <div className='w-1/2 bg-[#1C1C1C]'>
        <div className='bg-[#1C1C1C]'>
          <h3 className='bg-[#1C1C1C] text-sm text-gray-300 mb-0.5'>Task Title</h3>
          <input
          value={title}
          onChange={handleChange2} 
          className='text-sm py-1 px-2 w-4/5 rounded outline-none bg-transparent border-[1px] border-gray-400 mb-4' type="text" placeholder='Make a UI Design' />
        </div>

        <div className='bg-[#1C1C1C]'>
        <h3 className='bg-[#1C1C1C] text-sm text-gray-300 mb-0.5'>Date</h3>
        <input
        value={taskDate}
        onChange={(e)=>{
          settaskDate(e.target.value)
        }}
         className=' text-sm py-1 px-2 w-4/5 rounded outline-none bg-transparent border-[1px] border-gray-400 mb-4' type="date" />
        </div>

        <div className='bg-[#1C1C1C]'>
        <h3 className='bg-[#1C1C1C] text-sm text-gray-300 mb-0.5'>Assign to</h3>
        <input
        value={assignTo}
        onChange={
          handleChange1
        }
         className=' text-sm py-1 px-2 w-4/5 rounded outline-none bg-transparent border-[1px] border-gray-400 mb-4' type='text' placeholder="employee name" />
        </div>

        <div className='bg-[#1C1C1C]'>
        <h3 className='bg-[#1C1C1C] text-sm text-gray-300 mb-0.5'>Category</h3>
        <input
        value={category}
        onChange={(e)=>{
          setcategory(e.target.value)
        }}
         className='bg-[#1C1C1C] text-sm py-1 px-2 w-4/5 rounded outline-none  border-[1px] border-gray-400 mb-4' type="text" placeholder="design, dev, etc." />
        </div>
      </div>

        

      <div className='bg-[#1C1C1C] flex flex-col items-start w-2/5'>
        <h3 className='bg-[#1C1C1C] text-sm text-gray-300 mb-0.5'>Description</h3>
        <textarea
        value={description}
        onChange={(e)=>{
          setdescription(e.target.value)
        }}
         className='bg-[#1C1C1C] w-full h-44 text-sm px-4 py-2 rounded outline-none bg-transparent border-[1px] border-gray-400' name="" id="" cols="30" rows="10"></textarea>
        <button className='bg-emerald-500 py-3 hover:bg-emerald-600 px-5 rounded text-sm mt-4 w-full'>Create Task</button>
      </div>

        

        
      
    </form>
  </div>
  )
}
export default CreateTask