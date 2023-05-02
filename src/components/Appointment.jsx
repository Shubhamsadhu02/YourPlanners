import React, { useEffect, useState } from 'react'
import { motion } from "framer-motion";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Loader from "./Loader";

import { getAllAppointmentItems, saveAppointment } from "../utils/firebaseFunctions";
import { actionType } from "../context/reducer";
import { useStateValue } from "../context/StateProvider";
import { comment } from 'postcss';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { firestore } from '../firebase.config';
import { collection, doc, getDoc, getDocs, getFirestore, onSnapshot, query, where } from 'firebase/firestore';

export default function Appointment() {
    const navigate = useNavigate();
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
                const doc = querySnapshot.docs[0];
                // const vendorData = doc.data();
                // const email = vendorData.email;
                // console.log(email);
                // setvEmail(email);
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
                    id: generateRandomID(),
                    fullName: fullName,
                    email: email,
                    contactNo: contactNo,
                    address: address,
                    pinCode: pinCode,
                    vemail: vendorItem.email,
                    vContactNo: vendorItem.contactNo,
                    vName: vendorItem.firstName,
                    vRegister: vendorItem.register,
                    vCompany: vendorItem.company,
                    BookingDate: Date().toString().slice(0, 10),
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



    return (
        <>
            <div className="container h-screen">
                <div className=" border border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center gap-4">
                    <h3 className='text-2xl font-semibold capitalize text-headingColor'>Book an Appointment</h3>
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
                    <div className="px-5 group flex justify-center items-center flex-col border-2 border-dotted border-gray-300 w-full h-full p-3 cursor-pointer rounded-lg p">
                        <h3 className=' text-xl font-bold text-blue-700'>Vendor's Details</h3>
                        {vendorItem ? (
                            
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
                                        <p className='text-base text-gray-700 capitalize text-center'>{vendorItem?.address}, {vendorItem.pinCode}</p>
                                    </div>
                                </div>
                            
                        ) : (
                            <Loader />
                        )}

                    </div>

                    <div className="px-5 group flex justify-center items-center flex-col border-2 border-dotted border-gray-300 w-full h-full p-3 cursor-pointer rounded-lg p">
                        <h3 className=' text-xl font-bold text-blue-700'>Fill Your Appointment Details</h3>
                        <div class="gap-8 row flex justify-center flex-wrap my-10">
                            <div className="flex flex-col">
                                <label className='text-textBlue' for="fullname">Full Name</label>
                                <input className='border rounded p-3 w-64 lg:w-96 hover:border-indigo-500' type="text" id="fullName" name="fullname" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="First Name" />
                            </div>
                            <div className="flex flex-col">
                                <label className='text-textBlue' for="contactNo">WhatsApp No</label>
                                <input className='border rounded p-3 w-64 lg:w-96 hover:border-indigo-500' type="tel" id="contactno" name="contactno" placeholder="Contact No" maxLength={10} value={contactNo} onChange={(e) => setConatactNo(e.target.value)} />
                            </div>

                            <div className="flex flex-col">
                                <label className='text-textBlue' for="email">Email Id</label>
                                <input className='border rounded p-3 w-64 lg:w-96 hover:border-indigo-500' type="email" id="emailId" name="email" placeholder="Email Id" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>

                            <div className="flex flex-col">
                                <label className='text-textBlue' for="address">Address</label>
                                <input className='border rounded p-3 w-64 lg:w-96 hover:border-indigo-500' type="text" id="address" name="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address" />
                            </div>
                            <div className="flex flex-col">
                                <label className='text-textBlue' for="pinCode">Pin Code</label>
                                <input className='border rounded p-3 w-64 lg:w-96 hover:border-indigo-500' type="tel" id="pinCode" name="pinCode" maxLength={6} value={pinCode} onChange={(e) => setPinCode(e.target.value)} placeholder="Pin Code" />
                            </div>
                        </div>
                    </div>
                    <div className="">
                        <button
                            type="button"
                            className="px-2 py-1 md:px-4 md:py-2 mr-24 hidden md:inline-block border-none outline-none bg-blue-500 hover:bg-blue-700 rounded-lg text-sm md:text-base text-white font-semibold"
                            onClick={() => navigate(-1)}
                        >
                            Back
                        </button>
                        <button
                            type="button"
                            className={`ml-0 md:ml-auto w-full md:w-auto border-none outline-none px-12 py-2 rounded-lg text-lg text-white font-semibold ${!fullName || !email || !contactNo || !address || !pinCode
                                ? 'bg-blue-200 cursor-not-allowed'
                                : 'bg-blue-500 hover:bg-blue-700'
                                }`}
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
