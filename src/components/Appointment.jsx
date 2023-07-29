import React, { useEffect, useState } from 'react'
// import { motion } from "framer-motion";
import Loader from "./Loader";
import { FaLessThan } from "react-icons/fa";
import { getAllAppointmentItems, saveAppointment } from "../utils/firebaseFunctions";
import { actionType } from "../context/reducer";
import { useStateValue } from "../context/StateProvider";
import { useLocation, useNavigate } from 'react-router-dom';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
// import axios from 'axios';

export default function Appointment() {
    // const nodemailer = require('nodemailer');
    const navigate = useNavigate();
    const [fullName, setFullName] = useState("");
    const [contactNo, setConatactNo] = useState("");
    const [email, setEmail] = useState("");
    const [address1, setAddress1] = useState("");
    const [address2, setAddress2] = useState("");
    const [pinCode, setPinCode] = useState("");
    const [fields, setFields] = useState(false);
    const [alertStatus, setAlertStatus] = useState("danger");
    const [msg, setMsg] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [{ appointmentItems }, dispatch] = useStateValue();

    const database = getFirestore();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const vendorId = searchParams.get('id');
    // const [vEmail, setvEmail] = useState('');
    const [vendorItem, setVendorItem] = useState(null);

    useEffect(() => {
        const fetchVendorData = async () => {
            try {
                const vendorRef = collection(database, 'plannerItems');
                const vendorQuery = query(vendorRef, where('id', '==', vendorId));
                const querySnapshot = await getDocs(vendorQuery);
                if (querySnapshot.empty) {
                    console.log('No matching documents.');
                    return;
                }
                const vdoc = querySnapshot.docs[0];
                const plannerItemsData = vdoc.data();
                setVendorItem(plannerItemsData);
            } catch (err) {
                console.log(err);
            }
        };
        fetchVendorData();
    }, [vendorId]);


    function generateRandomID() {
        const AP = "APP";
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const year = new Date().getFullYear().toString().substr(-2);
        const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
        const randomChar = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
        const randomNumber = Math.floor(1000 + Math.random() * 9000);
        return `${AP}${year}${month}${randomChar}${randomNumber}`;
    }

    const saveDetails = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        // Validate contactno
        if (!contactNo || contactNo.length !== 10 || contactNo.includes(" ")) {
            setFields(true);
            setMsg("Please enter a valid 10-digit WhatsApp number without spaces.");
            setAlertStatus("danger");
            setTimeout(() => {
                setFields(false);
                setIsLoading(false);
            }, 4000);
            return;
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            setFields(true);
            setMsg("Please enter a valid email address.");
            setAlertStatus("danger");
            setTimeout(() => {
                setFields(false);
                setIsLoading(false);
            }, 4000);
            return;
        }

        //Validate PinCode
        if (!pinCode || pinCode.length !== 6 || pinCode.includes(" ")) {
            setFields(true);
            setMsg("Please enter a valid pincode without spaces.");
            setAlertStatus("danger");
            setTimeout(() => {
                setFields(false);
                setIsLoading(false);
            }, 4000);
            return;
        }

        try {
            if (!fullName || !email || !contactNo || !address1 || !address2 || !pinCode) {
                setFields(true);
                setMsg(" Fields can't be empty");
                setAlertStatus("danger");
                setTimeout(() => {
                    setFields(false);
                    setIsLoading(false);
                }, 1000);
            } else {
                const Appid = generateRandomID();
                const dataApp = {
                    id: Appid,
                    fullName: fullName,
                    email: email,
                    contactNo: contactNo,
                    address1: address1,
                    address2: address2,
                    pinCode: pinCode,
                    vemail: vendorItem.email,
                    vContactNo: vendorItem.contactNo,
                    vName: vendorItem.firstName,
                    vRegister: vendorItem.register,
                    vCompany: vendorItem.company,
                    BookingDate: Date(),
                    isDone: false,
                };

                // const response = await axios.post('./php/SendEmail.php', dataApp);
                // const responseData = response.data;

                // if (response.status === 200 && responseData.success) {
                //     saveAppointment(dataApp, Appid);
                //     setIsLoading(false);
                //     setFields(true);
                //     setMsg("Your Appointment is Booked. Vendor Will Contact You Within 24hrs.");
                //     setAlertStatus("success");
                //     setTimeout(() => {
                //       setFields(false);
                //     }, 4000);
                //     clearData();
                // } else {
                //     throw new Error(responseData.message || 'Failed to send the email.');
                // }

                const response = await fetch('./php/SendEmail.php', {
                    method: 'POST',
                    body: JSON.stringify(dataApp),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const responseData = await response.json();
                console.log(responseData);
                if (response.ok && responseData.success) {
                    saveAppointment(dataApp, Appid);
                    setIsLoading(false);
                    setFields(true);
                    setMsg("Your Appointment is Booked. Vendor Will Contact You Within 24hrs.");
                    setAlertStatus("success");
                    setTimeout(() => {
                        setFields(false);
                    }, 4000);
                    clearData();
                } else {
                    throw new Error(responseData.message || 'Failed to send the email.');
                }
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
        setAddress1("");
        setAddress2("");
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

    // useEffect(() => {
    //     if (vEmail) {
    //         const fetchData = async () => {
    //             try {
    //                 const db = getFirestore();
    //                 const vendorQuery = query(collection(db, 'plannerItems'), where('email', '==', vEmail));
    //                 const querySnapshot = await getDocs(vendorQuery);
    //                 if (querySnapshot.empty) {
    //                     console.log('Vendor not found');
    //                     return;
    //                 }
    //                 const vendorData = querySnapshot.docs[0].data();
    //                 setVendor(vendorData);
    //             } catch (err) {
    //                 console.log(err);
    //             }
    //         };
    //         fetchData();
    //     }
    // }, [vEmail]);

    // console.log(vEmail);
    // console.log(vendor);

    const closeModal = () => {
        navigate(-1);

    };

    useEffect(() => {
        // Add a popstate event listener to handle navigation back
        const handlePopstate = () => {
            const updatedUrl = new URL(window.location.href);
            // Check if the vendor  or register is present in the updated URL and close the modal
            if (updatedUrl.searchParams.has("register")) {
                updatedUrl.searchParams.delete("register");
                updatedUrl.searchParams.delete("Id");
                window.history.pushState({ path: updatedUrl.href }, "", updatedUrl.href);
            }
        };

        window.addEventListener("popstate", handlePopstate);

        return () => {
            // Clean up the event listener when the component unmounts
            window.removeEventListener("popstate", handlePopstate);
        };
    }, [vendorItem]);


    return (
        <>
            <div className="container">
                <div className=" border border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center gap-4">
                    <h3 className='text-2xl font-semibold capitalize text-headingColor'>Book an Appointment</h3>
                    {fields && (
                        // <motion.div
                        //     initial={{ opacity: 0, visibility: "hidden" }}
                        //     animate={{ opacity: 1, visibility: "visible" }}
                        //     exit={{ opacity: 0, visibility: "hidden" }}
                        //     transition={{ duration: 0.3 }}
                        //     className="fixed bottom-0 left-0 w-full p-2 rounded-lg text-center text-lg font-semibold z-10"
                        // style={{
                        //     backgroundColor:
                        //         alertStatus === "danger" ? "rgba(255, 75, 75, 0.8)" : "rgba(64, 175, 95, 0.8)",
                        //     color: "#fff",
                        // }}
                        // >
                        //     {msg}
                        // </motion.div>
                        <>
                            <div
                                className="fixed inset-0 bg-black opacity-50 z-40"
                            ></div>
                            <div className="fixed inset-0 flex items-center justify-center z-50 text-center">
                                <div className="bg-white p-6 rounded-lg shadow-lg">
                                    <p className="font-semibold mb-4" style={{
                                        color: alertStatus === "danger" ? "rgba(255, 75, 75, 0.8)" : "rgba(64, 175, 95, 0.8)"
                                    }}>{msg}</p>
                                </div>
                            </div>
                        </>
                    )}
                    <div className="px-5 group flex justify-center items-center flex-col border-2 border-dotted border-gray-300 w-full h-full p-3 rounded-lg p">
                        <h3 className=' text-xl font-bold text-blue-700'>Vendor's Details</h3>
                        {vendorItem ? (
                            <form>
                                <div key={vendorItem.id} class="gap-8 row flex justify-center flex-wrap my-10">
                                    <div className="flex">
                                        <label className='text-textBlue mr-2'>Comapny Name: </label>
                                        <p className='text-base text-gray-700 capitalize text-center'>{vendorItem?.company}</p>
                                    </div>
                                    <div className="flex">
                                        <label className='text-textBlue mr-2'>Vendor Id: </label>
                                        <p className='text-base text-gray-700 capitalize text-center'>{vendorItem?.id}</p>
                                    </div>
                                    <div className="flex">
                                        <label className='text-textBlue mr-2'>Register As: </label>
                                        <p className='text-base text-gray-700 capitalize text-center'>{vendorItem?.register}</p>
                                    </div>
                                    <div className="flex">
                                        <label className='text-textBlue mr-2'>Address: </label>
                                        <p className='text-base text-gray-700 capitalize text-center'>{vendorItem?.address1}, {vendorItem.pinCode}</p>
                                    </div>
                                </div>
                            </form>
                        ) : (
                            <Loader />
                        )}

                    </div>

                    <div className="px-5 group flex justify-center items-center flex-col border-2 border-dotted border-gray-300 w-full h-full p-3 rounded-lg p">
                        <h3 className=' text-xl font-bold text-blue-700'>Fill Your Appointment Details</h3>
                        <form>
                            <div class="gap-8 row flex justify-center flex-wrap my-10">
                                <div className="flex flex-col">
                                    <label className='text-textBlue' for="fullname">Full Name</label>
                                    <input className='border rounded p-3 w-64 lg:w-96 hover:border-indigo-500' type="text" id="fullName" name="fullname" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="First Name" />
                                </div>
                                <div className="flex flex-col">
                                    <label className='text-textBlue' for="contactNo">WhatsApp No</label>
                                    <input className='border rounded p-3 w-64 lg:w-96 hover:border-indigo-500' type="tel" id="contactno" name="contactno" placeholder="WhatsApp No" maxLength={10} value={contactNo} onChange={(e) => setConatactNo(e.target.value)} />
                                </div>

                                <div className="flex flex-col">
                                    <label className='text-textBlue' for="email">Email Id</label>
                                    <input className='border rounded p-3 w-64 lg:w-96 hover:border-indigo-500' type="email" id="emailId" name="email" placeholder="Email Id" value={email} onChange={(e) => setEmail(e.target.value)} />
                                </div>

                                <div className="flex flex-col">
                                    <label className='text-textBlue' for="address1">Address Line1</label>
                                    <div className="relative">
                                        <input className='border rounded p-3 w-64 lg:w-96 hover:border-indigo-500' type="text" id="address1" name="address1" value={address1} onChange={(e) => setAddress1(e.target.value)} placeholder="Address Line 1" />
                                        <div className="absolute right-0 bottom-0 p-1 text-xs text-gray-500">{address1.length}/{30}</div>
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <label className='text-textBlue' for="address2">Address Line2</label>
                                    <input className='border rounded p-3 w-64 lg:w-96 hover:border-indigo-500' type="text" id="address2" name="address2" value={address2} onChange={(e) => setAddress2(e.target.value)} placeholder="Address Line2" />
                                </div>
                                <div className="flex flex-col">
                                    <label className='text-textBlue' for="pinCode">Pin Code</label>
                                    <input className='border rounded p-3 w-64 lg:w-96 hover:border-indigo-500' type="tel" id="pinCode" name="pinCode" maxLength={6} value={pinCode} onChange={(e) => setPinCode(e.target.value)} placeholder="Pin Code" />
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="flex">
                        <button
                            type="button"
                            className="px-3 py-2 md:px-4 md:py-2 mr-24 hidden md:flex items-center border-2 border-blue-500 text-blue-500 hover:bg-blue-700 hover:text-white rounded-lg text-sm md:text-base font-semibold"
                            onClick={closeModal}
                        >
                            <FaLessThan />Back
                        </button>
                        <button
                            type="button"
                            className="px-3 py-2 md:px-4 md:py-2 mr-24 border-none outline-none bg-blue-500 hover:bg-blue-700 rounded-lg text-sm md:text-base text-white font-semibold"
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
