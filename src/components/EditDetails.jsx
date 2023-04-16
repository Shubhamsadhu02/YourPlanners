import React, { useState }  from 'react'
import { MdCloudUpload, MdDelete } from "react-icons/md";
import Loader from "./Loader";
import { motion } from "framer-motion";

import { categories } from "../utils/data";
import { actionType } from "../context/reducer";
import { useStateValue } from "../context/StateProvider";
import { storage } from "../firebase.config";
import {
    deleteObject,
    getDownloadURL,
    ref,
    uploadBytesResumable,
} from "firebase/storage";

export default function EditDetails() {
    const [imageAsset, setImageAsset] = useState(null);
    const [fields, setFields] = useState(false);
    const [alertStatus, setAlertStatus] = useState("danger");
    const [msg, setMsg] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

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
  return (
    <>
    <div className="container">
                <div className=" border border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center gap-4">
                    <h3 className='text-2xl font-semibold capitalize text-headingColor'>Update Your Planner Profile</h3>
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
                                <label className='text-textBlue' for="contactNo">WhatsApp No</label>
                                <input className='border rounded p-3 w-64 lg:w-96 hover:border-indigo-500' type="tel" id="contactno" name="contactno" placeholder="Contact No"  />
                            </div>

                            <div className="flex flex-col">
                                <label className='text-textBlue' for="company">Company Name</label>
                                <input className='border rounded p-3 w-64 lg:w-96 hover:border-indigo-500' type="text" id="company" name="company"  placeholder="Company Name"  />
                            </div>

                        </div>
                    </div>
                    <div className="">
                        <button
                            type="button"
                            className="ml-0 md:ml-auto w-full md:w-auto border-none outline-none bg-blue-500 hover:bg-blue-700 px-12 py-2 rounded-lg text-lg text-white font-semibold"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
    </>
  )
}
