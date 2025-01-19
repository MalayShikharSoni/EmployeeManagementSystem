import React, { useState } from 'react'

const Login = ({handleLogin}) => {

    const [email, setemail] = useState("")
    const [password, setpassword] = useState("")

    const SubmitHandler = (e) => {
        
        e.preventDefault()
        handleLogin(email,password)
        // console.log("Typ Shi")
        console.log("email is ",email)
        console.log("psw is ",password)

        setemail("")
        setpassword("")
    }
  return (
    <div className='flex items-center justify-center h-screen'>
        <div className='border-2 rounded-xl p-20 border-emerald-600'>
            <form
            onSubmit={(e)=>{
                SubmitHandler(e)
            }}
            className='flex flex-col justify-center items-center w-full'>
                <input
                value={email}
                required
                onChange={(e)=>{
                    setemail(e.target.value)
                }}
                className='border-2 m-2 border-emerald-600 rounded-full px-3 py-3 text-xl placeholder:text-gray-400 w-full' type="email" placeholder='Enter your Email' />
                <input 
                value={password}
                required
                onChange={(e)=>{
                    setpassword(e.target.value)
                }}
                 className='border-2 m-2 border-emerald-600 rounded-full px-3 py-3 text-xl placeholder:text-gray-400 w-full' type="password" placeholder='Enter your password' />
                <button className='border-none mt-5 bg-emerald-600 rounded-full px-3 py-3 text-xl  w-full'>Log in</button>
            </form>
        </div>
    </div>
  )
}

export default Login