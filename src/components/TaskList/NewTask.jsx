import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthProvider';


const NewTask = ({ data, wholeData }) => {
  
  const [userData, setuserData] = useContext(AuthContext);

  const wholeDataa = userData.loggedInUser?.data;

  const dataa = userData.loggedInUser?.data.tasks.find(theTask => theTask.title === data.title)
  // const dataa = userData.loggedInUser?.data.tasks.map(theTask) => {
  //   if(theTask.title == data.title){
  //     return theTask;
  //   }
  // };

  // console.log('wholedataa: ', wholeDataa)
  // console.log('wholeDataa: ', wholeDataa)
  // console.log('usse matching: ',userData.loggedInUser?.data.tasks)


  // console.log('wholedata update hua kua', wholeData);

  const taskData = userData.loggedInUser?.data.tasks.find(theTask => theTask.title === data.title)

  // console.log('ye hai theTaskData: ',taskData)

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


  // ACCEPT CLICK BUTTON FUNCTION
  const AcceptClickButton = (firstname, title) => {
    setuserData((prevState) => {
      const updatedEmployees = prevState.employees.map((employee) => {
        if (employee.firstname === firstname) {
          return {
            ...employee,
            tasks: employee.tasks.map((task) =>
              task.title === title
                ? { ...task, newTask: false, completed: false, failed: false, active: true }
                : task
            ),
            taskNumbers: {
              ...employee.taskNumbers,
              newTask: employee.taskNumbers.newTask - 1,
              active: employee.taskNumbers.active + 1,
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
    <div className='flex-shrink-0 h-[300px] w-[300px] bg-blue-400 rounded-xl ml-2'>
      <div className='bg-transparent flex justify-between items-center p-2'>
        <h3 className='bg-red-600 px-3 py-1 text-sm rounded'>{dataa?.category}</h3>
        <h4 className='bg-transparent text-sm'>{dataa?.date}</h4>
      </div>
      <h2 className='p-2 bg-transparent mt-5 text-2xl font-semibold'>{dataa?.title}</h2>
      <p className='p-2 bg-transparent text-sm mt-2'>{dataa?.description}</p>

      <div className='flex justify-between m-4 bg-transparent'>
        <button 
          onClick={() => AcceptClickButton(wholeDataa?.firstname, dataa?.title)}
          className='bg-yellow-500 px-2 py-1 text-sm'
        >
          Accept
        </button>
      </div>
    </div>
  );
};

export default NewTask;
