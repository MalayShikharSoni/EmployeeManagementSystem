import React, { useContext, useEffect } from 'react'
import Header from '../other/Header'
import CreateTask from '../other/CreateTask'
import AllTasks from '../other/AllTasks'
import { AuthContext } from '../../context/AuthProvider'

const AdminDashboard = (props) => {
  const [userData, setuserData] = useContext(AuthContext)
  
  useEffect(() => {
  
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      setuserData(JSON.parse(storedUserData));
    }
  }, [setuserData]);
  
  console.log(userData)
  return (
    <div className='h-screen w-full p-7'>
      <Header changeUser={props.changeUser} />
      <CreateTask setuserData={props.setuserData}/>
      <AllTasks />
    </div>
  )
}

export default AdminDashboard