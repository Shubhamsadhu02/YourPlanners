import React, { useState } from 'react'
import { RxCross2 } from 'react-icons/rx'
import Avatar from "../../img/avatar.png";
import { motion } from "framer-motion";
import { getFirestore, onSnapshot, doc, updateDoc, collection, deleteDoc, where, query } from 'firebase/firestore';
import { storage } from "../../firebase.config";
import { deleteObject, ref } from 'firebase/storage';

export default function VendorDetails({ setOpen, data }) {
    const [isVerified, setisVerified] = useState("");
    const [fields, setFields] = useState(false);
    const [alertStatus, setAlertStatus] = useState("danger");
    const [msg, setMsg] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const database = getFirestore();
    const [images, setImages] = useState([]);
    const [videoes, setVideoes] = useState([]);

    const saveDetails = () => {
        const docRef = doc(collection(database, 'plannerItems'), data.email);
        updateDoc(docRef, {
            isVerified: Boolean(isVerified),
        }).then(() => {
            setIsLoading(false);
            setFields(true);
            setMsg("Data Updated Successfully.");
            setAlertStatus("success");
            setTimeout(() => {
                setFields(false);
            }, 4000);
        }).catch((error) => {
            console.log(error);
            setFields(true);
            setMsg("Error while uploading : Try Again 🙇");
            setAlertStatus("danger");
            setTimeout(() => {
                setFields(false);
                setIsLoading(false);
            }, 4000);
        });
    };

    const handleProfileDelete = async (email, photo) => {
        if (window.confirm("Are you sure! You want to delete your account?")) {
            try {
                //delete planner profile pic
                if (photo != null) {
                    const deleteRef = ref(storage, photo);
                    await deleteObject(deleteRef);
                }


                // planner uploaded images
                // if (email) {
                //     const imagesRef = collection(database, 'uploadImages');
                //     const userImagesQuery = query(imagesRef, where('email', '==', email));
                //     onSnapshot(userImagesQuery, async (querySnapshot) => {
                //         const imagesData = [];
                //         querySnapshot.forEach((doc) => {
                //             if (doc.exists()) {
                //                 imagesData.push(doc.data());
                //             }
                //         });
                //         setImages(imagesData);
                //         for (const doc of querySnapshot.docs) {
                //             if (doc.exists()) {
                //                 const imageURL = doc.data().imageURL;
                //                 const deleteRef = ref(storage, imageURL);
                //                 await deleteObject(deleteRef);
                //                 await deleteDoc(doc.ref);
                //             }
                //         }
                //     });

                //     const videoesRef = collection(database, 'uploadVideoes');
                //     const userVideoesQuery = query(videoesRef, where('email', '==', email));
                //     onSnapshot(userVideoesQuery, async (querySnapshot) => {
                //         const videoesData = [];
                //         querySnapshot.forEach((doc) => {
                //             if (doc.exists()) {
                //                 videoesData.push(doc.data());
                //             }
                //             console.log(videoesData);
                //         });
                //         setVideoes(videoesData);
                //         for (const doc of querySnapshot.docs) {
                //             if (doc.exists()) {
                //                 await deleteDoc(doc.ref);
                //             }
                //         }
                //     });
                // }

                //delete planner profile docs
                await deleteDoc(doc(database, 'plannerItems', email));


            } catch (err) {
                console.log(err);
            }
        }
    };

    return (
        <>
            {
                data ? (
                    <>
                        <div className="fixed top-12 left-0 w-full h-full flex items-center justify-center bg-gray-200 bg-opacity-75">
                            <div className="bg-white p-8 rounded-lg w-full xl:w-1/2 h-[545px] md:h-auto overflow-y-scroll">
                                <RxCross2
                                    size={30}
                                    className="float-right mb-6 cursor-pointer"
                                    onClick={() => setOpen(false)}
                                />
                                {fields && (
                                    <motion.div
                                        initial={{ opacity: 0, visibility: "hidden" }}
                                        animate={{ opacity: 1, visibility: "visible" }}
                                        exit={{ opacity: 0, visibility: "hidden" }}
                                        transition={{ duration: 0.3 }}
                                        className="fixed bottom-0 left-0 w-full p-2 rounded-lg text-center text-lg font-semibold z-10"
                                        style={{
                                            backgroundColor:
                                                alertStatus === "danger" ? "rgba(255, 75, 75, 0.8)" : "rgba(64, 175, 95, 0.8)",
                                            color: "#fff",
                                        }}
                                    >
                                        {msg}
                                    </motion.div>
                                )}
                                <div className="text-center">
                                    <h3 className=' text-lg font-bold text-textBlue'>Vendor Details</h3>
                                </div>
                                <div className="grid grid-cols-12">
                                    <div className="col-span-12 md:col-span-6 flex flex-col items-center justify-center px-8">
                                        <div className="">
                                            <img src={data.imageURL ? data.imageURL : Avatar} alt="" className=' w-28 md:w-44 h-28 md:h-44 rounded-full object-cover' />
                                        </div>
                                        <div className="mt-2">
                                            <p className={`text-xs font-medium capitalize mb-2 ${data?.isVerified ? 'bg-green-500 p-1 px-2 rounded-full text-white' : 'bg-yellow-500 p-1 px-2 rounded-full text-gray-800'}`}>{data?.isVerified ? "Verified" : "Pending"}</p>
                                        </div>
                                        <div className="mt-2">
                                            <h3 className='font-bold mr-4 text-textColor'>Vendor Id: </h3>
                                            <img src={data?.govtIdProof} alt="" className=' w-36 md:w-64 h-28 md:h-44 border-2 border-black object-cover' />
                                        </div>
                                        <div className="flex flex-col mt-7">
                                            <label className='text-textBlue' for="register">Verified</label>
                                            <select
                                                value={isVerified}
                                                onChange={(e) => setisVerified(e.target.value)}
                                                className="outline-none text-base border-b-2 border-gray-200 cursor-pointer border rounded p-2 w-36 hover:border-indigo-500"
                                            >
                                                <option value="false" className="bg-white">
                                                    False
                                                </option>
                                                <option value="true" className="bg-white">
                                                    True
                                                </option>

                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-span-12 md:col-span-6 px-8 mt-4 md:mt-0">
                                        <div className="flex items-center mt-16">
                                            <h3 className='font-bold mr-4 text-textColor'>Vendor Id: </h3><p className=' capitalize'>{data.id}</p>
                                        </div>
                                        <div className="flex items-center mt-4">
                                            <h3 className='font-bold mr-4 text-textColor'>First Name: </h3><p className=' capitalize'>{data.firstName}</p>
                                        </div>
                                        <div className="flex items-center mt-4">
                                            <h3 className='font-bold mr-4 text-textColor'>Last Name: </h3><p className=' capitalize'>{data.lastName}</p>
                                        </div>
                                        <div className="flex items-center mt-4">
                                            <h3 className='font-bold mr-4 text-textColor'>Company Name: </h3><p className=' capitalize'>{data.company}</p>
                                        </div>
                                        <div className="flex items-center mt-4">
                                            <h3 className='font-bold mr-4 text-textColor'>Register As: </h3><p className=' capitalize'>{data.register}</p>
                                        </div>
                                        <div className="flex items-center mt-4">
                                            <h3 className='font-bold mr-4 text-textColor'>Email: </h3><p className=' capitalize'>{data.email}</p>
                                        </div>
                                        <div className="flex items-center mt-4">
                                            <h3 className='font-bold mr-4 text-textColor'>Contact No: </h3><p className=' capitalize'>{data.contactNo}</p>
                                        </div>
                                        <div className="flex items-center mt-4">
                                            <h3 className='font-bold mr-4 text-textColor'>Register Date: </h3><p className=' capitalize'>{data.date.toString().slice(0, 10)}</p>
                                        </div>
                                        <div className="flex items-center mt-4">
                                            <h3 className='font-bold mr-4 text-textColor'>Address 1: </h3><p className=' capitalize'>{data.address1}</p>
                                        </div>
                                        <div className="flex items-center mt-4">
                                            <h3 className='font-bold mr-4 text-textColor'>Address 2: </h3><p className=' capitalize'>{data.address2}</p>
                                        </div>
                                        <div className="flex items-center mt-4">
                                            <h3 className='font-bold mr-4 text-textColor'>District: </h3><p className=' capitalize'>{data.district}</p>
                                        </div>
                                        <div className="flex items-center mt-4">
                                            <h3 className='font-bold mr-4 text-textColor'>State: </h3><p className=' capitalize'>{data.state}</p>
                                        </div>
                                        <div className="flex items-center mt-4">
                                            <h3 className='font-bold mr-4 text-textColor'>Pin Code: </h3><p className=' capitalize'>{data.pinCode}</p>
                                        </div>

                                    </div>
                                </div>
                                <div className=" flex justify-center mt-8">
                                    <button
                                        type="button"
                                        className=" px-4 py-2 md:px-12 md:py-2 rounded-lg text-lg text-white font-semibold bg-blue-500 hover:bg-blue-700"
                                        onClick={saveDetails}
                                    >
                                        Approve
                                    </button>
                                    {data.isVerified === false &&
                                        <button
                                            type="button"
                                            className=" px-4 py-2 md:px-12 md:py-2 ml-4 rounded-lg text-lg font-semibold border-2 border-red-700 text-red-700 hover:bg-red-700 hover:text-white"
                                            onClick={() => handleProfileDelete(data.email, data.imageURL)}
                                        >
                                            Delete Account
                                        </button>
                                    }

                                </div>

                            </div>
                        </div>
                    </>
                ) : null
            }
        </>
    )
}
