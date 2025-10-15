import React, { useState } from "react";
import { Link } from "react-router-dom";


import BackButton from "../../assets/BackButton.svg";

const Login = ({ handleLogin }) => {
  

  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  // const [isLogin, setIsLogin] = useState(true);

  const SubmitHandler = (e) => {
    e.preventDefault();
    handleLogin(email, password);
    console.log("email is ", email);
    console.log("psw is ", password);

    setemail("");
    setpassword("");
  };
  return (
    <div className="containerr flex items-center justify-center h-[80vh] bg-[#cec0ad]">
      <div className="border-[3px] rounded-se-[75px] rounded-es-[75px] rounded-ee-[75px]  p-20 border-[#ad9676] bg-[#cec0ad] max-sm:m-[10px]">
        <form
          onSubmit={(e) => {
            SubmitHandler(e);
          }}
          className="flex flex-col justify-center items-center w-full bg-transparent"
        >
          <Link to={"/"}>
            <div className="absolute top-7 left-7 bg-transparent max-sm:top-10 max-sm:left-5">


              <img
                src={BackButton}
                alt="BackButton"
                className="bg-transparent w-auto h-[65px]"
              />
            </div>
          </Link>

          {/* <div className=' bg-transparent text-5xl font-bold text-[#ad9676] mb-10'>Welcome to Work Wave</div> */}

          <input
            value={email}
            required
            onChange={(e) => {
              setemail(e.target.value);
            }}
            className="border-[3px] border-[#ad9676] m-2 rounded-se-[25px] rounded-es-[25px] rounded-ee-[25px] px-3 py-3 text-xl placeholder:text-[#ad9676] font-bold text-[#8b6c3e] placeholder:text-opacity-70 placeholder:font-bold w-full focus:outline-none focus:border-[#8b6c3e] bg-[#cec0ad]"
            type="email"
            placeholder="Enter your Email"
          />
          <input
            value={password}
            required
            onChange={(e) => {
              setpassword(e.target.value);
            }}
            className="border-[3px] border-[#ad9676] m-2 rounded-se-[25px] rounded-es-[25px] rounded-ee-[25px] px-3 py-3 text-xl placeholder:text-[#ad9676] font-bold text-[#8b6c3e] placeholder:text-opacity-70 placeholder:font-bold w-full focus:outline-none focus:border-[#8b6c3e] bg-[#cec0ad]"
            type="password"
            placeholder="Enter your password"
          />
          <button className="border-none mt-10  rounded-se-[25px] rounded-es-[25px] rounded-ee-[25px] px-3 py-3 text-xl text-[#cec0ad] font-bold  w-full bg-[#ad9676] focus:bg-[#8b6c3e]">
            Log in
          </button>

          <div className="relative mt-[70px] w-[85%] bg-[#ad9676] h-[1px]">
            <Link to="/signup">
              <div className="absolute w-[55%] text-center text-[13px] text-[#ad9676] font-semibold left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#cec0ad]">
                New to WorkWave? <br /> Sign Up Here
              </div>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
