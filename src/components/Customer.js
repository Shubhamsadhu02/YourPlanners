import React, { useEffect,  useState } from "react";

import Avatar from "../img/avatar.png";
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";
import { useStateValue } from "../context/StateProvider";
import { actionType } from "../context/reducer";

export default function Customer() {
    const [currentTab, setCurrentTab] = useState("appointment");
    const activeTabStyle = {
      backgroundColor: 'rgb(231 237 244)',
      color: '#0353A4',
      borderBottom: '4px solid #0353A4'
    }
    
    const inactiveTabStyle = {
      backgroundColor: '#f2f2f2',
      color: '#333',
    }
    const handleTabClick = (e) => {
      setCurrentTab(e.target.id)
    }
    return (
      <>
  <div className="grid grid-cols-2 gap-2">
                    <div className="py-2 md:px-16 flex justify-end items-end">
                      <img src={Avatar } alt="" className=' w-28 md:w-36 h-28 md:h-36' />
                    </div>
                    <div className=" flex flex-col justify-center">
                      <h2 className='text-xl font-bold md:text-2xl text-gray-700 capitalize'>Cutomer name</h2>                      
                    </div>
                  </div>
  
                  {/* tabs */}
                  <div className="px-0 md:px-12 mt-12">
                    <div className="tabs flex flex-column border-b-2 border-indigo-200">
                      <button type="submit" className="p-3" 
                      id={"appointment"} onClick={handleTabClick} style={currentTab === 'appointment' ? activeTabStyle : inactiveTabStyle}>Appointments</button>
                    </div>
                    <div className="content mt-4 p-4 border-2 border-b-0 rounded-t-[10px] shadow-inner inset-y-4 ">
                      {
                        currentTab === "appointment" && 
                        <div className="">
                          Appointments
                        </div>
                      }
                    </div>
                  </div>    </>
    )
}
