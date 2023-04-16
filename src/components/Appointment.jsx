import React, { useState } from 'react'
import { motion } from "framer-motion";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Loader from "./Loader";

import { getAllAppointmentItems, saveAppointment } from "../utils/firebaseFunctions";
import { actionType } from "../context/reducer";
import { useStateValue } from "../context/StateProvider";
import { comment } from 'postcss';

export default function Appointment() {
    const [fullName, setFullName] = useState("");
    const [contactNo, setConatactNo] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [pinCode, setPinCode] = useState("");
    const [fields, setFields] = useState(false);
    const [alertStatus, setAlertStatus] = useState("danger");
    const [msg, setMsg] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [{ appointmentItems }, dispatch] = useStateValue();
    const [type, setType]=useState('password');
    const [icon, setIcon]=useState(faEyeSlash);

    const handleToggle=()=>{    
        if(type==='password'){
          setIcon(faEye);      
          setType('text');
        }
        else{
          setIcon(faEyeSlash);     
          setType('password');
        }
      }

    const saveDetails = () => {
        setIsLoading(true);
        try {
            if (!fullName || !email || !contactNo || !address || !pinCode) {
                setFields(true);
                setMsg(" fields can't be empty");
                setAlertStatus("danger");
                setTimeout(() => {
                    setFields(false);
                    setIsLoading(false);
                }, 4000);
            } else {
                const dataApp = {
                    id: `${Date.now()}`,
                    fullName: fullName,
                    email: email,
                    contactNo: contactNo,
                    address: address,
                    pinCode: pinCode,
                };
                saveAppointment(dataApp);
                setIsLoading(false);
                setFields(true);
                setMsg("Your Appointment is Booked. Vendor Will Contact You Within 24hrs.");
                setAlertStatus("success");
                setTimeout(() => {
                    setFields(false);
                }, 4000);
                clearData();
            }
        } catch (error) {
            console.log(error);
            setFields(true);
            setMsg("Error while uploading : Try AGain 🙇");
            setAlertStatus("danger");
            setTimeout(() => {
                setFields(false);
                setIsLoading(false);
            }, 4000);
        }

        fetchData();
    };

    const clearData = () => {
        setFullName("");
        setConatactNo("");
        setEmail("");
        setAddress("");
        setPinCode("");
    };

    const fetchData = async () => {
        await getAllAppointmentItems().then((dataApp) => {
            dispatch({
                type: actionType.SET_APPOINTMENT_DETAILS,
                appointmentItems: dataApp,
            });
        });
    };


    return (
        <>
            <div className="container">
                <div className=" border border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center gap-4">
                    <h3 className='text-2xl font-semibold capitalize text-headingColor'>Book an Appointment</h3>
                    {fields && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className={`w-full p-2 rounded-lg text-center text-lg font-semibold ${alertStatus === "danger"
                                ? "bg-red-400 text-red-800"
                                : "bg-emerald-400 text-emerald-800"
                                }`}
                        >
                            {msg}
                        </motion.p>
                    )}
                    <div className="px-5 group flex justify-center items-center flex-col border-2 border-dotted border-gray-300 w-full h-full p-3 cursor-pointer rounded-lg p">
                        
                        <div class="gap-8 row flex justify-center flex-wrap my-10">
                            <div className="flex flex-col">
                                <label className='text-textBlue' for="fullname">Full Name</label>
                                <input className='border rounded p-3 w-64 lg:w-96 hover:border-indigo-500' type="text" id="fullName" name="fullname" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="First Name"  />
                            </div>
                            <div className="flex flex-col">
                                <label className='text-textBlue' for="contactNo">WhatsApp No</label>
                                <input className='border rounded p-3 w-64 lg:w-96 hover:border-indigo-500' type="tel" id="contactno" name="contactno" placeholder="Contact No" value={contactNo} onChange={(e) => setConatactNo(e.target.value)}  />
                            </div>

                            <div className="flex flex-col">
                                <label className='text-textBlue' for="email">Email Id</label>
                                <input className='border rounded p-3 w-64 lg:w-96 hover:border-indigo-500' type="email" id="emailId" name="email" placeholder="Email Id" value={email} onChange={(e) => setEmail(e.target.value)}  />
                            </div>

                            <div className="flex flex-col">
                                <label className='text-textBlue' for="address">Address</label>
                                <input className='border rounded p-3 w-64 lg:w-96 hover:border-indigo-500' type="text" id="address" name="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address"  />
                            </div>
                            <div className="flex flex-col">
                                <label className='text-textBlue' for="pinCode">Pin Code</label>
                                <input className='border rounded p-3 w-64 lg:w-96 hover:border-indigo-500' type="number" id="pinCode" name="pinCode" value={pinCode} onChange={(e) => setPinCode(e.target.value)} placeholder="Pin Code"  />
                            </div>
                        </div>
                    </div>
                    <div className="">
                        <button
                            type="button"
                            className="ml-0 md:ml-auto w-full md:w-auto border-none outline-none bg-blue-500 hover:bg-blue-700 px-12 py-2 rounded-lg text-lg text-white font-semibold"
                            onClick={saveDetails}
                        >
                            Book Appointment
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
