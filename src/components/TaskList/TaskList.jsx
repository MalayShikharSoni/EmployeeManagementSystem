import React from 'react'
import AcceptedTask from './AcceptedTask'
import NewTask from './NewTask'
import CompletedTask from './CompletedTask'
import FailedTask from './FailedTask'

const TaskList = ({data}) => {
  return (
    <div id='tasklist' className='flex overflow-x-auto gap-5 flex-nowrap items-center justify-start h-[55%]  w-full py-5 mt-10'>
        
        {data.tasks.map((ele, idx)=>{
            if(ele.failed){
                return <FailedTask key={idx} data={ele}/>
            }
            if(ele.completed){
                return <CompletedTask key={idx} data={ele}/>
            }
            if(ele.active){
                return <AcceptedTask key={idx} data={ele}/>
            }
            if(ele.newTask){
                return <NewTask key={idx} data={ele}/>
            }
        })}

        {/* <NewTask />
        <AcceptedTask /> */}

    </div>
  )
}

export default TaskList