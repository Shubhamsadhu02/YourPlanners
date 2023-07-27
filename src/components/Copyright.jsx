import React from 'react'
import { AiFillInstagram } from "react-icons/ai";
import { BsFacebook, BsFillTelephoneFill } from "react-icons/bs";
import {MdLocationPin, MdEmail} from "react-icons/md";
import { Link } from 'react-router-dom';

export default function Copyright() {
  return (
    <div className='p-3 px-4 md:p-6 md:px-16 mt-12 py-8 bg-gray-200'>
      <div className="logo">
        <Link to={"/"} className="flex items-center">
          <p className=" text-lg md:text-xl font-bold text-textBlue">Your Planner</p>
        </Link>
      </div>
      <div className=" mt-8 gap-8 grid grid-cols-3">
        <div className="contact-us col-span-3 md:col-span-1">
          <p className='text-textColor text-lg md:text-base font-semibold'>Contact Us</p>
          <div className="flex items-center mt-2 md:mt-3">
            <MdLocationPin className="text-gray-500 mr-2 text-xl md:text-2xl"/><p className=' text-sm md:text-base text-gray-500'>Lorem ipsum dolor sit, amet 5555555</p>
          </div>
          <div className="flex items-center mt-2 md:mt-3">
            <BsFillTelephoneFill className="text-gray-500 mr-2 text-lg md:text-xl"/><p className=' text-sm md:text-base text-gray-500'>+91 99323 33440</p>
          </div>
          <div className="flex items-center mt-2 md:mt-3">
            <MdEmail className="text-gray-500 mr-2 text-xl md:text-2xl"/><p className=' text-sm md:text-base text-gray-500'>yourplannercontactus@gmail.com</p>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <p className='text-textColor text-lg md:text-base font-semibold'>Quick Links</p>
          <div className="mt-2 md:mt-3">
            <Link to={"/"}><p className='text-sm md:text-base text-gray-500'>Home</p></Link>
            <Link to={"/about-us"}><p className='text-sm md:text-base text-gray-500'>About Us</p></Link>
            <Link to={"/contact-us"}><p className='text-sm md:text-base text-gray-500'>Contact Us</p></Link>
          </div>
        </div>
        <div className="social flex flex-col items-end col-span-2 md:col-span-1">
          <p className='text-textColor text-lg md:text-base font-semibold'>Follow Us</p>
          <div className="flex items-center mt-2 md:mt-3">
            <Link to={"https://instagram.com/yourplanner.in?igshid=NGExMmI2YTkyZg== "} target='__blank'><AiFillInstagram className="text-gray-500 text-2xl md:text-3xl hover:text-blue-700" /></Link>
            <Link to={"https://www.facebook.com/people/your-planner/100094191707304/?mibextid=ZbWKwL"} target='__blank'><BsFacebook className="text-gray-500 text-xl md:text-2xl hover:text-blue-700 ml-4" /></Link>
          </div>
        </div>
      </div>
      <div className="horizontal_line"></div>
      <div className="copyright text-center mt-16">
        <p className='font-semibold text-sm md:text-base text-gray-500'>Your Planner &#169; {new Date().getFullYear()} All Right Reserved</p>
      </div>
    </div>
  )
}
