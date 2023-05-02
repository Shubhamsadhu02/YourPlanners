import React, { useState, useEffect } from "react";
import { BiCalendarAlt, BiCalendarCheck, BiDotsVertical } from "react-icons/bi";
import { RiVideoUploadFill } from "react-icons/ri";
import { GrCloudUpload, GrDocumentUpload } from "react-icons/gr";
import { BsFillTelephoneFill } from "react-icons/bs";
import { IoIdCard, IoLocationSharp } from "react-icons/io5";
import { MdEmail } from "react-icons/md";
import { motion } from "framer-motion";
import Avatar from "../img/avatar.png";
import { useStateValue } from "../context/StateProvider";
import { and, collection, deleteDoc, doc, getFirestore, onSnapshot, or, query, where } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import UploadImage from "./UploadImage";
import UploadVideo from "./UploadVideo";
import { RxCross2 } from "react-icons/rx";
import { deleteObject, ref } from "firebase/storage";
import { storage } from "../firebase.config";
import { AiOutlineCloudUpload } from "react-icons/ai";

export default function Profile() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isdotMenu, setisdotMenu] = useState(false);
  const database = getFirestore();
  const [{ user }] = useStateValue();
  const [data, setData] = useState(null);
  const [openImage, setOpenImage] = useState(false);
  const [openVideo, setOpenVideo] = useState(false);
  const navigate = useNavigate();
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

  const [videoes, setVideoes] = useState([]);
  useEffect(() => {
    if (user) {
      const videoesRef = collection(database, 'uploadVideoes');
      const userVideoesQuery = query(videoesRef, where('email', '==', user.email));
      onSnapshot(userVideoesQuery, (querySnapshot) => {
        const videoesData = [];
        querySnapshot.forEach((doc) => {
          if (doc.exists()) {
            videoesData.push(doc.data());
          }
          console.log(videoesData);
        });
        setVideoes(videoesData);
      });
    }
  }, [user, database]);

  const [appointment, setAppointment] = useState([]);
  useEffect(() => {
    if (user) {
      const appRef = collection(database, 'appointmentItems');
      const vemailQuery = where('vemail', '==', user.email);
      const emailQuery = where('email', '==', user.email);
      const userAppQuery = query(appRef, or(vemailQuery, emailQuery));
      console.log(userAppQuery);
      onSnapshot(userAppQuery, (querySnapshot) => {
        const appData = [];
        querySnapshot.forEach((doc) => {
          if (doc.exists()) {
            appData.push(doc.data());
          }
          console.log(appData);
        });
        setAppointment(appData);
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

  const handleImageDelete = async (id, photo) => {
    if (window.confirm("Are You sure to delete this image?")) {
      try {
        setSelectedImage(null);
        const deleteRef = ref(storage, photo);
        await deleteObject(deleteRef);
        await deleteDoc(doc(database, "uploadImages", id));
        setData(data.filter((item) => item.id !== id));
      } catch (err) {
        console.log(err);
      }
    }
  };

  const Modal = ({ image, onClose }) => (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-500 bg-opacity-75">
      <div className=" relative bg-white p-8 rounded-lg">
        <RxCross2 size={30}
          className="absolute right-7 cursor-pointer"
          onClick={onClose} />
        <button className="mb-4 px-2 py-1 md:px-4 md:py-2 border-2 border-red-700 text-red-700 hover:bg-red-700 hover:text-white rounded-md"
          onClick={() => handleImageDelete(image.email + image.id, image.imageURL)}>Delete</button>

        <img src={image.imageURL} alt="" className='w-300 md:w-656 rounded-md border-2 border-gray-500' />
        <p className="w-300 md:w-656 mt-4 break-words">{image.title}</p>
      </div>
    </div>
  );

  const handleVideoDelete = async (id) => {
    if (window.confirm("Are You sure to delete this video?")) {
      try {
        setSelectedVideo(null);
        await deleteDoc(doc(database, "uploadVideoes", id));
        setData(data.filter((item) => item.id !== id));
      } catch (err) {
        console.log(err);
      }
    }
  };
  const VideoModal = ({ video, onClose }) => (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-500 bg-opacity-75">
      <div className=" relative bg-white p-8 rounded-lg">
        <RxCross2 size={30}
          className="absolute right-7 cursor-pointer"
          onClick={onClose} />
        <button className="mb-4 px-2 py-1 md:px-4 md:py-2 border-2 border-red-700 text-red-700 hover:bg-red-700 hover:text-white rounded-md"
          onClick={() => handleVideoDelete(video.email + video.id)}>Delete</button>

        <iframe
          className=" w-340 h-225 md:w-656 md:h-340"
          // src={`https://www.youtube.com/embed/${video.videoURL.split('v=')[1].split('&')[0]}?modestbranding=1&autoplay=1`}
          src={`https://www.youtube.com/embed/${video.videoURL.split('youtu.be/')[1].split('&')[0]}?modestbranding=1&autoplay=1`}
          title={video.title}
          allow="autoplay"

        />
        <p className="w-300 md:w-656 mt-4 break-words">{video.title}</p>
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
                <RxCross2
                  size={30}
                  className=" float-right mb-6 cursor-pointer"
                  onClick={() => navigate('/')}
                />
                <div className="flex flex-col justify-center items-center md:grid md:grid-cols-2 gap-2">
                  <div className="py-2 md:px-16 flex md:justify-end md:items-end">
                    <img src={data?.imageURL ? data?.imageURL : Avatar} alt="" className=' w-28 md:w-44 h-28 md:h-44 rounded-full object-cover' />
                  </div>
                  <div className="flex flex-col justify-center items-center md:items-start">
                    <h2 className='text-xl font-bold md:text-2xl text-gray-700 capitalize text-center md:text-left w-72 md:w-96 xl:w-auto break-words'>{data?.company || user?.displayName}</h2>
                    <p className={` text-xs font-medium capitalize mb-2 ${data?.isVerified ? 'bg-green-500 p-1 px-2 rounded-full text-white' : 'bg-yellow-500 p-1 px-2 rounded-full text-gray-800'}`}>{data?.isVerified !== undefined ? (data.isVerified ? "Verified" : "Pending") : ""}</p>
                    <p className='text-sm md:text-base font-medium capitalize'>{data?.register || "Customer"}</p>
                    {data ? (
                      <>
                        <div className="flex items-center justify-center">
                          <IoIdCard className="text-gray-700" /><p className='text-sm md:text-base font-medium capitalize ml-2 break-words text-center md:text-left'>{data?.id}</p>
                        </div>
                        <div className="flex items-center justify-center">
                          <IoLocationSharp className="text-gray-700" /><p className='text-sm md:text-base font-medium capitalize ml-2 text-center md:text-left'>{`${data?.address.substring(0, 26)}${data?.address.length > 26 ? "..." : ""}`},{data?.pinCode}</p>
                        </div>
                      </>
                    ) : null}
                    <div className="flex items-center">
                      <MdEmail className="text-gray-700" /><p className='text-sm md:text-base font-medium capitalize ml-2'>{data?.email || user?.email}</p>
                    </div>
                    {data ? (
                      <>
                        <div className="flex items-center">
                          <BsFillTelephoneFill className="text-gray-700" /><p className='text-sm md:text-base font-medium capitalize ml-2'> {data?.contactNo || user?.phoneNumber || "N/A"}</p>
                        </div>
                        <div className="mt-4">
                          <Link to={"/edit"} flag={false}><button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-1 px-4 rounded-full">Edit Details</button></Link>
                        </div>
                      </>
                    ) : null}
                  </div>
                </div>

                {/* tabs */}
                <div className="container">
                  <div className="px-0 md:px-12 mt-12">
                    <div className="tabs flex flex-column justify-between items-center border-b-2 border-indigo-200">
                      {data ? (
                        <div className="flex">
                          <button type="submit" className="p-2 md:p-3 text-sm md:text-base"
                            id={"images"} onClick={handleTabClick} style={currentTab === 'images' ? activeTabStyle : inactiveTabStyle}>Images</button>
                          <button type="submit" className="p-2 md:p-3 text-sm md:text-base"
                            id={"videoes"} onClick={handleTabClick} style={currentTab === 'videoes' ? activeTabStyle : inactiveTabStyle}>Videoes</button>
                          <button type="submit" className="p-2 md:p-3 text-sm md:text-base"
                            id={"appointment"} onClick={handleTabClick} style={currentTab === 'appointment' ? activeTabStyle : inactiveTabStyle}>Appointment</button>
                        </div>
                      ) : (
                        <div>
                          <button type="submit" className="p-3"
                            id={"appointment"} onClick={handleTabClick} style={currentTab === 'appointment' ? activeTabStyle : inactiveTabStyle}>Appointment</button>
                        </div>
                      )}

                      {data?.isVerified == true ? (
                        <div className="">
                          <div className="relative flex items-center">
                            <motion.div

                            >
                              <button
                                type="button"
                                className="px-2 py-1 md:px-4 md:py-2 z-50 hidden md:flex md:items-center border-none outline-none bg-blue-200 hover:bg-blue-700 rounded-lg text-sm md:text-base text-blue-700 hover:text-white font-semibold"
                                onClick={() => setisdotMenu(!isdotMenu)}
                              >
                                Upload<AiOutlineCloudUpload className="ml-1" />
                              </button>
                              {/* <GrCloudUpload className="hidden md:flex text-3xl text-textColor cursor-pointer" onClick={() => setisdotMenu(!isdotMenu)} /> */}
                              <BiDotsVertical className="flex md:hidden text-2xl text-textColor cursor-pointer" onClick={() => setisdotMenu(!isdotMenu)} />
                            </motion.div>
                            {isdotMenu && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.6 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.6 }}
                                className="w-52 bg-gray-50 z-50 shadow-xl rounded-lg flex flex-col absolute top-12 right-0"
                              >
                                <div className="">
                                  <p className="px-4 py-2 flex items-center gap-3 cursor-pointer hover:bg-slate-100 transition-all duration-100 ease-in-out text-textColor text-base"
                                    onClick={() => { setOpenImage(!openImage) }} >
                                    <GrDocumentUpload className="text-xl text-textColor" /> Upload Image
                                  </p>
                                  {
                                    openImage ? (
                                      <UploadImage setOpenImage={setOpenImage} />
                                    ) : null
                                  }
                                  <p className="px-4 py-2 flex items-center gap-3 cursor-pointer hover:bg-slate-100 transition-all duration-100 ease-in-out text-textColor text-base"
                                    onClick={() => { setOpenVideo(!openVideo) }} >
                                    <RiVideoUploadFill className="text-xl text-textColor" /> Upload Video
                                  </p>
                                  {
                                    openVideo ? (
                                      <UploadVideo setOpenVideo={setOpenVideo} />
                                    ) : null
                                  }
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
                        <div className="grid xl:grid-cols-7 md:grid-cols-4 gap-4">
                          {images.length === 0 ? (
                            <p>No images found</p>
                          ) : (
                            images.map((image) => (
                              <div key={image.id} className="">
                                <img src={image.imageURL} alt="" className=' w-64 h-64 md:w-40 md:h-40 rounded-md border-2 border-gray-200 cursor-pointer object-cover'
                                  onClick={() => setSelectedImage(image)} />
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
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 gap-x-10">
                          {videoes.length === 0 ? (
                            <p>No videoes found</p>
                          ) : (
                            videoes.map((video) => (
                              <div key={video.id} className="">
                                <img src={`https://img.youtube.com/vi/${video.videoURL.split('youtu.be/')[1].split('&')[0]}/mqdefault.jpg`} alt="" className=' w-64 h-150 rounded-md border-2 border-gray-500 cursor-pointer object-cover'
                                  onClick={() => setSelectedVideo(video)} />
                              </div>
                            ))
                          )}
                          {selectedVideo && (
                            <VideoModal
                              video={selectedVideo}
                              onClose={() => setSelectedVideo(null)}
                            />
                          )}
                        </div>
                      }
                      {
                        currentTab === "appointment" &&
                        <div className="grid xl:grid-cols-3 md:grid-cols-2 gap-4" >
                          {appointment.length === 0 ? (
                            <p>No Appointments found</p>
                          ) : (
                            user ? (
                              appointment.map((item) => {
                                if (user.email === item.vemail || user.email === item.email) {
                                  return (
                                    <div
                                      key={item.id}
                                      className="w-full h-[180px] min-w-[275px] md:w-300 md:min-w-[300px] bg-blue-100 rounded-lg py-2 px-4  my-8 hover:drop-shadow-lg flex flex-col items-center justify-evenly relative cursor-pointer"
                                    >

                                      <div className="w-full flex flex-col overflow-hidden">
                                        <p className=" text-textColor font-semibold text-base md:text-lg truncate w-56 capitalize" >
                                          {item.vemail === user.email ? item.fullName : (item.email === user.email ? item.vCompany : null)}
                                        </p>
                                        <div className="flex items-center gap-1">
                                          <MdEmail className="text-textColor" />
                                          <p className="mt-1 text-sm text-textColor capitalize">
                                            {item.vemail === user.email ? item.email : (item.email === user.email ? item.vemail : null)}
                                          </p>
                                        </div>
                                        <div className="flex items-center gap-1">
                                          {item.vemail === user.email ? (
                                            <>
                                              <IoLocationSharp className="text-textColor" />
                                              <p className="text-sm text-textColor truncate w-56 capitalize">
                                                {item.address}, {item.pinCode}
                                              </p>
                                            </>) : item.email === user.email ? (
                                              <>
                                                <IoIdCard className="text-textColor" />
                                                <p className="text-sm text-textColor truncate w-56 capitalize">
                                                  {item.vRegister}
                                                </p>
                                              </>
                                            ) : ""}
                                        </div>
                                        <div className="flex items-center gap-1">
                                          {item.vemail === user.email ? (
                                            <>
                                              <BsFillTelephoneFill className="text-textColor" />
                                              <p className="text-sm text-textColor truncate">
                                                {item.contactNo}
                                              </p>
                                            </>)
                                            : ""}
                                        </div>
                                        <div className="flex items-center gap-1">
                                          <BiCalendarCheck className="text-textColor" />
                                          <p className="text-sm text-textColor truncate">
                                            {item.BookingDate}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  )
                                }
                              }
                              )) : (null)
                          )}
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

