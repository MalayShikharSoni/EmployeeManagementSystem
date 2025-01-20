import React, { useContext } from 'react'
import { AuthContext } from '../../context/AuthProvider'

const AllTasks = () => {

    const [userData, setUserData] = useContext(AuthContext)
  return (
    <div id='alltasks' className='bg-[#1c1c1c] rounded mt-5 p-5 h-48'>
        <div className='bg-red-400 flex justify-between rounded px-4 py-2 mb-2'>
            <h2 className='text-lg font-medium w-1/5 text-center bg-transparent'>Employee Name</h2>
            <h3 className='text-lg font-medium w-1/5 text-center bg-transparent'>New Tasks</h3>
            <h5 className='text-lg font-medium w-1/5 text-center bg-transparent'>Active Tasks</h5>
            <h5 className='text-lg font-medium w-1/5 text-center bg-transparent'>Completed Tasks</h5>
            <h5 className='text-lg font-medium w-1/5 text-center bg-transparent'>Failed Tasks</h5>
        </div>

        <div id='allTasks' className='h-[80%] overflow-auto'>
            {userData.employees.map((ele, idx)=>{
                return <div key={idx} className='bg-red-400 flex justify-between rounded px-4 py-2 mb-2'>
                <h2 className='text-lg font-medium w-1/5 text-center bg-transparent'>{ele.firstname}</h2>
                <h3 className='text-lg font-medium w-1/5 text-center bg-transparent'>{ele.taskNumbers.newTask}</h3>
                <h5 className='text-lg font-medium w-1/5 text-center bg-transparent'>{ele.taskNumbers.active}</h5>
                <h5 className='text-lg font-medium w-1/5 text-center bg-transparent'>{ele.taskNumbers.completed}</h5>
                <h5 className='text-lg font-medium w-1/5 text-center bg-transparent'>{ele.taskNumbers.failed}</h5>
            </div>
            })}
        </div>
        

    </div>
  )
}

export default AllTasks