import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthProvider';

const NewTask = ({ data, wholeData }) => {
  const [userData, setuserData] = useContext(AuthContext);
  const [forceRender, setForceRender] = useState(false); // Force UI re-render

  useEffect(() => {
    const storedEmployees = localStorage.getItem('employees');
    const storedLoggedInUser = localStorage.getItem('loggedInUser');

    if (storedEmployees) {
      setuserData((prevState) => ({
        ...prevState,
        employees: JSON.parse(storedEmployees),
      }));
    }

    if (storedLoggedInUser) {
      setuserData((prevState) => ({
        ...prevState,
        loggedInUser: JSON.parse(storedLoggedInUser),
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

      // 🔹 Force a UI update
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
        <h3 className='bg-red-600 px-3 py-1 text-sm rounded'>{data.category}</h3>
        <h4 className='bg-transparent text-sm'>{data.date}</h4>
      </div>
      <h2 className='p-2 bg-transparent mt-5 text-2xl font-semibold'>{data.title}</h2>
      <p className='p-2 bg-transparent text-sm mt-2'>{data.description}</p>

      <div className='flex justify-between m-4 bg-transparent'>
        <button 
          onClick={() => AcceptClickButton(wholeData.firstname, data.title)}
          className='bg-yellow-500 px-2 py-1 text-sm'
        >
          Accept
        </button>
      </div>
    </div>
  );
};

export default NewTask;
