import React, { useState, useEffect } from "react";
import { BiDotsVertical } from "react-icons/bi";
import { RiVideoUploadFill } from "react-icons/ri";
import { GrDocumentUpload } from "react-icons/gr";
import { BsFillTelephoneFill } from "react-icons/bs";
import { IoLocationSharp } from "react-icons/io5";
import { MdEmail } from "react-icons/md";
import { motion } from "framer-motion";
import Avatar from "../img/avatar.png";
import { useStateValue } from "../context/StateProvider";
import { collection, doc, getFirestore, onSnapshot, query, where } from "firebase/firestore";
import { Link } from "react-router-dom";
import UploadImage from "./UploadImage";
import Modal from 'react-modal';


export default function Profile() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isdotMenu, setisdotMenu] = useState(false);
  const database = getFirestore();
  const [{ user }] = useStateValue();
  const [data, setData] = useState(null);
  const [dataImg, setDataImg] = useState(null);
  const [openImage, setOpenImage] = useState(false);

  console.log(user);
  useEffect(() => {
    if (user) {
      const userRef = doc(database, `plannerItems/${user.email}`);
      onSnapshot(userRef, (doc) => {
        if (doc.exists()) {
          setData(doc.data());
        }
      });
    }
  }, [user, database]);

  const [images, setImages] = useState([]);
  useEffect(() => {
    if (user) {
      const imagesRef = collection(database, 'uploadImages');
      const userImagesQuery = query(imagesRef, where('email', '==', user.email));
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
  }, [user, database]);

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

  const Modal = ({ image, onClose }) => (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-500 bg-opacity-75">
      <div className="bg-white p-8 rounded-lg">
        <img src={image.imageURL} alt="" className=' w-656 rounded-md border-2 border-gray-500' />
        <p className="mt-4 break-words">{image.title}</p>
        <button className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-md float-right" onClick={onClose}>Close</button>
      </div>
    </div>
  );

  return (
    <>
      <div className="">
        {user ? (
          <div className="">
            <div key={data?.id} className="fixed w-full h-screen top-8  md:top-16 left-0 bg-[#00000030] z-40 flex items-center justify-center">
              <div className="w-[90%] 800px:w-[60%] h-[80vh]  800px:h-[75vh] overflow-y-scroll bg-primary rounded-md shadow-sm relative p-4 pt-10 md:p-4 md:pt-16">
                {/* <RxCross2
                  size={30}
                  className="absolute right-3 top-3 z-50 cursor-pointer"
                  onClick={() => setOpen(false)}
                /> */}
                <div className="flex flex-col justify-center items-center md:grid md:grid-cols-2 gap-2">
                  <div className="py-2 md:px-16 flex md:justify-end md:items-end">
                    <img src={data?.imageURL ? data?.imageURL : Avatar} alt="" className=' w-28 md:w-36 h-28 md:h-36' />
                  </div>
                  <div className="flex flex-col justify-center items-center md:items-start">
                    <h2 className='text-xl w-72 md:w-96 font-bold md:text-2xl text-gray-700 capitalize break-words text-center'>{data?.company || user?.displayName}</h2>
                    <p className={` text-xs font-medium capitalize ${data?.isVerified ? 'bg-green-500 p-1 px-2 rounded-full text-white' : 'bg-yellow-500 p-1 px-2 rounded-full text-gray-800'}`}>{data?.isVerified ? "Verified" : "Pending"}</p>
                    <p className='text-sm md:text-base font-medium capitalize'>{data?.register || "Customer"}</p>
                    <div className="flex items-center">
                      <IoLocationSharp className="text-gray-700" /><p className='text-sm md:text-base font-medium capitalize ml-2'>{data?.area || "N/A"}</p>
                    </div>
                    <div className="flex items-center">
                      <MdEmail className="text-gray-700" /><p className='text-sm md:text-base font-medium capitalize ml-2'>{data?.email || user?.email}</p>
                    </div>
                    <div className="flex items-center">
                      <BsFillTelephoneFill className="text-gray-700" /><p className='text-sm md:text-base font-medium capitalize ml-2'> {data?.contactNo || user?.phoneNumber || "N/A"}</p>
                    </div>
                    {data ? (
                      <div className="mt-4">
                        <Link to={"#"}><button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-1 px-4 rounded-full">Edit Details</button></Link>
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* tabs */}
                <div className="container">
                  <div className="px-0 md:px-12 mt-12">
                    <div className="tabs flex flex-column justify-between border-b-2 border-indigo-200">
                      {data ? (
                        <div>
                          <button type="submit" className="p-3"
                            id={"images"} onClick={handleTabClick} style={currentTab === 'images' ? activeTabStyle : inactiveTabStyle}>Images</button>
                          <button type="submit" className="p-3"
                            id={"videoes"} onClick={handleTabClick} style={currentTab === 'videoes' ? activeTabStyle : inactiveTabStyle}>Videoes</button>
                          <button type="submit" className="p-3"
                            id={"appointment"} onClick={handleTabClick} style={currentTab === 'appointment' ? activeTabStyle : inactiveTabStyle}>Appointment</button>
                        </div>
                      ) : (
                        <div>
                          <button type="submit" className="p-3"
                            id={"appointment"} onClick={handleTabClick} style={currentTab === 'appointment' ? activeTabStyle : inactiveTabStyle}>Appointment</button>
                        </div>
                      )}

                      {data ? (
                        <div className="">
                          <div className="relative flex items-center">
                            <motion.div
                              whileTap={{ scale: 0.6 }}
                            >
                              <BiDotsVertical className="text-3xl text-textColor" onClick={() => setisdotMenu(!isdotMenu)} />
                            </motion.div>
                            {isdotMenu && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.6 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.6 }}
                                className="w-52 bg-gray-50 shadow-xl rounded-lg flex flex-col absolute top-12 right-0"
                              >
                                <div className="">
                                  <p className="px-4 py-2 flex items-center gap-3 cursor-pointer hover:bg-slate-100 transition-all duration-100 ease-in-out text-textColor text-base"
                                    onClick={() => setOpenImage(!openImage)} >
                                    <GrDocumentUpload className="text-xl text-textColor" /> Upload Image
                                  </p>
                                  {
                                    openImage ? (
                                      <UploadImage setOpenImage={setOpenImage} />
                                    ) : null
                                  }
                                  <p className="px-4 py-2 flex items-center gap-3 cursor-pointer hover:bg-slate-100 transition-all duration-100 ease-in-out text-textColor text-base">
                                    <RiVideoUploadFill className="text-xl text-textColor" /> Upload Video
                                  </p>
                                </div>
                              </motion.div>
                            )}
                          </div>
                        </div>
                      ) : null}


                    </div>
                    <div className="content mt-4 p-4 border-2 border-b-0 rounded-t-[10px] shadow-inner inset-y-4 flex justify-center bg-white ">
                      {
                        currentTab === "images" &&
                        <div className="grid xl:grid-cols-5 md:grid-cols-3 gap-8">
                          {images.length === 0 ? (
                            <p>No images found</p>
                          ) : (
                            images.map((image) => (
                              <div key={image.id} className="">
                                <img src={image.imageURL} alt="" className=' w-64 h-48 md:h-36 rounded-md border-2 border-gray-500' 
                                onClick={() => setSelectedImage(image)}/>
                                <p className=" break-words w-60">{image.title}</p>
                              </div>
                            ))
                          )}
                          {selectedImage && (
                            <Modal
                              image={selectedImage}
                              onClose={() => setSelectedImage(null)}
                            />
                          )}
                        </div>
                      }
                      {
                        currentTab === "videoes" &&
                        <div className="" >
                          video
                        </div>
                      }
                      {
                        currentTab === "appointment" &&
                        <div className="" >
                          Appointment
                        </div>
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          alert("Please sign in to view your profile")
        )}


      </div>
    </>
  )
}

