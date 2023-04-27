import React, { useEffect,  useState } from "react";
import axios from "axios";
import Avatar from "../img/avatar.png";
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";
import { useStateValue } from "../context/StateProvider";
import { actionType } from "../context/reducer";
import { RxCross2 } from 'react-icons/rx';
import { FaHeart } from 'react-icons/fa';
import {AiFillSchedule} from 'react-icons/ai'
import { collection, getFirestore, onSnapshot, query, where } from "firebase/firestore";
import { IoLocationSharp } from "react-icons/io5";

export default function VendorProfile({ setOpen, data }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
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

  const [videoes, setVideoes] = useState([]);
  useEffect(() => {
    if (data) {
      const videoesRef = collection(database, 'uploadVideoes');
      const userVideoesQuery = query(videoesRef, where('email', '==', data.email));
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
  }, [data, database]);


  const [area, setArea] = useState("");
  const pincode = data.pinCode; 
  useEffect(() => {
    fetchArea();
  }, []);
 
  const fetchAreaFromPincode = async (pinCode) =>{
    const url = `https://api.postalpincode.in/pincode/${pinCode}`;
    return axios.get(url)
      .then(response => {
        const data = response.data[0];
        if (data.Status === "Success") {
          const area = data.PostOffice[0].District;
          return area;
        } else {
          return "Invalid pincode";
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const fetchArea = async () => {
    const area = await fetchAreaFromPincode(pincode);
    setArea(area);
  };

  const Modal = ({ image, onClose }) => (
    <div className="fixed top-10 left-0 w-full h-full flex items-center justify-center bg-gray-500 bg-opacity-75">
      <div className="bg-white p-8 rounded-lg w-300 md:w-656 h-auto">
        <p>
        <RxCross2 size={30}
          className="float-right mb-6 cursor-pointer"
          onClick={onClose} />
          </p>
        <img src={image.imageURL} alt="" className=' w-300 md:w-656 md:h-510 rounded-md border-2 border-gray-500 bg-cover' />
        <p className="w-300 md:w-656 mt-4 break-words">{image.title}</p>
      </div>
    </div>
  );

  const VideoModal = ({ video, onClose }) => (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-500 bg-opacity-75">
      <div className="bg-white p-8 rounded-lg">
        <p>
        <RxCross2 size={30}
          className=" float-right mb-6 cursor-pointer"
          onClick={onClose} />
        </p>
        
        <iframe
          className=" w-340 h-225 md:w-656 md:h-340"
          src={`https://www.youtube.com/embed/${video.videoURL.split('v=')[1].split('&')[0]}?modestbranding=1&autoplay=1`}
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
                    <img src={data?.imageURL ? data?.imageURL : Avatar } alt="" className=' w-28 md:w-36 h-28 md:h-36 rounded-full object-cover' />
                  </div>
                  <div className="flex flex-col justify-center items-center md:items-start">
                    <h2 className='text-l w-72 md:w-96 font-bold md:text-2xl text-gray-700 capitalize break-words text-center md:text-left'>{data?.company}</h2>
                    <p className={`text-xs font-medium capitalize ${data?.isVerified ? 'bg-green-500 p-1 px-2 rounded-full text-white' : 'bg-yellow-500 p-1 px-2 rounded-full text-gray-800'}`}>{data?.isVerified ? "Verified" : "Pending"}</p>
                    <p className='text-sm md:text-base font-medium capitalize'>{data?.register}</p>
                    <div className=" flex items-center justify-center">
                    <IoLocationSharp className="text-gray-700" />
                    <p className='text-sm md:text-base font-medium capitalize break-words'>{data.address}, {area}</p>
                    </div>

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
                  <div className="tabs flex flex-column items-center border-b-2 border-indigo-200">
                    <button type="submit" className="p-2 md:p-3 text-sm md:text-base" 
                    id={"images"} onClick={handleTabClick} style={currentTab === 'images' ? activeTabStyle : inactiveTabStyle}>Images</button>
                    <button type="submit" className="p-2 md:p-3 text-sm md:text-base" 
                    id={"videoes"} onClick={handleTabClick} style={currentTab === 'videoes' ? activeTabStyle : inactiveTabStyle}>Videoes</button>
                  </div>
                  <div className="content mt-4 p-4 border-2 border-b-0 rounded-t-[10px] shadow-inner inset-y-4 flex justify-center bg-white">
                    {
                      currentTab === "images" && 
                      <div className="grid xl:grid-cols-6 md:grid-cols-4 gap-4">
                          {images.length === 0 ? (
                            <p>No images found</p>
                          ) : (
                            images.map((image) => (
                              <div key={image.id} className="">
                                <img src={image.imageURL} alt="" className=' w-64 h-64 md:w-40 md:h-40 rounded-md border-2 border-gray-500 cursor-pointer object-cover' 
                                onClick={() => setSelectedImage(image)}/>
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
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 gap-x-10" >
                        {videoes.length === 0 ? (
                            <p>No videoes found</p>
                          ) : (
                            videoes.map((video) => (
                              <div key={video.id} className="">
                                <img src={`https://img.youtube.com/vi/${video.videoURL.split('v=')[1].split('&')[0]}/mqdefault.jpg`} alt="" className=' w-64 h-150 rounded-md border-2 border-gray-500 cursor-pointer object-cover'
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
