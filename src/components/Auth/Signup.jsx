import React, { useState } from 'react'
import Login from './Login';
import { Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const Signup = () => {

    useGSAP(()=> {
        gsap.from("body", {
            opacity: 0,
            duration: 0.7,
        })
    })

    const [firstname, setFirstname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [refresh, setRefresh] = useState(false); // State to trigger re-render

  // Function to handle signup
  const handleSignup = (e) => {
    e.preventDefault(); // Prevent page refresh

    // Get existing employees from localStorage
    const storedEmployees = JSON.parse(localStorage.getItem("employees")) || [];

    // Check if email already exists
    const emailExists = storedEmployees.some(emp => emp.email === email);
    if (emailExists) {
      alert("Email already in use! Try another.");
      return;
    }

    // Create new employee object
    const newEmployee = {
      id: storedEmployees.length + 1, // Assign new ID
      email,
      password,
      firstname,
      tasks: [], // New employee has no tasks initially
      taskNumbers: {
        active: 0,
        newTask: 0,
        completed: 0,
        failed: 0,
      },
    };

    // Append new employee & update localStorage
    const updatedEmployees = [...storedEmployees, newEmployee];
    localStorage.setItem("employees", JSON.stringify(updatedEmployees));

    // Clear input fields
    setFirstname("");
    setEmail("");
    setPassword("");

    setRefresh((prev) => !prev);
    alert("Signup successful!");
  };



  return (

    

    <div className='containerr flex items-center justify-center h-[80vh] bg-[#cec0ad]'>
        <div className='border-[3px]  rounded-se-[25px] rounded-es-[25px] rounded-ee-[25px]  p-20 border-[#ad9676] bg-[#cec0ad]'>
            <form
            onSubmit={handleSignup}
            className='flex flex-col justify-center items-center w-full bg-transparent'>
                
                <input
                value={firstname}
                required
                onChange={(e)=>{
                    setFirstname(e.target.value)
                }}
                className='border-[3px] border-[#ad9676] m-2 rounded-se-[25px] rounded-es-[25px] rounded-ee-[25px] px-3 py-3 text-xl placeholder:text-[#ad9676] placeholder:font-bold w-full focus: outline-none bg-[#cec0ad]' type="text" placeholder='Enter your Name' />
                
                <input
                value={email}
                required
                onChange={(e)=>{
                    setEmail(e.target.value)
                }}
                className='border-[3px] border-[#ad9676] m-2 rounded-se-[25px] rounded-es-[25px] rounded-ee-[25px] px-3 py-3 text-xl placeholder:text-[#ad9676] placeholder:font-bold w-full focus: outline-none bg-[#cec0ad]' type="email" placeholder='Enter your Email' />
                <input 
                value={password}
                required
                onChange={(e)=>{
                    setPassword(e.target.value)
                }}
                 className='border-[3px] border-[#ad9676] m-2 rounded-se-[25px] rounded-es-[25px] rounded-ee-[25px] px-3 py-3 text-xl placeholder:text-[#ad9676] placeholder:font-bold w-full focus: outline-none bg-[#cec0ad]' type="password" placeholder='Enter your password' />
                <button className='border-none mt-10  rounded-se-[25px] rounded-es-[25px] rounded-ee-[25px] px-3 py-3 text-xl text-[#cec0ad] font-bold  w-full bg-[#ad9676]'>Signup</button>


                <div className='relative mt-[70px] w-[85%] bg-[#ad9676] h-[1px]'>
                    <Link to={'/main'}>
                        <div className='absolute w-[55%] text-center text-[13px] text-[#ad9676] font-semibold left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#cec0ad]'>Already a user? <br /> Login Here</div>
                    </Link>
                </div>
            </form>
        </div>
    </div>

    
  )
}

export default Signup