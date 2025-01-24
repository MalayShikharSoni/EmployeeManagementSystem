import React from 'react'

const AcceptedTask = (props) => {
  // console.log(data);

  const MarkAsCompletedClickButton = () => {
    props.data.newTask = false
    props.data.completed = true
    props.data.failed = false
    props.data.active = false

    props.wholeData.taskNumbers.active -= 1;
    props.wholeData.taskNumbers.completed += 1;
  }

  const MarkAsFailedClickButton = () => {
    props.data.newTask = false
    props.data.completed = false
    props.data.failed = true
    props.data.active = false

    props.wholeData.taskNumbers.active -= 1;
    props.wholeData.taskNumbers.failed += 1;
  }

  return (
    <div className='flex-shrink-0 h-[300px] w-[300px] bg-yellow-400 rounded-xl ml-2'>
    <div className='bg-transparent flex justify-between items-center p-2'>
        <h3 className='bg-red-600 px-3 py-1 text-sm rounded'>{props.data.category}</h3>
        <h4 className='bg-transparent text-sm'>{props.data.date}</h4>
    </div>
    <h2 className='p-2 bg-transparent mt-5 text-xl font-semibold'>{props.data.title}</h2>
    <p className='p-2 bg-transparent text-sm mt-2'>{props.data.description}</p>

    <div className='flex justify-between m-4 bg-transparent'>
      <button onClick={MarkAsCompletedClickButton} className='bg-green-500 px-2 py-1 text-sm'>Mark as Completed</button>
      <button onClick={MarkAsFailedClickButton} className='bg-red-500 px-2 py-1 text-sm'>Mark as Failed</button>
    
    </div>

  </div>
  )
}

export default AcceptedTask