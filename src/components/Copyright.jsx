import React from 'react'
import { AiFillInstagram } from "react-icons/ai";
import { BsFacebook } from "react-icons/bs";
import { Link } from 'react-router-dom';

export default function Copyright() {
  return (
    <div className='p-3 px-4 md:p-6 md:px-16 mt-12 py-8 bg-gray-200'>
      <div className=" flex flex-col md:flex-row items-center justify-between">
        <div className="logo">
        <Link to={"/"} className="flex items-center">
            <p className=" text-lg md:text-xl font-bold text-gray-700">Your Planner</p>
          </Link>
        </div>
        <div className="copyright">
            <p className='font-semibold text-sm nd:text-base text-textBlue'>Copyright 2023 &#169; YourPlanner All Right Reserved</p>
        </div>
        <div className="social">
          <p className='text-textBlue text-sm md:text-small font-semibold'>Follow us</p>
          <div className="flex items-center mt-2 md:mt-3">
            <Link to={"#"}><AiFillInstagram className="text-textBlue text-2xl md:text-3xl hover:text-blue-700"/></Link>
            <Link to={"#"}><BsFacebook className="text-textBlue text-xl md:text-2xl hover:text-blue-700 ml-4"/></Link>
          </div>
        </div>
      </div>
    </div>
  )
}
