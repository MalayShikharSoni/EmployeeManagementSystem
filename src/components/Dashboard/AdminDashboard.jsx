import React from 'react'
import Header from '../other/Header'
import CreateTask from '../other/CreateTask'
import AllTasks from '../other/AllTasks'

const AdminDashboard = () => {
  return (
    <div className='h-screen w-full p-7'>
      <Header />
      <CreateTask />
      <AllTasks />
    </div>
  )
}

export default AdminDashboard