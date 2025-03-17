import React, { useEffect } from 'react'


const Header = (props) => {


 
  
  const LogOutUser = () => {
    localStorage.setItem('loggedInUser','')
    // window.location.reload()
    props.changeUser('')
  }

  return (
  

    <div className='bg-[#cec0ad] flex items-center justify-between px-5 py-2'>
        <h1 className='bg-[#cec0ad] text-2xl font-medium'>Hello <br/> <span className='bg-[#cec0ad] text-3xl font-semibold'>{props.data.firstname} 👋</span></h1>
        <button className='h-8 px-2 py-5 flex items-center justify-center bg-red-500 text-lg text-white rounded-sm' onClick={LogOutUser}>Log out</button>

    </div>
  )
}

export default Header