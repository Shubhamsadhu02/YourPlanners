import React, { useState } from 'react';
import { BiCloudUpload } from 'react-icons/bi';
import { MdDelete } from 'react-icons/md';
import { RxCross2 } from 'react-icons/rx';
import { motion } from "framer-motion";
import Loader from './Loader';
import { categories } from "../utils/data";
import {
    deleteObject,
    getDownloadURL,
    ref,
    uploadBytesResumable,
} from "firebase/storage";
import { storage } from "../firebase.config";
import { actionType } from "../context/reducer";
import { useStateValue } from "../context/StateProvider";
import { getAllVideoesItems, uploadVideoItem } from "../utils/firebaseFunctions";

export default function UploadVideo({setOpenVideo}) {
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
            const emailId= user.email;
            uploadVideoItem(datavideo,emailId);
            setIsLoading(false);
            setFields(true);
            setMsg("Video Link Uploaded Successfully.");
            setAlertStatus("success");
            setTimeout(() => {
                setFields(false);
            }, 4000);
            clearData();
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
                <div class="border border-gray-300 rounded-lg p-4 w-full gap-4">
                    <div className="mb-5">
                      <input className='border rounded p-3 w-full hover:border-indigo-500' type="url" id="url" name="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Paste Your Youtube Link Here" />
                    </div>
                    <div className="">
                      <input className='border rounded p-3 w-full hover:border-indigo-500' type="text" id="title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
                    </div>
                    <div className="text-center">
                        <button
                            type="button"
                            className=" mt-4 w-full md:w-auto border-none outline-none bg-blue-500 hover:bg-blue-700 px-12 py-2 rounded-lg text-lg text-white font-semibold"
                            onClick={saveDetails}
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
