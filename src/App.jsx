import React, { useContext, useEffect, useState } from 'react';
import Login from './components/Auth/Login';
import Header from './components/other/Header';
import EmployeeDashboard from './components/Dashboard/EmployeeDashboard';
import TaskListNumbers from './components/other/TaskListNumbers';
import TaskList from './components/TaskList/TaskList';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import { getLocalStorage, setLocalStorage } from '../utils/localstorage';
import { AuthContext } from './context/AuthProvider';
import CustomCursor from './components/CustomCursor';
import TVStaticEffect from './pages/TVStaticEffect';
import gsap from 'gsap';
// import { ToastContainer, toast } from 'react-toastify';
import { useGSAP } from '@gsap/react';
import LandingPage from './pages/LandingPage';
import Footer from './pages/Footer';
const App = () => {

  

  const [user, setUser] = useState(null);
  const [loggedInUserData, setLoggedInUserData] = useState(null);
  const [changes, setChanges] = useState(0);
  const [xAxis, setXAxis] = useState();
  const [yAxis, setYAxis] = useState();

  // setLocalStorage();
  
  // const [userData, setUserData] = useContext(AuthContext);
  
  // console.log('usecontext wala userData hai: ',userData);

  const [userData, setUserData] = useContext(AuthContext)
  // console.log('App se userData: ',userData)
  
  
  useEffect(() => {
    console.log(changes)
    const loggedInUser = localStorage.getItem('loggedInUser');
    if(!loggedInUserData){

      if (loggedInUser) {
        const userData = JSON.parse(loggedInUser);
        setUser(userData.role);
        setLoggedInUserData(userData.data);
      }
    }
  }, [changes]);

  // const AcceptClickButton = (firstname, title) => {
  //   const dataa = localStorage.getItem('employees');
  //   const data = JSON.parse(dataa);
  //   console.log(data)

  //   data.forEach((ele) => {
  //     if (ele.firstname === firstname) {
  //       const allTasks = ele.tasks;
  //       allTasks.forEach((elem) => {
  //         if (elem.title === title) {
  //           elem.newTask = false;
  //           elem.completed = false;
  //           elem.failed = false;
  //           elem.active = true;

  //           ele.taskNumbers.newTask -= 1;
  //           ele.taskNumbers.active += 1;
  //         }
  //       });
  //       setLoggedInUserData(ele);
  //     }
  //   });
  //   localStorage.setItem('employees', JSON.stringify(data));
  //   setChanges((prev) => prev + 1);
  // };

  const adminData = {
    firstname: "Admin",
  };

  // const loginNotification = () => toast('Logged In Successfully!');

  const handleLogin = (email, password) => {
    if (email === 'admin@me.com' && password === '123') {
      setUser("admin");
      localStorage.setItem('loggedInUser', JSON.stringify({ role: 'admin', data: userData.admin }));
      loginNotification();

    } else if (userData) {
      const employee = userData.employees.find((e) => e.email === email && e.password === password);
      if (employee) {
        setUser(email);
        setLoggedInUserData(employee);
        localStorage.setItem('loggedInUser', JSON.stringify({ role: 'employee', data: employee }));
        loginNotification();
      }
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div>
        <CustomCursor x={xAxis} y={yAxis} />
        <div
          onMouseMove={(e) => {
            setXAxis(e.clientX);
            setYAxis(e.clientY);
          }}
          className='relative'
        >
          

          <LandingPage />


          {/* <button onClick={loginNotification}>toastiiiifyyy</button> */}

          {!user ? (
            <Login handleLogin={handleLogin} />
          ) : user === "admin" ? (
            <AdminDashboard setUserData={setUserData} data={adminData} changeUser={setUser} />
          ) : (
            <EmployeeDashboard setUserData={setUserData}  changeUser={setUser} data={loggedInUserData} user={user} setLoggedInUserData={setLoggedInUserData}/>
          )}
        {/* <ToastContainer/> */}
        <Footer />
      

        </div>


        <TVStaticEffect /> 
    </div>
  );
};

export default App;
