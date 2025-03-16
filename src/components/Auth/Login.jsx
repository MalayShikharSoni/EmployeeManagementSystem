import React, { useState } from 'react'
import Signup from './Signup';
import { Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const Login = ({handleLogin}) => {

    useGSAP(()=>{

        

        gsap.from("body", {
            opacity: 0,
            duration: 0.7,
        })

    })

    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");
    // const [isLogin, setIsLogin] = useState(true);

    const SubmitHandler = (e) => {
        
        e.preventDefault()
        handleLogin(email,password)
        console.log("email is ",email)
        console.log("psw is ",password)

        setemail("")
        setpassword("")
    }
  return (

    

        <div className='containerr flex items-center justify-center h-[80vh] bg-[#cec0ad]'>
            <div className='border-[3px]  rounded-se-[25px] rounded-es-[25px] rounded-ee-[25px]  p-20 border-[#ad9676] bg-[#cec0ad]'>
                <form
                onSubmit={(e)=>{
                    SubmitHandler(e)
                }}
                className='flex flex-col justify-center items-center w-full bg-transparent'>
                    
                    {/* <div className=' bg-transparent text-5xl font-bold text-[#ad9676] mb-10'>Welcome to Work Wave</div> */}

                    <input
                    value={email}
                    required
                    onChange={(e)=>{
                        setemail(e.target.value)
                    }}
                    className='border-[3px] border-[#ad9676] m-2 rounded-se-[25px] rounded-es-[25px] rounded-ee-[25px] px-3 py-3 text-xl placeholder:text-[#ad9676] placeholder:font-bold w-full focus: outline-none bg-[#cec0ad]' type="email" placeholder='Enter your Email' />
                    <input 
                    value={password}
                    required
                    onChange={(e)=>{
                        setpassword(e.target.value)
                    }}
                    className='border-[3px] border-[#ad9676] m-2 rounded-se-[25px] rounded-es-[25px] rounded-ee-[25px] px-3 py-3 text-xl placeholder:text-[#ad9676] placeholder:font-bold w-full focus: outline-none bg-[#cec0ad]' type="password" placeholder='Enter your password' />
                    <button className='border-none mt-10  rounded-se-[25px] rounded-es-[25px] rounded-ee-[25px] px-3 py-3 text-xl text-[#cec0ad] font-bold  w-full bg-[#ad9676]'>Log in</button>


                    <div
                     
                     className='relative mt-[70px] w-[85%] bg-[#ad9676] h-[1px]'>
                        <Link to='/signup'>
                        <div className='absolute w-[55%] text-center text-[13px] text-[#ad9676] font-semibold left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#cec0ad]'>New to WorkWave? <br /> Sign Up Here</div>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
      
  )
}

export default Login