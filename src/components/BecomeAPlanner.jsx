import React, { useState } from 'react'
import { motion } from "framer-motion";
import axios from 'axios';
import { MdCloudUpload, MdDelete } from "react-icons/md";
import Loader from "./Loader";

import { categories } from "../utils/data";
import {
    deleteObject,
    getDownloadURL,
    ref,
    uploadBytesResumable,
} from "firebase/storage";
import { storage } from "../firebase.config";
import { getAllPlannerItems, saveItem } from "../utils/firebaseFunctions";
import { actionType } from "../context/reducer";
import { useStateValue } from "../context/StateProvider";
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';

export default function BecomeAPlanner() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [contactNo, setConatactNo] = useState("");
    const [email, setEmail] = useState("");
    const [company, setCompany] = useState("");
    const [register, setRegister] = useState("");
    const [address1, setAddress1] = useState("");
    const [address2, setAddress2] = useState("");
    const [pinCode, setPinCode] = useState("");
    const [imageAsset, setImageAsset] = useState(null);
    const [fields, setFields] = useState(false);
    const [alertStatus, setAlertStatus] = useState("danger");
    const [msg, setMsg] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [{ plannerItems }, dispatch] = useStateValue();
    const navigate = useNavigate();

    const uploadImage = (e) => {
        setIsLoading(true);
        const imageFile = e.target.files[0];
        const storageRef = ref(storage, `plannerProfile/${Date.now()}-${imageFile.name}`);
        const uploadTask = uploadBytesResumable(storageRef, imageFile);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const uploadProgress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            },
            (error) => {
                console.log(error);
                setFields(true);
                setMsg("Error while uploading : Try AGain 🙇");
                setAlertStatus("danger");
                setTimeout(() => {
                    setFields(false);
                    setIsLoading(false);
                }, 4000);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImageAsset(downloadURL);
                    setIsLoading(false);
                    setFields(true);
                    setMsg("Image uploaded successfully 😊");
                    setAlertStatus("success");
                    setTimeout(() => {
                        setFields(false);
                    }, 4000);
                });
            }
        );
    };

    const deleteImage = () => {
        setIsLoading(true);
        const deleteRef = ref(storage, imageAsset);
        deleteObject(deleteRef).then(() => {
            setImageAsset(null);
            setIsLoading(false);
            setFields(true);
            setMsg("Image deleted successfully 😊");
            setAlertStatus("success");
            setTimeout(() => {
                setFields(false);
            }, 4000);
        });
    };

    function generateRandomID() {
        const YP = "YP";
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const year = new Date().getFullYear().toString().substr(-2);
        const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
        const randomChar = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
        const randomNumber = Math.floor(1000 + Math.random() * 9000);
        return `${YP}${year}${month}${randomChar}${randomNumber}`;
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
            if (!firstName || !lastName || !email || !contactNo || !company || !register || !address1 || !address2 || !pinCode) {
                setFields(true);
                setMsg(" Fields can't be empty");
                setAlertStatus("danger");
                setTimeout(() => {
                    setFields(false);
                    setIsLoading(false);
                }, 4000);
            } else {
                // Check if email already exists in the database
                const emailExists = await checkEmailExists(email);
                if (emailExists) {
                    setFields(true);
                    setMsg("The email already exists as a planner.");
                    setAlertStatus("danger");
                    setTimeout(() => {
                        setFields(false);
                        setIsLoading(false);
                    }, 4000);
                } else {
                    const data = {
                        id: generateRandomID(),
                        imageURL: imageAsset,
                        firstName: firstName,
                        lastName: lastName,
                        email: email,
                        contactNo: contactNo,
                        company: company,
                        register: register,
                        address1: address1,
                        address2: address2,
                        pinCode: pinCode,
                        isVerified: false,
                        date: Date(),
                    };

                     const response = await fetch('./SendEmail.php', {
                            method: 'POST',
                            body: JSON.stringify(dataApp),
                            headers: {
                            'Content-Type': 'application/json',
                            },
                        })

                        const responseData = await response.json();
                        console.log(responseData);
                        if (response.ok && responseData.success) {
                            const emailId = email;
                            saveItem(data, emailId);
                            setIsLoading(false);
                            setFields(true);
                            setMsg("Data Uploaded Successfully And It Is Pending For Verification.");
                            setAlertStatus("success");
                            setTimeout(() => {
                                setFields(false);
                            }, 6000);
                            clearData();
                        }
                        else{
                            throw new Error(responseData.message || 'Failed to send the email.');
                        }
                    // const response = await axios.post('/SendPlannerEmail.php', data);
                    // const responseData = response.data;

                    // if (response.status === 200 && responseData.success) {
                    //     const emailId = email;
                    //     saveItem(data, emailId);
                    //     setIsLoading(false);
                    //     setFields(true);
                    //     setMsg("Data Uploaded Successfully And It Is Pending For Verification.");
                    //     setAlertStatus("success");
                    //     setTimeout(() => {
                    //         setFields(false);
                    //     }, 6000);
                    //     clearData();
                    // }
                    // else{
                    //     throw new Error(responseData.message || 'Failed to send the email.');
                    // }
                }
            }
        } catch (error) {
            console.log(error);
            setFields(true);
            setMsg("Error while uploading : Try Again 🙇");
            setAlertStatus("danger");
            setTimeout(() => {
                setFields(false);
                setIsLoading(false);
            }, 4000);
        }

        fetchData();
    };

    const database = getFirestore();
    const plannerItemsCollection = collection(database,'plannerItems');

    async function checkEmailExists(email) {
        console.log(email);
        const emailQuery = query(plannerItemsCollection, where('email', '==', email));
        const querySnapshot = await getDocs(emailQuery);
        console.log(!querySnapshot.empty);
        return !querySnapshot.empty;
    }

    const clearData = () => {
        setFirstName("");
        setLastName("");
        setConatactNo("");
        setEmail("");
        setCompany("");
        setRegister("Select Category");
        setAddress1("");
        setAddress2("");
        setPinCode("");
        setImageAsset(null);
    };

    const fetchData = async () => {
        await getAllPlannerItems().then((data) => {
            dispatch({
                type: actionType.SET_PLANNER_DETAILS,
                plannerItems: data,
            });
        });
    };


    return (
        <>
            <div className="container">
                <div className=" border border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center gap-4">
                    <h3 className='text-2xl font-semibold capitalize text-headingColor'>Create Your Planner Profile</h3>
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
                    <div className="group flex justify-center items-center flex-col border-2 border-dotted border-gray-300 w-full h-full p-3 cursor-pointer rounded-lg p">
                        {isLoading ? (
                            <Loader />
                        ) : (
                            <>
                                {!imageAsset ? (
                                    <>
                                        <label className="w-32 h-32 flex flex-col items-center justify-center cursor-pointer border rounded-full">
                                            <div className="w-32 h-32 flex flex-col items-center justify-center gap-2 rounded-full p-5">
                                                <p className="text-gray-500 text-center hover:text-gray-700">
                                                    upload Profile Pic
                                                </p>
                                                <MdCloudUpload className="text-gray-500 text-3xl hover:text-gray-700" />
                                            </div>
                                            <input
                                                type="file"
                                                name="uploadimage"
                                                accept="image/*"
                                                onChange={uploadImage}
                                                className="w-0 h-0"
                                            />
                                        </label>
                                    </>
                                ) : (
                                    <>
                                        <div className="relative h-32 rounded-full">
                                            <img
                                                src={imageAsset}
                                                alt="uploaded image"
                                                className="w-32 h-32 object-cover rounded-full"
                                            />
                                            <button
                                                type="button"
                                                className="absolute bottom-0 right-1 p-3 rounded-full bg-red-500 text-xl cursor-pointer outline-none hover:shadow-md  duration-500 transition-all ease-in-out"
                                                onClick={deleteImage}
                                            >
                                                <MdDelete className="text-white" />
                                            </button>
                                        </div>
                                    </>
                                )}
                            </>
                        )}
                        <div class="gap-8 my-10 flex justify-around flex-wrap w-full">
                            <div className="flex flex-col">
                                <label className='text-textBlue' for="firstname">First Name</label>
                                <input className='border rounded p-3 w-64 lg:w-96 hover:border-indigo-500' type="text" id="firstName" name="firstname" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First Name" />
                            </div>
                            <div className=" flex flex-col">
                                <label className='text-textBlue' for="lastname">Last Name</label>
                                <input className='border rounded p-3 w-64 lg:w-96 hover:border-indigo-500' type="text" id="lastName" name="lastname" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                            </div>
                            <div className="flex flex-col">
                                <label className='text-textBlue' for="contactNo">WhatsApp No</label>
                                <input className='border rounded p-3 w-64 lg:w-96 hover:border-indigo-500' type="tel" id="contactno" name="contactno" placeholder="WhatsApp No" maxLength={10} value={contactNo} onChange={(e) => setConatactNo(e.target.value)} />
                            </div>

                            <div className="flex flex-col">
                                <label className='text-textBlue' for="email">Email Id</label>
                                <input className='border rounded p-3 w-64 lg:w-96 hover:border-indigo-500' type="email" id="emailId" name="email" placeholder="Email Id" value={email} onChange={(e) => setEmail(e.target.value)} pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" />
                            </div>

                            <div className="flex flex-col">
                                <label className='text-textBlue' for="company">Company Name</label>
                                <div className="relative">
                                    <input className='border rounded p-3 w-64 lg:w-96 hover:border-indigo-500' type="text" id="company" name="company" maxLength={35} value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company Name" />
                                    <div className="absolute right-0 bottom-0 p-1 text-xs text-gray-500">{company.length}/{35}</div>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <label className='text-textBlue' for="register">Register As</label>
                                <select
                                    value={register}
                                    onChange={(e) => setRegister(e.target.value)}
                                    className="outline-none text-base border-b-2 border-gray-200 cursor-pointer border rounded p-3 w-64 lg:w-96 hover:border-indigo-500"
                                >
                                    <option value="other" className="bg-white">
                                        Select Category
                                    </option>
                                    {categories &&
                                        categories.map((item) => (
                                            <option
                                                key={item.id}
                                                className="text-base border-0 outline-none capitalize bg-white text-headingColor"
                                                value={item.urlParamName}
                                            >
                                                {item.name}
                                            </option>
                                        ))}
                                </select>
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
                                <div className="relative">
                                    <input className='border rounded p-3 w-64 lg:w-96 hover:border-indigo-500' type="text" id="address2" name="address2" value={address2} onChange={(e) => setAddress2(e.target.value)} placeholder="Address Line2" />
                                </div>
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
                            className={`ml-0 md:ml-auto w-full md:w-auto border-none outline-none px-12 py-2 rounded-lg text-lg text-white font-semibold ${!firstName || !lastName || !email || !contactNo || !company || !register || !address1 || !address2 || !pinCode
                                ? 'bg-blue-200 cursor-not-allowed'
                                : 'bg-blue-500 hover:bg-blue-700'
                                }`}
                            onClick={saveDetails}
                            disabled={!firstName || !lastName || !email || !contactNo || !company || !register || !address1 || !address2 || !pinCode}
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
