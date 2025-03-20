import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/AuthProvider'
import { setLocalStorage } from '../../../utils/localstorage';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

// import { Slide, ToastContainer, toast } from 'react-toastify';




const CreateTask = (props) => {

  // const taskCreatedNotification = () => toast.info('🦄 Wow so easy!', {
  //   position: "top-right",
  //   autoClose: 5000,
  //   hideProgressBar: false,
  //   closeOnClick: false,
  //   pauseOnHover: true,
  //   draggable: true,
  //   progress: undefined,
  //   theme: "colored",
  //   transition: Slide,
  //   });



  const [title, settitle] = useState('')
  const [date, setdate] = useState('')
  const [assignTo, setassignTo] = useState('')
  const [category, setcategory] = useState('')
  const [description, setdescription] = useState('')
  
  const [userData, setuserData] = useContext(AuthContext)
  // console.log('CreateTask ka usecontext: ',userData)
  

  useEffect(() => {
    const storedEmployees = localStorage.getItem('employees');
    // console.log('existence hai? ',storedEmployees)
    if (storedEmployees) {
      setuserData({ employees: JSON.parse(storedEmployees) });
    }
  }, []);

  const animateWavyLetters = () => {
    gsap.to(".titleLineLetter1", 
      
      {
      y: -10,
      ease: "back",
      // yoyo: true,
      stagger: 0.05,
      duration: 0.5,
      // repeat: 1,
    })

    gsap.to(".titleLineLetter2", 
      
      {
      y: -10,
      ease: "back",
      // yoyo: true,
      stagger: 0.05,
      duration: 0.5,
      delay:0.3,
      // repeat: 1,
    })

    gsap.to(".titleLineLetter1", 
      
      {
      y: 10,
      ease: "back",
      // yoyo: true,
      stagger: 0.05,
      duration: 0.5,
      delay: 0.3,
      // repeat: 1,
    })

    gsap.to(".titleLineLetter2", 
      
      {
      y: 10,
      ease: "back",
      // yoyo: true,
      stagger: 0.05,
      duration: 0.5,
      delay: 0.6,
      // repeat: 1,
    })
  }

  useGSAP(()=> {

    gsap.from(".titleLineLetter1", {
      x: -200,
      duration: 30,
      
      ease: "back.inOut",
      yoyo: true,
      repeat: -1,
    })

    gsap.from(".titleLineLetter2", {
      x: 200,
      duration: 30,
      
      ease: "back.inOut",
      yoyo: true,
      repeat: -1,
    })

  })

 
  
  const SubmitHandler = (e) => {
    e.preventDefault()

    const currentTask = {
      title,
      date,
      category,
      description,
      active: false,
      newTask: true,
      completed: false,
      failed: false,
    }
    console.log("current task is: ", currentTask)
    console.log("Task Created, it is:")
    // const data = [...userData.employees]
    
    
    // Update the employees array
    const updatedEmployees = userData.employees.map((ele) => {
      if (assignTo === ele.firstname) {
        ele.taskNumbers.newTask += 1;
        ele.tasks.push(currentTask);
      }
      return ele;
    });

    // Update the localStorage with the updated employees array
    localStorage.setItem('employees', JSON.stringify(updatedEmployees));

    // Update the state with the new employees array
    setuserData({ employees: updatedEmployees });

    // taskCreatedNotification();

    settitle('')
    setdate('')
    setassignTo('')
    setcategory('')
    setdescription('')
  }


  return (
    <div className='w-auto h-full rounded bg-[#cec0ad]'>

      <div className='flex flex-row bg-transparent pt-[16vh]'>

          <form onSubmit={(e)=>{
             SubmitHandler(e)
            }} className='p-10 flex flex-wrap w-[70%] h-full pt-[24vh] items-start justify-between bg-[#cec0ad]'>

          <div className='w-1/2 bg-[#cec0ad]'>
            <div className='bg-[#cec0ad]'>
              <h3 className='bg-[#cec0ad] text-sm text-gray-300 mb-0.5'>Task Title</h3>
              <input
              value={title}
              onChange={(e)=>{
                settitle(e.target.value)
                
              }}
              className='text-sm py-1 px-2 w-4/5 rounded outline-none bg-transparent border-[1px] border-gray-400 mb-4' type="text" placeholder='Make a UI Design' />
            </div>

            <div className='bg-[#cec0ad]'>
            <h3 className='bg-[#cec0ad] text-sm text-gray-300 mb-0.5'>Date</h3>
            <input
            value={date}
            onChange={(e)=>{
              setdate(e.target.value)
            }}
            className=' text-sm py-1 px-2 w-4/5 rounded outline-none bg-transparent border-[1px] border-gray-400 mb-4' type="date" />
            </div>

            <div className='bg-[#cec0ad]'>
            <h3 className='bg-[#cec0ad] text-sm text-gray-300 mb-0.5'>Assign to</h3>
            <input
            value={assignTo}
            onChange={(e)=>{
              setassignTo(e.target.value)
            }
          }
            className=' text-sm py-1 px-2 w-4/5 rounded outline-none bg-transparent border-[1px] border-gray-400 mb-4' type='text' placeholder="employee name" />
            </div>

            <div className='bg-[#cec0ad]'>
            <h3 className='bg-[#cec0ad] text-sm text-gray-300 mb-0.5'>Category</h3>
            <input
            value={category}
            onChange={(e)=>{
              setcategory(e.target.value)
            }}
            className='bg-[#cec0ad] text-sm py-1 px-2 w-4/5 rounded outline-none  border-[1px] border-gray-400 mb-4' type="text" placeholder="design, dev, etc." />
            </div>
          </div>

            

          <div className='bg-[#cec0ad] flex flex-col items-start w-2/5'>
            <h3 className='bg-[#cec0ad] text-sm text-gray-300 mb-0.5'>Description</h3>
            <textarea
            value={description}
            onChange={(e)=>{
              setdescription(e.target.value)
            }}
            className='bg-[#cec0ad] w-full h-44 text-sm px-4 py-2 rounded outline-none bg-transparent border-[1px] border-gray-400' name="" id="" cols="30" rows="10"></textarea>
            <button onClick={animateWavyLetters} className='bg-emerald-500 py-3 hover:bg-emerald-600 px-5 rounded text-sm mt-4 w-full'>Create Task</button>
          </div>

          

          
        
      </form>

      {/* <div className='flex flex-col gap-[20px] bg-[#ad9676] h-screen w-[30vw] overflow-hidden '>

        <div className='titleLine bg-transparent flex flex-row items-center gap-[0px] justify-center w-auto'>

          <img className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]" src="/src/assets/V.svg" alt="" />
          <img className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]" src="/src/assets/E.svg" alt="" />

          <img className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]" src="/src/assets/W.svg" alt="" />
          <img className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]" src="/src/assets/O.svg" alt="" />
          <img className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]" src="/src/assets/R.svg" alt="" />
          <img className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]" src="/src/assets/K.svg" alt="" />

          <img className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]" src="/src/assets/W.svg" alt="" />
          <img className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]" src="/src/assets/A.svg" alt="" />
        </div>

        <div className='titleLine bg-transparent flex flex-row items-center gap-[0px] justify-center w-auto'>

          <img className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]" src="/src/assets/W.svg" alt="" />
          <img className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]" src="/src/assets/O.svg" alt="" />
          <img className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]" src="/src/assets/R.svg" alt="" />
          <img className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]" src="/src/assets/K.svg" alt="" />

          <img className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]" src="/src/assets/W.svg" alt="" />
          <img className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]" src="/src/assets/A.svg" alt="" />
          <img className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]" src="/src/assets/V.svg" alt="" />
          <img className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]" src="/src/assets/E.svg" alt="" />

        </div>

        <div className='titleLine bg-transparent flex flex-row items-center gap-[0px] justify-center w-auto'>

          <img className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]" src="/src/assets/O.svg" alt="" />
          <img className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]" src="/src/assets/R.svg" alt="" />
          <img className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]" src="/src/assets/K.svg" alt="" />

          <img className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]" src="/src/assets/W.svg" alt="" />
          <img className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]" src="/src/assets/A.svg" alt="" />
          <img className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]" src="/src/assets/V.svg" alt="" />
          <img className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]" src="/src/assets/E.svg" alt="" />
          <img className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]" src="/src/assets/W.svg" alt="" />

        </div>

        <div className='titleLine bg-transparent flex flex-row items-center gap-[0px] justify-center w-auto'>

          <img className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]" src="/src/assets/R.svg" alt="" />
          <img className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]" src="/src/assets/K.svg" alt="" />

          <img className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]" src="/src/assets/W.svg" alt="" />
          <img className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]" src="/src/assets/A.svg" alt="" />
          <img className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]" src="/src/assets/V.svg" alt="" />
          <img className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]" src="/src/assets/E.svg" alt="" />

          <img className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]" src="/src/assets/W.svg" alt="" />
          <img className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]" src="/src/assets/O.svg" alt="" />
        </div>

        <div className='titleLine bg-transparent flex flex-row items-center gap-[0px] justify-center w-auto'>

          <img className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]" src="/src/assets/K.svg" alt="" />

          <img className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]" src="/src/assets/W.svg" alt="" />
          <img className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]" src="/src/assets/A.svg" alt="" />
          <img className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]" src="/src/assets/V.svg" alt="" />
          <img className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]" src="/src/assets/E.svg" alt="" />

          <img className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]" src="/src/assets/W.svg" alt="" />
          <img className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]" src="/src/assets/O.svg" alt="" />
          <img className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]" src="/src/assets/R.svg" alt="" />
        </div>

        <div className='titleLine bg-transparent flex flex-row items-center gap-[0px] justify-center w-auto'>


          <img className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]" src="/src/assets/W.svg" alt="" />
          <img className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]" src="/src/assets/A.svg" alt="" />
          <img className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]" src="/src/assets/V.svg" alt="" />
          <img className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]" src="/src/assets/E.svg" alt="" />

          <img className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]" src="/src/assets/W.svg" alt="" />
          <img className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]" src="/src/assets/O.svg" alt="" />
          <img className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]" src="/src/assets/R.svg" alt="" />
          <img className="titleLineLetter titleLineLetter2 bg-transparent w-auto h-[120px]" src="/src/assets/K.svg" alt="" />
        </div>

        <div className='titleLine bg-transparent flex flex-row items-center gap-[0px] justify-center w-auto'>

          <img className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]" src="/src/assets/A.svg" alt="" />
          <img className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]" src="/src/assets/V.svg" alt="" />
          <img className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]" src="/src/assets/E.svg" alt="" />

          <img className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]" src="/src/assets/W.svg" alt="" />
          <img className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]" src="/src/assets/O.svg" alt="" />
          <img className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]" src="/src/assets/R.svg" alt="" />
          <img className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]" src="/src/assets/K.svg" alt="" />

          <img className="titleLineLetter titleLineLetter1 bg-transparent w-auto h-[120px]" src="/src/assets/W.svg" alt="" />
        </div>

        

        
      </div> */}

    </div>

    
    

    


  </div>
  )
}
export default CreateTask