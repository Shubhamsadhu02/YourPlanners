import React, { useState } from 'react';
import { RxCross2 } from 'react-icons/rx';
import { motion } from "framer-motion";
import { actionType } from "../context/reducer";
import { useStateValue } from "../context/StateProvider";
import { getAllVideoesItems, uploadVideoItem } from "../utils/firebaseFunctions";
import { useNavigate } from 'react-router-dom';

export default function UploadVideo({ setOpenVideo }) {
    const navigate = useNavigate();
    const [title, setTitle] = useState(null);
    const [url, setUrl] = useState(null);
    const [alertStatus, setAlertStatus] = useState("danger");
    const [msg, setMsg] = useState(null);
    const [fields, setFields] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [{ user }] = useStateValue();
    const [{ uploadVideoes }, dispatch] = useStateValue();

    const saveDetails = (event) => {
        event.preventDefault();
        setIsLoading(true);
        try {
            if (!title || !url) {
                setFields(true);
                setMsg(" Fields can't be empty");
                setAlertStatus("danger");
                setTimeout(() => {
                    setFields(false);
                    setIsLoading(false);
                }, 4000);
            } else {
                const datavideo = {
                    id: `${Date.now()}`,
                    videoURL: url,
                    title: title,
                    email: user.email,
                };
                const emailId = user.email;
                uploadVideoItem(datavideo, emailId);
                setIsLoading(false);
                setFields(true);
                setMsg("Video Link Uploaded Successfully.");
                setAlertStatus("success");
                setTimeout(() => {
                    setFields(false);
                }, 4000);
                clearData();
                setIsValid(false);
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

    const clearData = () => {
        setTitle("");
        setUrl("");
    };

    const fetchData = async () => {
        await getAllVideoesItems().then((datavideo) => {
            dispatch({
                type: actionType.SET_VIDEO_DETAILS,
                uploadVideoes: datavideo,
            });
        });
    };

    const [isValid, setIsValid] = useState(false);
    const [isTouched, setIsTouched] = useState(false);
    const regex = /^https?:\/\/(?:www\.)?youtu\.be\/(.+)$/;

    const handleInputChange = (event) => {
        const inputValue = event.target.value;
        setUrl(inputValue);
        setIsValid(regex.test(inputValue));
        setIsTouched(true);
    };

    return (
        <>
            <div className="">
                <div className="fixed w-full h-screen top-8  md:top-16 left-0 bg-[#00000030] z-40 flex items-center justify-center">
                    <div className="w-[90%] 800px:w-[60%] h-[80vh]  800px:h-[75vh] overflow-y-scroll bg-primary rounded-md shadow-sm relative p-4 pt-10 md:p-4 md:pt-16">
                        <RxCross2
                            size={30}
                            className="absolute right-3 top-3 z-50 cursor-pointer"
                            onClick={() => setOpenVideo(false)}
                        />
                        <div className="container">
                            <div className=" border border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center gap-4">
                                <h3 className='text-2xl font-semibold capitalize text-headingColor'>Upload Video Link</h3>
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
                                <div class="border border-gray-300 rounded-lg p-4 w-full gap-4">
                                    {/* <div className="mb-5">
                                        <input className='border rounded p-3 w-full hover:border-indigo-500' type="url" id="url" name="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Paste Your Youtube Copy Link only" />
                                    </div> */}
                                    <div>
                                        <input
                                            type="url"
                                            id="url"
                                            name="url"
                                            value={url}
                                            onChange={handleInputChange}
                                            className={'border rounded p-3 w-full hover:border-indigo-500 text-sm md:text-base'}
                                            placeholder="Paste Your Youtube Copy Link only"
                                        />
                                        <p className=' text-xs text-textColor mr-4'>Example: https://youtu.be/</p>
                                        {isTouched && !isValid && url && <p className="text-red-500">Invalid YouTube link!</p>}
                                        {isTouched && isValid && <p className="text-green-500">Valid YouTube link!</p>}
                                        
                                    </div>
                                    <div className="">
                                        <input className='border rounded p-3 w-full hover:border-indigo-500 mt-4' type="text" id="title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
                                    </div>
                                    <div className="text-center">
                                        <button
                                            type="button"
                                            className="px-2 py-1 md:px-4 md:py-2 mr-24 hidden md:inline-block border-none outline-none bg-blue-500 hover:bg-blue-700 rounded-lg text-sm md:text-base text-white font-semibold"
                                            onClick={() => {navigate("/profile"); setOpenVideo(false);}}
                                        >
                                            Back
                                        </button>
                                        <button
                                            type="button"
                                            className={`mt-4 w-full md:w-auto border-none outline-none hover:opacity-75 px-12 py-2 rounded-lg text-lg font-semibold text-white ${!url || !title
                                                ? 'bg-blue-200 cursor-not-allowed'
                                                : 'bg-blue-500 hover:bg-blue-700'
                                                }`}
                                            onClick={saveDetails}
                                            disabled={!url || !title}
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
