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
import { getAllImagesItems, uploadImageItem } from "../utils/firebaseFunctions";

export default function UploadImage({ setOpenImage }) {
  const [title, setTitle] = useState(null);
  const [imageAsset, setImageAsset] = useState(null);
  const [fields, setFields] = useState(false);
  const [alertStatus, setAlertStatus] = useState("danger");
  const [msg, setMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [{ uploadImages }, dispatch] = useStateValue();
  const [{ user }] = useStateValue();

  const uploadImage = (e) => {
      setIsLoading(true);
      const imageFile = e.target.files[0];
      const storageRef = ref(storage, `Images/${Date.now()}-${imageFile.name}`);
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
  
  
  const saveDetails = (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
        if (!title) {
            setFields(true);
            setMsg(" Fields can't be empty");
            setAlertStatus("danger");
            setTimeout(() => {
                setFields(false);
                setIsLoading(false);
            }, 4000);
        } else {
            const dataimg = {
                id: `${Date.now()}`,
                imageURL: imageAsset,
                title: title,
                email: user.email,
            };
            const emailId= user.email;
            uploadImageItem(dataimg,emailId);
            setIsLoading(false);
            setFields(true);
            setMsg("Image Uploaded Successfully.");
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
  setImageAsset(null);
};

const fetchData = async () => {
  await getAllImagesItems().then((dataimg) => {
      dispatch({
          type: actionType.SET_IMAGE_DETAILS,
          uploadImages: dataimg,
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
              onClick={() => setOpenImage(false)}
            />
            <div className="container">
              <div className=" border border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center gap-4">
                <h3 className='text-2xl font-semibold capitalize text-headingColor'>Upload Image</h3>
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
                <div className="group flex justify-center items-center flex-col border-2 border-dotted border-gray-300 w-full h-full p-3 rounded-lg p">
                  {isLoading ? (
                    <Loader />
                  ) : (
                    <>
                      {!imageAsset ? (
                        <>
                          <label>
                            <div className="flex flex-col items-center justify-center h-full w-full cursor-pointer">
                              <div className="flex flex-col justify-center items-center cursor-pointer">
                                <p className="font-bold text-2xl">
                                  <BiCloudUpload />
                                </p>
                                <p className="text-lg"> click to upload</p>
                              </div>

                              <p className="mt-32 text-gray-400 text-center">
                                Image Ratio Should be 1:1 <br/>
                                Use High Quality Images less than 20MB
                              </p>
                            </div>
                            <input
                              type="file"
                              name="upload-image"
                              onChange={uploadImage}
                              className="w-0 h-0"
                            />
                          </label>
                        </>
                      ) : (
                        <>
                          <div className="relative h-full">
                            <img
                              src={imageAsset}
                              alt="uploaded image"
                              className="h-96 w-full object-cover"
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
                </div>
                <div class="border border-gray-300 rounded-lg p-4 w-full gap-4">
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
