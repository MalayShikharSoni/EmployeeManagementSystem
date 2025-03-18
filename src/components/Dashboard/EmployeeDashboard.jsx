import React, { useContext, useEffect, useRef, useState } from 'react';
import Header from '../other/Header';
import TaskListNumbers from '../other/TaskListNumbers';
import TaskList from '../TaskList/TaskList';
import NameForm from '../other/NameForm';
import HeaderUser from '../../pages/HeaderUser';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { AuthContext } from '../../context/AuthProvider';

const EmployeeDashboard = ({ changeUser, data, user, setuserData, AcceptClickButton, setLoggedInUserData }) => {
  // console.log(newData)

  const firstWaveRef = useRef(null);
  const thirdWaveRef = useRef(null);

  const [userData, setUserData] = useContext(AuthContext);
  const CurrentUser = userData.loggedInUser;

  useGSAP(() => {

    if(!firstWaveRef.current || !thirdWaveRef.current){
      console.log("waveRef is null");
      return;
    }
    else{
      console.log("waveRef is not null");
    }

    gsap.fromTo(firstWaveRef.current, 
      {x: 0},

      {
        x: "-40vw",
        ease:"none",
        scrollTrigger: {
          trigger: ".employeeDashboard",
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      }
    );

    gsap.fromTo(thirdWaveRef.current, 
      {x: 0},

      {
        x: "42.5vw",
        ease:"none",
        scrollTrigger: {
          trigger: ".employeeDashboard",
          start: "top top",
          end: "bottom top",
          scrub: 1,
          markers: false,
        },
      }
    );


  })

  return (
    <div className='employeeDashboard p-10 bg-[#cec0ad] pt-[25vh]'>
      <HeaderUser ref={{firstWaveRef, thirdWaveRef}} changeUser={changeUser} data={data} user={user} />

      

      

      {/* <TaskListNumbers /> */}
      <TaskList setuserData={setuserData} data={data} AcceptClickButton={AcceptClickButton} setLoggedInUserData={setLoggedInUserData} />
    </div>
  );
};

export default EmployeeDashboard;
