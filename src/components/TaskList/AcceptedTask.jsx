import React, { useContext, useEffect, useRef, useState } from 'react'
import { AuthContext } from '../../context/AuthProvider';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';



const AcceptedTask = ({ data, wholeData }) => {

  const yellowBox = useRef();
  useGSAP(() => {
    gsap.from(yellowBox.current, {
      x:100,

    })
  })
  // console.log(data);

  // const MarkAsCompletedClickButton = () => {
  //   props.data.newTask = false
  //   props.data.completed = true
  //   props.data.failed = false
  //   props.data.active = false

  //   props.wholeData.taskNumbers.active -= 1;
  //   props.wholeData.taskNumbers.completed += 1;
  // }

  // const MarkAsFailedClickButton = () => {
  //   props.data.newTask = false
  //   props.data.completed = false
  //   props.data.failed = true
  //   props.data.active = false

  //   props.wholeData.taskNumbers.active -= 1;
  //   props.wholeData.taskNumbers.failed += 1;
  // }


  const [userData, setuserData] = useContext(AuthContext);

  const wholeDataa = userData.loggedInUser?.data;
  const dataa = userData.loggedInUser?.data.tasks.find(theTask => theTask.title === data.title)

  const taskData = userData.loggedInUser?.data.tasks.find(theTask => theTask.title === data.title)
  const [forceRender, setForceRender] = useState(false); // Force UI re-render

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
  


  // MARK AS COMPLETED CLICK BUTTON FUNCTION
  const MarkAsCompletedClickButton = (firstname, title) => {
    setuserData((prevState) => {
      const updatedEmployees = prevState.employees.map((employee) => {
        if (employee.firstname === firstname) {
          return {
            ...employee,
            tasks: employee.tasks.map((task) =>
              task.title === title
                ? { ...task, newTask: false, completed: true, failed: false, active: false }
                : task
            ),
            taskNumbers: {
              ...employee.taskNumbers,
              active: employee.taskNumbers.active - 1,
              completed: employee.taskNumbers.completed + 1,
            },
          };
        }
        return employee;
      });

      const updatedUserData = updatedEmployees.find(emp => emp.firstname === firstname);

      const updatedLoggedInUser = {
        role: prevState.loggedInUser.role, 
        data: updatedUserData,
      };

      // Store in localStorage
      localStorage.setItem('employees', JSON.stringify(updatedEmployees));
      localStorage.setItem('loggedInUser', JSON.stringify(updatedLoggedInUser));

      // Trying to update wholeData and data
      // wholeDataa = userData.loggedInUser

      // dataa = userData.loggedInUser.d
      
      // Force a UI update
      setForceRender(prev => !prev); 

      return {
        ...prevState,
        employees: updatedEmployees,
        loggedInUser: updatedLoggedInUser,
      };
    });
  };




  // MARK AS COMPLETED CLICK BUTTON FUNCTION
  const DeclineClickButton = (firstname, title) => {
    setuserData((prevState) => {
      const updatedEmployees = prevState.employees.map((employee) => {
        if (employee.firstname === firstname) {
          return {
            ...employee,
            tasks: employee.tasks.map((task) =>
              task.title === title
                ? { ...task, newTask: false, completed: false, failed: true, active: false }
                : task
            ),
            taskNumbers: {
              ...employee.taskNumbers,
              active: employee.taskNumbers.active - 1,
              failed: employee.taskNumbers.failed + 1,
            },
          };
        }
        return employee;
      });

      const updatedUserData = updatedEmployees.find(emp => emp.firstname === firstname);

      const updatedLoggedInUser = {
        role: prevState.loggedInUser.role, 
        data: updatedUserData,
      };

      // Store in localStorage
      localStorage.setItem('employees', JSON.stringify(updatedEmployees));
      localStorage.setItem('loggedInUser', JSON.stringify(updatedLoggedInUser));

      // Trying to update wholeData and data
      // wholeDataa = userData.loggedInUser

      // dataa = userData.loggedInUser.d
      
      // Force a UI update
      setForceRender(prev => !prev); 

      return {
        ...prevState,
        employees: updatedEmployees,
        loggedInUser: updatedLoggedInUser,
      };
    });
  };





  return (
    <div ref={yellowBox} className='flex-shrink-0 h-[300px] w-[300px] bg-yellow-400 rounded-xl ml-2'>
    <div className='bg-transparent flex justify-between items-center p-2'>
        <h3 className='bg-red-600 px-3 py-1 text-sm rounded'>{dataa?.category}</h3>
        <h4 className='bg-transparent text-sm'>{dataa?.date}</h4>
    </div>
    <h2 className='p-2 bg-transparent mt-5 text-xl font-semibold'>{dataa?.title}</h2>
    <p className='p-2 bg-transparent text-sm mt-2'>{dataa?.description}</p>

    <div className='flex justify-between m-4 bg-transparent'>
      <button
        onClick={() => MarkAsCompletedClickButton(wholeDataa?.firstname, dataa?.title)}
        className='bg-green-500 px-2 py-1 text-sm'>
        Mark as Completed
      </button>

      <button
        onClick={() => DeclineClickButton(wholeDataa?.firstname, dataa?.title)}
        className='bg-red-500 px-2 py-1 text-sm'>
        Decline
      </button>
    
    </div>

  </div>
  )
}

export default AcceptedTask