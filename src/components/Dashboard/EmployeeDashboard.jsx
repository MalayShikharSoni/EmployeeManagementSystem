import React from 'react'
import Header from '../other/Header'
import TaskListNumbers from '../other/TaskListNumbers'
import TaskList from '../TaskList/TaskList'
import NameForm from '../other/NameForm'

const EmployeeDashboard = (props) => {
  return (
    <div className='p-10 bg-[#1C1C1C]'>
        <Header changeUser={props.changeUser} data={props.data} user={props.user}/>
        <TaskListNumbers data={props.data} />
        <TaskList data={props.data} />
        <NameForm />
    </div>
  )
}

export default EmployeeDashboard