import React, { useEffect, useState } from 'react'
import { MdCloudUpload, MdDelete } from "react-icons/md";
import Loader from "./Loader";
// import { motion } from "framer-motion";
import { FaLessThan } from "react-icons/fa";
import { useStateValue } from "../context/StateProvider";
import { storage } from "../firebase.config";
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { getFirestore, onSnapshot, doc, updateDoc, collection, deleteDoc, where, query, setDoc, getDoc, writeBatch } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export default function EditDetails() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [contactNo, setConatactNo] = useState("");
    const [company, setCompany] = useState("");
    const [address1, setAddress1] = useState("");
    const [address2, setAddress2] = useState("");
    const [pinCode, setPinCode] = useState("");
    const [imageAsset, setImageAsset] = useState(null);
    const [fields, setFields] = useState(false);
    const [state, setState] = useState("");
    const [district, setDistrict] = useState("");
    const [title, setTitle] = useState(null);
    const [id, setId] = useState(null);
    const [images, setImages] = useState([]);
    const [videoes, setVideoes] = useState([]);
    const [alertStatus, setAlertStatus] = useState("danger");
    const [msg, setMsg] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState(null);
    const database = getFirestore();
    const [{ user }] = useStateValue();
    const navigate = useNavigate();

    console.log(user);
    useEffect(() => {
        if (user) {
            const userRef = doc(database, `plannerItems/${user.email}`);
            onSnapshot(userRef, (doc) => {
                if (doc.exists()) {
                    setData(doc.data());
                }
            });
        }
    }, [user, database]);

    useEffect(() => {
        setFirstName(data?.firstName || '');
        setLastName(data?.lastName || '');
        setImageAsset(data?.imageURL || '');
        setConatactNo(data?.contactNo || '');
        setCompany(data?.company || '');
        setAddress1(data?.address1 || '');
        setAddress2(data?.address2 || '');
        setPinCode(data?.pinCode || '');
        setDistrict(data?.district || '');
        setState(data?.state || '');
    }, [data]);


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
            // setAlertStatus("success");
            setTimeout(() => {
                setFields(false);
            }, 4000);
        });
    };

    const saveDetails = () => {
        const docRef = doc(collection(database, 'plannerItems'), data?.email);
        updateDoc(docRef, {
            imageURL: imageAsset,
            contactNo,
            company,
            address1,
            address2,
            pinCode,
            district,
            state,
        }).then(() => {
            setIsLoading(false);
            setFields(true);
            setMsg("Data Updated Successfully.");
            // setAlertStatus("success");
            setTimeout(() => {
                setFields(false);
            }, 4000);
            navigate("/profile", { replace: true });
        }).catch((error) => {
            console.log(error);
            setFields(true);
            setMsg("Error while uploading : Try Again 🙇");
            // setAlertStatus("danger");
            setTimeout(() => {
                setFields(false);
                setIsLoading(false);
            }, 4000);
        });
    };

    const handleProfileDelete = async (email, photo) => {
        if (window.confirm("Are you sure! You want to delete your account?")) {
            try {
                setTimeout(() => {
                    navigate("/", { replace: true });
                }, 5000);
                //delete planner profile pic
                if (photo != null) {
                    const deleteRef = ref(storage, photo);
                    await deleteObject(deleteRef);
                }
                //planner uploaded images
                if (user) {
                    const imagesRef = collection(database, 'uploadImages');
                    const userImagesQuery = query(imagesRef, where('email', '==', user.email));
                    onSnapshot(userImagesQuery, async (querySnapshot) => {
                        const imagesData = [];
                        querySnapshot.forEach((doc) => {
                            if (doc.exists()) {
                                imagesData.push(doc.data());
                            }
                        });
                        setImages(imagesData);
                        for (const doc of querySnapshot.docs) {
                            if (doc.exists()) {
                                const imageURL = doc.data().imageURL;
                                const deleteRef = ref(storage, imageURL);
                                await deleteObject(deleteRef);
                                await deleteDoc(doc.ref);
                            }
                        }
                    });

                    const videoesRef = collection(database, 'uploadVideoes');
                    const userVideoesQuery = query(videoesRef, where('email', '==', user.email));
                    onSnapshot(userVideoesQuery, async (querySnapshot) => {
                        const videoesData = [];
                        querySnapshot.forEach((doc) => {
                            if (doc.exists()) {
                                videoesData.push(doc.data());
                            }
                            console.log(videoesData);
                        });
                        setVideoes(videoesData);
                        for (const doc of querySnapshot.docs) {
                            if (doc.exists()) {
                                await deleteDoc(doc.ref);
                            }
                        }
                    });
                }

                //delete planner profile dcocs
                await deleteDoc(doc(database, 'plannerItems', email));
                setData(data.filter((item) => item.email !== email));

            } catch (err) {
                console.log(err);
            }
        }
    };

    return (
        <>
            <div className="">

                <div className="container md:h-screen">
                    <div key={data?.id} className=" border border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center gap-4">
                        <h3 className='text-2xl font-semibold capitalize text-headingColor'>Update Your Planner Profile</h3>
                        {fields && (
                            // <motion.div
                            //     initial={{ opacity: 0, visibility: "hidden" }}
                            //     animate={{ opacity: 1, visibility: "visible" }}
                            //     exit={{ opacity: 0, visibility: "hidden" }}
                            //     transition={{ duration: 0.3 }}
                            //     className="fixed bottom-0 left-0 w-full p-2 rounded-lg text-center text-lg font-semibold z-10"
                            //     style={{
                            //         backgroundColor:
                            //             alertStatus === "danger" ? "rgba(255, 75, 75, 0.8)" : "rgba(64, 175, 95, 0.8)",
                            //         color: "#fff",
                            //     }}
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
                        <div className="group flex justify-center items-center flex-col border-2 border-dotted border-gray-300 w-full h-full p-3 cursor-pointer rounded-lg p">
                            {isLoading ? (
                                <Loader />
                            ) : (
                                <>
                                    {imageAsset ? (
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
                                    ) : (
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
                                    )}
                                </>
                            )}
                            <div class="gap-8 my-10 flex justify-around flex-wrap w-full">
                                <div className="flex flex-col">
                                    <label className='text-textBlue' for="firstname">First Name</label>
                                    <input className='border rounded p-3 w-64 lg:w-96 hover:border-indigo-500' type="text" id="firstName" name="firstname" value={firstName} onChange={(e) => setFirstName(e.target.value)}  />
                                </div>
                                <div className=" flex flex-col">
                                    <label className='text-textBlue' for="lastname">Last Name</label>
                                    <input className='border rounded p-3 w-64 lg:w-96 hover:border-indigo-500' type="text" id="lastName" name="lastname" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                                </div>
                                <div className="flex flex-col">
                                    <label className='text-textBlue' for="contactNo">WhatsApp No</label>
                                    <input className='border rounded p-3 w-64 lg:w-96 hover:border-indigo-500' type="tel" id="contactno" name="contactno" maxLength={10} value={contactNo} onChange={(e) => setConatactNo(e.target.value)} />
                                </div>

                                <div className="flex flex-col">
                                    <label className='text-textBlue' for="email">Email Id</label>
                                    <input className='border rounded p-3 w-64 lg:w-96 hover:border-indigo-500' type="email" id="emailId" name="email" value={data?.email} title="This field cannot be edited." disabled />
                                </div>

                                <div className="flex flex-col">
                                    <label className='text-textBlue' for="company">Company Name</label>
                                    <input className='border rounded p-3 w-64 lg:w-96 hover:border-indigo-500' type="text" id="company" name="company" value={company} onChange={(e) => setCompany(e.target.value)} />
                                </div>

                                <div className="flex flex-col">
                                    <label className='text-textBlue' for="address">Address Line1</label>
                                    <input className='border rounded p-3 w-64 lg:w-96 hover:border-indigo-500' type="text" id="address" name="address" value={address1} onChange={(e) => setAddress1(e.target.value)} />
                                </div>
                                <div className="flex flex-col">
                                    <label className='text-textBlue' for="address">Address Line2</label>
                                    <input className='border rounded p-3 w-64 lg:w-96 hover:border-indigo-500' type="text" id="address" name="address" value={address2} onChange={(e) => setAddress2(e.target.value)} />
                                </div>
                                <div className="flex flex-col">
                                    <label className='text-textBlue' for="state">State</label>
                                    <input className='border rounded p-3 w-64 lg:w-96 hover:border-indigo-500' type="text" id="state" name="state" value={state} onChange={(e) => setState(e.target.value)} placeholder="State" />
                                </div>
                                <div className="flex flex-col">
                                    <label className='text-textBlue' for="district">District</label>
                                    <input className='border rounded p-3 w-64 lg:w-96 hover:border-indigo-500' type="text" id="district" name="district" value={district} onChange={(e) => setDistrict(e.target.value)} placeholder="District" />
                                </div>
                                <div className="flex flex-col">
                                    <label className='text-textBlue' for="pinCode">Pin Code</label>
                                    <input className='border rounded p-3 w-64 lg:w-96 hover:border-indigo-500' type="number" id="pinCode" name="pinCode" value={pinCode} onChange={(e) => setPinCode(e.target.value)} />
                                </div>
                            </div>
                        </div>
                        <div className="w-full flex justify-between xl:justify-around">
                            <button
                                type="button"
                                className="px-2 py-1 md:px-4 md:py-2 border-none flex items-center outline-none bg-blue-500 hover:bg-blue-700 rounded-lg text-sm md:text-base text-white font-semibold"
                                onClick={() => navigate(-1)}
                            >
                                <FaLessThan />Back
                            </button>
                            <button
                                type="button"
                                className="px-2 py-1 md:px-4 md:py-2 border-2 border-blue-500 text-blue-500 hover:bg-blue-700 rounded-lg text-sm md:text-base hover:text-white font-semibold"
                                onClick={saveDetails}
                            >
                                Save
                            </button>
                            <button className="px-2 py-1 md:px-4 md:py-2 border-2 border-red-700 text-red-700 hover:bg-red-700 hover:text-white text-sm md:text-base rounded-lg font-semibold"
                                onClick={() => handleProfileDelete(data?.email, data?.imageURL)}
                            >
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}
