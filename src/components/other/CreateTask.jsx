import React, { useState } from 'react'

const CreateTask = () => {

  const [task, settask] = useState({})

  const SubmitHandler = (e) => {
    e.preventDefault()
    settask({taskTitle, taskDate, category, taskDescription, active:false, newTask:true, completed:false, failed:false})
    console.log("Task Created")

    

    // settaskTitle('')
    // settaskDate('')
    // setassignTo('')
    // setcategory('')
    // settaskDescription('')
  }

  const [taskTitle, settaskTitle] = useState('')
  const [taskDate, settaskDate] = useState('')
  const [assignTo, setassignTo] = useState('')
  const [category, setcategory] = useState('')
  const [taskDescription, settaskDescription] = useState('')

  return (
    <div className='p-5 mt-7 rounded bg-[#1C1C1C]'>
    <form onSubmit={(e)=>{
      SubmitHandler(e)
    }} className='p-10 flex flex-wrap w-full items-start justify-between bg-[#1C1C1C]'>

      <div className='w-1/2 bg-[#1C1C1C]'>
        <div className='bg-[#1C1C1C]'>
          <h3 className='bg-[#1C1C1C] text-sm text-gray-300 mb-0.5'>Task Title</h3>
          <input
          value={taskTitle}
          onChange={(e)=>{
            settaskTitle(e.target.value)
          }} 
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
        onChange={(e)=>{
          setassignTo(e.target.value)
        }}
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
        value={taskDescription}
        onChange={(e)=>{
          settaskDescription(e.target.value)
        }}
         className='bg-[#1C1C1C] w-full h-44 text-sm px-4 py-2 rounded outline-none bg-transparent border-[1px] border-gray-400' name="" id="" cols="30" rows="10"></textarea>
        <button className='bg-emerald-500 py-3 hover:bg-emerald-600 px-5 rounded text-sm mt-4 w-full'>Create Task</button>
      </div>

        

        
      
    </form>
  </div>
  )
}
export default CreateTask