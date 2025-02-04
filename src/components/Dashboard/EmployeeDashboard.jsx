import React, { useEffect, useState } from 'react';
import Header from '../other/Header';
import TaskListNumbers from '../other/TaskListNumbers';
import TaskList from '../TaskList/TaskList';
import NameForm from '../other/NameForm';

const EmployeeDashboard = ({ changeUser, data, user, setuserData, AcceptClickButton, setLoggedInUserData }) => {
  // console.log(newData)
  return (
    <div className='p-10 bg-[#1C1C1C]'>
      <Header changeUser={changeUser} data={data} user={user} />
      <TaskListNumbers data={data} />
      <TaskList setuserData={setuserData} data={data} AcceptClickButton={AcceptClickButton} setLoggedInUserData={setLoggedInUserData} />
      <NameForm />
    </div>
  );
};

export default EmployeeDashboard;
