import React, { useContext, useEffect, useState } from 'react'
import Login from './components/Auth/Login'
import Header from './components/other/Header'
import EmployeeDashboard from './components/Dashboard/EmployeeDashboard'
import TaskListNumbers from './components/other/TaskListNumbers'
import TaskList from './components/TaskList/TaskList'
import AdminDashboard from './components/Dashboard/AdminDashboard'
import { getLocalStorage, setLocalStorage } from '../utils/localstorage'
import { AuthContext } from './context/AuthProvider'


const App = () => {
  
  const [user, setUser] = useState(null)
  const [loggedInUserData, setLoggedInUserData] = useState(null)

  const [userData, setUserData] = useContext(AuthContext)
  useEffect(()=>{
    setLocalStorage()
    console.log(userData)
    const loggedInUser = localStorage.getItem('loggedInUser')

    if(loggedInUser){
      const userData = JSON.parse(loggedInUser)
      setUser(userData.role)
      setLoggedInUserData(userData.data)
    }
  }, [])
  //yaha authData passed tha
  
  const handleLogin = (email,password) => {
    if(email == 'admin@me.com' && password == 123){
      console.log("This is admin.")
      setUser("admin")
      localStorage.setItem('loggedInUser', JSON.stringify({role: 'admin'}))
    }
    else if(userData){
      const employee = userData.employees.find((e)=> e.email == email && e.password == password)
      if(employee){
        console.log("This is employee")
        setUser(email)
        setLoggedInUserData(employee)
        localStorage.setItem('loggedInUser', JSON.stringify({role: 'employee', data: employee}))
        
      }
    }
    else{
      alert("Invalid credentials")
    }
  }


  return (
    <>
    {/* {localStorage.clear()} */}
    {!user ? <Login handleLogin={handleLogin} /> : user == "admin"  ? <AdminDashboard setuserData={setUserData} changeUser={setUser}/> : <EmployeeDashboard changeUser={setUser} data={loggedInUserData}  user={user} />}
    
    
    </>
  )
}

export default App