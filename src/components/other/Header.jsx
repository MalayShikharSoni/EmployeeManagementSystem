import React, { useEffect } from 'react'

const Header = (props) => {
  useEffect(()=>{

  }, [])
 
  const LogOutUser = () => {
    localStorage.setItem('loggedInUser','')
    // window.location.reload()
    props.changeUser('')
  }

  return (
  

    <div className='bg-[#1C1C1C] flex items-center justify-between px-5 py-2'>
        <h1 className='bg-[#1C1C1C] text-2xl font-medium'>Hello <br/> <span className='bg-[#1C1C1C] text-3xl font-semibold'>{props.user} 👋</span></h1>
        <button className='h-8 px-2 py-5 flex items-center justify-center bg-red-500 text-lg text-white rounded-sm' onClick={LogOutUser}>Log out</button>

    </div>
  )
}

export default Header