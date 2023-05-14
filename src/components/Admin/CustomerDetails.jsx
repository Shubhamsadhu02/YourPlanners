import React, { useState } from 'react'
import { RxCross2 } from 'react-icons/rx'
import { motion } from "framer-motion";
import { doc, updateDoc, collection, getFirestore } from 'firebase/firestore';

export default function CustomerDetails({ setOpenCustomer, data }) {
    const [isDone, setisDone] = useState("");
    const [fields, setFields] = useState(false);
    const [alertStatus, setAlertStatus] = useState("danger");
    const [msg, setMsg] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const database = getFirestore();

    const saveDetails = () => {
        const docRef = doc(collection(database, 'appointmentItems'), data.id);
        updateDoc(docRef, {
            isDone: Boolean(isDone),
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
                            <div className="bg-white p-8 rounded-lg w-full xl:w-1/2 h-[545px] md:h-auto overflow-y-scroll">
                                <RxCross2
                                    size={30}
                                    className="float-right mb-6 cursor-pointer"
                                    onClick={() => setOpenCustomer(false)}
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
                                    <h3 className=' text-lg font-bold text-textBlue'>Appointment Details</h3>
                                </div>
                                <div className="grid grid-cols-12 mt-16">
                                    <div className=" col-span-12 md:col-span-6 px-8">
                                        <h3 className=' text-base font-bold text-textBlue'>Customer Details</h3>
                                        <div className="flex items-center mt-4">
                                            <h3 className='font-bold mr-4 text-textColor'>Appointment Id: </h3><p className=' capitalize'>{data.id}</p>
                                        </div>
                                        <div className="flex items-center mt-4">
                                            <h3 className='font-bold mr-4 text-textColor'>Full Name: </h3><p className=' capitalize'>{data.fullName}</p>
                                        </div>
                                        <div className="flex items-center mt-4">
                                            <h3 className='font-bold mr-4 text-textColor'>Contact No: </h3><p className=' capitalize'>{data.contactNo}</p>
                                        </div>
                                        <div className="flex items-center mt-4">
                                            <h3 className='font-bold mr-4 text-textColor'>Email: </h3><p className=' capitalize'>{data.email}</p>
                                        </div>
                                        <div className="flex items-center mt-4">
                                            <h3 className='font-bold mr-4 text-textColor'>Address: </h3><p className=' capitalize'>{data.address1},{data.pinCode}</p>
                                        </div>
                                        <div className="flex items-center mt-4">
                                            <h3 className='font-bold mr-4 text-textColor'>Booking Date: </h3><p className=' capitalize'>{data.BookingDate.toString().slice(0, 10)}</p>
                                        </div>
                                        <div className="flex flex-col mt-7">
                                            <label className='text-textBlue' for="register">Done Enquiry</label>
                                            <select
                                                value={isDone}
                                                onChange={(e) => setisDone(e.target.value)}
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
                                    <h3 className=' text-base font-bold text-textBlue'>Vendor Details</h3>
                                        <div className="flex items-center mt-4">
                                            <h3 className='font-bold mr-4 text-textColor'>Vendor Name: </h3><p className=' capitalize'>{data.vName}</p>
                                        </div>
                                        <div className="flex items-center mt-4">
                                            <h3 className='font-bold mr-4 text-textColor'>Company Name: </h3><p className=' capitalize'>{data.vCompany}</p>
                                        </div>
                                        <div className="flex items-center mt-4">
                                            <h3 className='font-bold mr-4 text-textColor'>Register As: </h3><p className=' capitalize'>{data.vRegister}</p>
                                        </div>
                                        <div className="flex items-center mt-4">
                                            <h3 className='font-bold mr-4 text-textColor'>Vendor Email: </h3><p className=' capitalize'>{data.vemail}</p>
                                        </div>
                                        <div className="flex items-center mt-4">
                                            <h3 className='font-bold mr-4 text-textColor'>Vendor Contact No: </h3><p className=' capitalize'>{data.vContactNo}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className=" flex justify-center mt-8">
                                    <button
                                        type="button"
                                        className=" px-12 py-2 rounded-lg text-lg text-white font-semibold bg-blue-500 hover:bg-blue-700"
                                        onClick={saveDetails}
                                    >
                                        Done
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

