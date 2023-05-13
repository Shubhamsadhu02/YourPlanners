import React, { useState } from 'react'
import { RxCross2 } from 'react-icons/rx'
import Avatar from "../../img/avatar.png";
import { motion } from "framer-motion";
import { doc, updateDoc, collection, getFirestore } from 'firebase/firestore';

export default function VendorDetails({ setOpen, data }) {
    const [isVerified, setisVerified] = useState("");
    const [fields, setFields] = useState(false);
    const [alertStatus, setAlertStatus] = useState("danger");
    const [msg, setMsg] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const database = getFirestore();

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
    return (
        <>
            {
                data ? (
                    <>
                        <div className="fixed top-12 left-0 w-full h-full flex items-center justify-center bg-gray-200 bg-opacity-75">
                            <div className="bg-white p-8 rounded-lg">
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
                                    <div className="col-span-6 flex flex-col items-center justify-center px-8">
                                        <div className="">
                                            <img src={data.imageURL ? data.imageURL : Avatar} alt="" className=' w-28 md:w-44 h-28 md:h-44 rounded-full object-cover' />
                                        </div>
                                        <div className="mt-2">
                                            <p className={`text-xs font-medium capitalize mb-2 ${data?.isVerified ? 'bg-green-500 p-1 px-2 rounded-full text-white' : 'bg-yellow-500 p-1 px-2 rounded-full text-gray-800'}`}>{data?.isVerified ? "Verified" : "Pending"}</p>
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
                                    <div className="col-span-6 px-8">
                                        <div className="flex items-center mt-16">
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
                                            <h3 className='font-bold mr-4 text-textColor'>Address 1: </h3><p className=' capitalize'>{data.address1}</p>
                                        </div>
                                        <div className="flex items-center mt-4">
                                            <h3 className='font-bold mr-4 text-textColor'>Address 2: </h3><p className=' capitalize'>{data.address2}</p>
                                        </div>
                                        <div className="flex items-center mt-4">
                                            <h3 className='font-bold mr-4 text-textColor'>Pin Code: </h3><p className=' capitalize'>{data.pinCode}</p>
                                        </div>

                                    </div>
                                </div>
                                <div className=" flex justify-center mt-8">
                                    <button
                                        type="button"
                                        className=" px-12 py-2 rounded-lg text-lg text-white font-semibold bg-blue-500 hover:bg-blue-700"
                                        onClick={saveDetails}
                                    >
                                        Send
                                    </button>
                                </div>

                            </div>
                        </div>
                    </>
                ) : null
            }
        </>
    )
}
