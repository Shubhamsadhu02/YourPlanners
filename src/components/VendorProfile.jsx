import React, { useEffect,  useState } from "react";

import Avatar from "../img/avatar.png";
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";
import { useStateValue } from "../context/StateProvider";
import { actionType } from "../context/reducer";
import { RxCross2 } from 'react-icons/rx';
import { FaHeart } from 'react-icons/fa';
import {AiFillSchedule} from 'react-icons/ai'

export default function VendorProfile({ setOpen, data }) {
  const [items, setItems] = useState([]);
  const [{ cartItems }, dispatch] = useStateValue();

  const addtocart = () => {
    dispatch({
      type: actionType.SET_CARTITEMS,
      cartItems: items,
    });
    localStorage.setItem("cartItems", JSON.stringify(items));
  };

  useEffect(() => {
    addtocart();
  }, [items]);

  const [currentTab, setCurrentTab] = useState("images");
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
    <div className="">
      {
        data ? (
            <div key={data?.id} className="fixed w-full h-screen top-8  md:top-16 left-0 bg-[#00000030] z-40 flex items-center justify-center">
              <div className="w-[90%] 800px:w-[60%] h-[80vh]  800px:h-[75vh] overflow-y-scroll bg-primary rounded-md shadow-sm relative p-4 pt-10 md:p-4 md:pt-16">
                <RxCross2
                  size={30}
                  className="absolute right-3 top-3 z-50 cursor-pointer"
                  onClick={() => setOpen(false)}
                />
                <div className="grid grid-cols-2 gap-2">
                  <div className="py-2 md:px-16 flex justify-end items-end">
                    <img src={data?.imageURL ? data?.imageURL : Avatar } alt="" className=' w-28 md:w-36 h-28 md:h-36' />
                  </div>
                  <div className=" flex flex-col justify-center">
                    <h2 className='text-xl font-bold md:text-2xl text-gray-700 capitalize'>{data?.company}</h2>
                    <p className='text-sm md:text-base font-medium capitalize'>{data?.register}</p>
                    <p className='text-sm md:text-base font-medium capitalize'>{data?.area}</p>

                    <div className="hidden mt-8 w-full md:flex items-center">
                      <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-1 px-4 mr-4 rounded-full" onClick={() => setItems([...cartItems, data])}>Add to Favourite</button>
                      <Link to={"/appointment-form"}><button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-1 px-4 rounded-full">Book An Appointment</button></Link>
                    </div>
                    <div className="md:hidden mt-10 w-full flex items-center">
                      <motion.div
                        whileTap={{ scale: 0.75 }}
                        className="w-8 h-8 rounded-full bg-cartNumBg flex items-center justify-center cursor-pointer -mt-8 mr-4"
                        onClick={() => setItems([...cartItems, data])}
                      >
                        <FaHeart className="text-white" />
                      </motion.div>
                      
                      <motion.div
                        whileTap={{ scale: 0.75 }}
                        className="w-8 h-8 rounded-full bg-cartNumBg flex items-center justify-center cursor-pointer -mt-8"
                      >
                        <Link to={"/appointment-form"}><AiFillSchedule className="text-white" /></Link>
                      </motion.div>
                      
                    </div>
                  </div>
                </div>

                {/* tabs */}
                <div className="container">
                <div className="px-0 md:px-12 mt-12">
                  <div className="tabs flex flex-column border-b-2 border-indigo-200">
                    <button type="submit" className="p-3" 
                    id={"images"} onClick={handleTabClick} style={currentTab === 'images' ? activeTabStyle : inactiveTabStyle}>Images</button>
                    <button type="submit" className="p-3" 
                    id={"videoes"} onClick={handleTabClick} style={currentTab === 'videoes' ? activeTabStyle : inactiveTabStyle}>Videoes</button>
                  </div>
                  <div className="content mt-4 p-4 border-2 border-b-0 rounded-t-[10px] shadow-inner inset-y-4 ">
                    {
                      currentTab === "images" && 
                      <div className="">
                        Photo
                      </div>
                    }
                    {
                      currentTab === "videoes" && 
                      <div className="" >
                         video
                      </div>
                    }
                  </div>
                </div>
                </div>
              </div>
            </div>
          ) : null}
    </div>
    </>
  )
}
