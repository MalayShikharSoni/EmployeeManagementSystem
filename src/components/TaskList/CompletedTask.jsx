import React from 'react'

const CompletedTask = ({data}) => {
  return (
    <div className='flex-shrink-0 h-[300px] w-[300px] bg-green-400 rounded-xl ml-2'>
            <div className='bg-transparent flex justify-between items-center p-2'>
                <h3 className='bg-red-600 px-3 py-1 text-sm rounded'>{data.category}</h3>
                <h4 className='bg-transparent text-sm'>{data.date}</h4>
            </div>
            <h2 className='p-2 bg-transparent mt-5 text-2xl font-semibold'>{data.title}</h2>
            <p className='p-2 bg-transparent text-sm mt-2'>{data.description}</p>

        <div className='flex justify-between m-4 bg-transparent'>
            <button className='bg-gray-500 px-2 py-1 text-sm'>Completed</button>
        </div>

    </div>
  )
}

export default CompletedTask