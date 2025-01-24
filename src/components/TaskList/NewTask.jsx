import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthProvider';

const NewTask = ({ setuserData, data, wholeData, AcceptClickButton }) => {
  const [userData, setUserData] = useContext(AuthContext);

  useEffect(() => {
    // You could perform any effect based on `userData` here if needed
  }, [userData]);

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
          onClick={() => {
            console.log(wholeData.firstname);
            AcceptClickButton(wholeData.firstname, data.title);
          }} 
          className='bg-yellow-500 px-2 py-1 text-sm'
        >
          Accept
        </button>
      </div>
    </div>
  );
};

export default NewTask;
