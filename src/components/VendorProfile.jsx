import React, { useEffect,  useState } from "react";

import Avatar from "../img/avatar.png";
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";
import { useStateValue } from "../context/StateProvider";
import { actionType } from "../context/reducer";
import { RxCross2 } from 'react-icons/rx';
import { FaHeart } from 'react-icons/fa';
import {AiFillSchedule} from 'react-icons/ai'
import { collection, getFirestore, onSnapshot, query, where } from "firebase/firestore";

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

  const database = getFirestore();
  const [images, setImages] = useState([]);
  useEffect(() => {
    if (data) {
      const imagesRef = collection(database, 'uploadImages');
      const userImagesQuery = query(imagesRef, where('email', '==', data.email));
      onSnapshot(userImagesQuery, (querySnapshot) => {
        const imagesData = [];
        querySnapshot.forEach((doc) => {
          if (doc.exists()) {
            imagesData.push(doc.data());
          }
        });
        setImages(imagesData);
      });
    }
  }, [data, database]);

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
                <div className="flex flex-col justify-center items-center md:grid md:grid-cols-2 gap-2">
                  <div className="py-2 md:px-16 flex md:justify-end md:items-end">
                    <img src={data?.imageURL ? data?.imageURL : Avatar } alt="" className=' w-28 md:w-36 h-28 md:h-36' />
                  </div>
                  <div className="flex flex-col justify-center items-center md:items-start">
                    <h2 className='text-l w-72 md:w-96 font-bold md:text-2xl text-gray-700 capitalize break-words'>{data?.company}</h2>
                    <p className={`text-xs font-medium capitalize ${data?.isVerified ? 'bg-green-500 p-1 px-2 rounded-full text-white' : 'bg-yellow-500 p-1 px-2 rounded-full text-gray-800'}`}>{data?.isVerified ? "Verified" : "Pending"}</p>
                    <p className='text-sm md:text-base font-medium capitalize'>{data?.register}</p>
                    <p className='text-sm md:text-base font-medium capitalize'>{data?.area}</p>

                    <div className="hidden mt-8 w-full md:flex items-center">
                      <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-1 px-4 mr-4 rounded-full" onClick={() => setItems([...cartItems, data])}>Add to Favourite</button>
                      <Link to={"/appointment-form"}><button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-1 px-4 rounded-full">Book An Appointment</button></Link>
                    </div>
                    <div className="md:hidden mt-10 w-full flex justify-center items-center">
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
                      <div className="grid xl:grid-cols-5 md:grid-cols-3 gap-8">
                          {images.length === 0 ? (
                            <p>No images found</p>
                          ) : (
                            images.map((image) => (
                              <div key={image.id} className="">
                                <img src={image.imageURL} alt="" className=' w-64 h-48 md:h-36 rounded-md border-2 border-gray-500' />
                                <p className=" break-words w-60">{image.title}</p>
                              </div>
                            ))
                          )}
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
