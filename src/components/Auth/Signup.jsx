import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import BackButton from "../../assets/BackButton.svg";

const Signup = () => {


  const [firstname, setFirstname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [refresh, setRefresh] = useState(false); // State to trigger re-render
  const navigate = useNavigate();


  const handleSignup = (e) => {
    e.preventDefault();

   
    const storedEmployees = JSON.parse(localStorage.getItem("employees")) || [];

    
    const emailExists = storedEmployees.some((emp) => emp.email === email);
    if (emailExists) {
      alert("Email already in use! Try another.");
      return;
    }

    // Create new employee object
    const newEmployee = {
      id: storedEmployees.length + 1, 
      email,
      password,
      firstname,
      tasks: [], 
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

    navigate("/main");
  };

  return (
    <div className="containerr flex items-center justify-center h-[80vh] bg-[#cec0ad]">
      <div className="border-[3px] rounded-se-[75px] rounded-es-[75px] rounded-ee-[75px] p-20 border-[#ad9676] bg-[#cec0ad] max-sm:m-[10px] max-sm:p-[50px]">
        <form
          onSubmit={handleSignup}
          className="flex flex-col justify-center items-center w-full bg-transparent"
        >
          <Link to={"/"}>
            <div className="absolute top-7 left-7 bg-transparent">
              <img
                src={BackButton}
                alt="BackButton"
                className="bg-transparent w-auto h-[65px]"
              />
            </div>
          </Link>

          <input
            value={firstname}
            required
            onChange={(e) => {
              setFirstname(e.target.value);
            }}
            className="border-[3px] border-[#ad9676] m-2 rounded-se-[25px] rounded-es-[25px] rounded-ee-[25px] px-3 py-3 text-xl placeholder:text-[#ad9676] placeholder:font-bold w-full focus:outline-none focus:border-[#8b6c3e] text-[#8b6c3e]  placeholder:text-opacity-70 font-bold bg-[#cec0ad] max-sm: mt-[40px]"
            type="text"
            placeholder="Enter your Name"
          />

          <input
            value={email}
            required
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            className="border-[3px] border-[#ad9676] m-2 rounded-se-[25px] rounded-es-[25px] rounded-ee-[25px] px-3 py-3 text-xl placeholder:text-[#ad9676] placeholder:font-bold w-full focus:outline-none focus:border-[#8b6c3e] text-[#8b6c3e] placeholder:text-opacity-70 font-bold bg-[#cec0ad]"
            type="email"
            placeholder="Enter your Email"
          />
          <input
            value={password}
            required
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            className="border-[3px] border-[#ad9676] m-2 rounded-se-[25px] rounded-es-[25px] rounded-ee-[25px] px-3 py-3 text-xl placeholder:text-[#ad9676] placeholder:font-bold w-full focus:outline-none focus:border-[#8b6c3e] text-[#8b6c3e] placeholder:text-opacity-70 font-bold bg-[#cec0ad]"
            type="password"
            placeholder="Enter your password"
          />
          
          <button className="border-none mt-10  rounded-se-[25px] rounded-es-[25px] rounded-ee-[25px] px-3 py-3 text-xl text-[#cec0ad] font-bold  w-full bg-[#ad9676] focus:bg-[#8b6c3e]">
            Signup
          </button>
      

          <div className="relative mt-[70px] w-[85%] bg-[#ad9676] h-[1px]">
            <Link to={"/main"}>
              <div className="absolute w-[55%] text-center text-[13px] text-[#ad9676] font-semibold left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#cec0ad]">
                Already a user? <br /> Login Here
              </div>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
