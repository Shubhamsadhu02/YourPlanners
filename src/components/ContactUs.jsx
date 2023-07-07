import React, { useState } from 'react'
import { motion } from "framer-motion";

import { getAllContactUsItems, uploadContactUsItem } from "../utils/firebaseFunctions";
import { actionType } from "../context/reducer";
import { useStateValue } from "../context/StateProvider";
import { useNavigate } from 'react-router-dom';

export default function ContactUs() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [contactNo, setConatactNo] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [fields, setFields] = useState(false);
  const [alertStatus, setAlertStatus] = useState("danger");
  const [msg, setMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dispatch] = useStateValue();

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

    try {
      if (!fullName || !email || !contactNo || !message) {
        setFields(true);
        setMsg(" fields can't be empty");
        setAlertStatus("danger");
        setTimeout(() => {
          setFields(false);
          setIsLoading(false);
        }, 4000);
      } else {
        const dataContact = {
          id: `${Date.now()}`,
          fullName: fullName,
          email: email,
          contactNo: contactNo,
          message: message,
          date: Date(),
        };

        const response = await fetch('./php/ContactUsEmail.php', {
          method: 'POST',
          body: JSON.stringify(dataContact),
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const responseData = await response.json();
        console.log(responseData);
        if (response.ok && responseData.success) {
          uploadContactUsItem(dataContact);
          setIsLoading(false);
          setFields(true);
          setMsg("Your message is submitted. Thank you!");
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
    setMessage("");
  };

  const fetchData = async () => {
    await getAllContactUsItems().then((dataContact) => {
      dispatch({
        type: actionType.SET_CONTACTUS_DETAILS,
        uploadcontacus: dataContact,
      });
    });
  };

  return (
    <>
      <div className="container">
        <div className=" border border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center gap-4">
          <h3 className='text-2xl font-semibold capitalize text-headingColor'>Contact Us</h3>
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
          <div className="px-5 group flex justify-center items-center flex-col border-2 border-dotted border-gray-300 w-full h-full p-3 rounded-lg p">
            <h3 className=' text-sm md:text-base font-bold text-blue-700'>For any inquiries, please fill out this form</h3>
            <form>
              <div class="gap-8 row flex flex-wrap my-10">
                <div className="flex flex-col">
                  <label className='text-textBlue' for="fullname">Full Name</label>
                  <input className='border rounded p-3 w-72 lg:w-96 hover:border-indigo-500' type="text" id="fullName" name="fullname" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="First Name" />
                </div>
                <div className="flex flex-col">
                  <label className='text-textBlue' for="contactNo">Contact No</label>
                  <input className='border rounded p-3 w-72 lg:w-96 hover:border-indigo-500' type="tel" id="contactno" name="contactno" placeholder="Contact No" maxLength={10} value={contactNo} onChange={(e) => setConatactNo(e.target.value)} />
                </div>

                <div className="flex flex-col">
                  <label className='text-textBlue' for="email">Email Id</label>
                  <input className='border rounded p-3 w-72 lg:w-96 hover:border-indigo-500' type="email" id="emailId" name="email" placeholder="Email Id" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
              </div>
              <div className="flex flex-col">
                <label className='text-textBlue' for="message">Message</label>
                <textarea className='border rounded p-3 hover:border-indigo-500 h-32 resize-none' name="message" value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
              </div>
            </form>
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
              type="submit"
              name='submit'
              className={`ml-0 md:ml-auto w-full md:w-auto border-none outline-none px-12 py-2 rounded-lg text-lg text-white font-semibold ${!fullName || !email || !contactNo || !message
                ? 'bg-blue-200 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-700'
                }`}
              onClick={saveDetails}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
