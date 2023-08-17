import React, { useState } from "react";
import { MdLogout, MdAdminPanelSettings, MdEmail } from "react-icons/md";
import { GiHamburgerMenu } from "react-icons/gi";
import { AiFillInfoCircle } from "react-icons/ai";
import { motion } from "framer-motion";
import { FaHeart, FaUserAlt } from 'react-icons/fa';

import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { app } from "../firebase.config";

// import Avatar from "../img/avatar.png";
import { Link, useNavigate } from "react-router-dom";
import { useStateValue } from "../context/StateProvider";
import { actionType } from "../context/reducer";
import Login from "./Login";

const Header = () => {
  const firebaseAuth = getAuth(app);
  const provider = new GoogleAuthProvider();

  const [{ user, cartShow, cartItems }, dispatch] = useStateValue();
  const [isMenu, setIsMenu] = useState(false);
  const [ishamMenu, setIsHamMenu] = useState(false);
  const navigate = useNavigate();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // const login = async () => {
  //   if (!user) {
  //     const {
  //       user: { refreshToken, providerData },
  //     } = await signInWithPopup(firebaseAuth, provider);
  //     dispatch({
  //       type: actionType.SET_USER,
  //       user: providerData[0],
  //     });
  //     localStorage.setItem("user", JSON.stringify(providerData[0]));
  //   } else {
  //     setIsMenu(!isMenu);
  //   }
  // };

  const handleLogin = () => {
    if (user) {
      setIsMenu(!isMenu); 
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const logout = () => {
    setIsMenu(false);
    localStorage.clear();

    dispatch({
      type: actionType.SET_USER,
      user: null,
    });
    navigate("/", { replace: true })
  };

  const showCart = () => {
    dispatch({
      type: actionType.SET_CART_SHOW,
      cartShow: !cartShow,
    });
  };

  return (
    <header className="fixed z-50 w-screen p-3 px-4 md:p-6 md:px-16 bg-primary">
      <div className="container">
        {/* desktop & tablet */}
        <div className="hidden md:flex w-full h-full items-center justify-between">
          <Link to={"/"} className="flex items-center gap-2">
            <p className="text-xl font-bold text-textBlue">Your Planner</p>
          </Link>

          <div className="flex justify-evenly">
            <Link to={"/"}><p className="text-textColor text-base font-semibold p-4 hover:text-blue-800 hover:border-b-2 hover:border-blue-800">Home</p></Link>
            <Link to={"/about-us"}><p className="text-textColor text-base font-semibold p-4 hover:text-blue-800 hover:border-b-2 hover:border-blue-800">About Us</p></Link>
            <Link to={"/contact-us"}><p className="text-textColor text-base font-semibold p-4 hover:text-blue-800 hover:border-b-2 hover:border-blue-800">Contact Us</p></Link>
          </div>

          <div className="flex items-center gap-8">
            <div className="">
              <Link to={"/planner-form"}><button type="submit" className="border-2 border-blue-500 hover:bg-blue-700 text-blue-700 hover:text-white font-bold py-2 px-4 rounded">Become A Planner</button></Link>
            </div>

            {/* <div
              className="relative flex items-center justify-center"
              onClick={showCart}
            >
              <FaHeart className="text-textColor text-2xl  cursor-pointer" />
              {cartItems && cartItems.length > 0 && (
                <div className=" absolute -top-2 -right-2 w-5 h-5 rounded-full bg-cartNumBg flex items-center justify-center">
                  <p className="text-xs text-white font-semibold">
                    {cartItems.length}
                  </p>
                </div>
              )}
            </div> */}

            <div className="relative">
              {user ? (
                <motion.img
                  whileTap={{ scale: 0.9 }}
                  src={user.photoURL}
                  className="w-10 min-w-[40px] h-10 min-h-[40px] drop-shadow-xl cursor-pointer rounded-full"
                  alt="userprofile"
                  onClick={handleLogin}
                />
              ) : (
                <button className="bg-blue-700 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded" onClick={() => setIsLoginModalOpen(true)}>Login/Register</button>
              )}
              {isLoginModalOpen && <Login closeModal={() => setIsLoginModalOpen(false)} />}
              {isMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  className="w-40 bg-gray-50 shadow-xl rounded-lg flex flex-col absolute top-12 right-0 overflow-hidden"
                >
                  {user && user.email === "yourplaneer2023@gmail.com" ? (
                    <Link to={"/admin-dashboard"}>
                      <p
                        className="px-4 py-2 flex items-center gap-3 cursor-pointer hover:bg-slate-100 transition-all duration-100 ease-in-out text-textColor text-base"
                        onClick={() => setIsMenu(false)}
                      >
                        <MdAdminPanelSettings /> Admin
                      </p>
                    </Link>
                  ) :
                    <div className="">
                      <Link to={"/profile"} flag={false}>
                        <p className="px-4 py-2 flex items-center gap-3 cursor-pointer hover:bg-slate-100 transition-all duration-100 ease-in-out text-textColor text-base"
                          onClick={() => setIsMenu(false)}>
                          <FaUserAlt /> View profile
                        </p>
                      </Link>
                      {/* <p className="px-4 py-2 flex items-center gap-3 cursor-pointer hover:bg-slate-100 transition-all duration-100 ease-in-out text-textColor text-base">
                        <MdEdit /> Edit profile
                      </p> */}
                    </div>
                  }

                  <p
                    className="px-4 py-2 flex items-center gap-3 cursor-pointer hover:bg-slate-100 transition-all duration-100 ease-in-out text-textColor text-base"
                    onClick={logout}
                  >
                    <MdLogout /> Logout
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* mobile */}
      <div className="flex items-center justify-between md:hidden w-full h-full ">
        <div className="relative flex items-center justify-center"
          onClick={() => setIsHamMenu(!ishamMenu)}>
          <GiHamburgerMenu className="text-textColor text-2xl  cursor-pointer" />
          {ishamMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              className=" bg-gray-50 shadow-xl rounded-lg flex flex-col absolute top-10 left-1 w-48 p-2"
            >
              <Link to={"/planner-form"}>
                <p
                  className="m-2 p-2 rounded-md shadow-md flex items-center justify-center bg-blue-500 text-white gap-3 cursor-pointer hover:bg-gray-300 transition-all duration-100 ease-in-out text-base"
                  onClick={() => setIsMenu(false)}>
                  Become A Planner
                </p>
              </Link>
              <Link to={"/about-us"}>
                <p
                  className="m-2 p-2 rounded-md shadow-md flex items-center justify-center bg-gray-200 gap-3 cursor-pointer hover:bg-gray-300 transition-all duration-100 ease-in-out text-textColor text-base"
                  onClick={() => setIsMenu(false)}
                >
                  About Us <AiFillInfoCircle />
                </p>
              </Link>
              <Link to={"/contact-us"}>
                <p
                  className="m-2 p-2 rounded-md shadow-md flex items-center justify-center bg-gray-200 gap-3 cursor-pointer hover:bg-gray-300 transition-all duration-100 ease-in-out text-textColor text-base"
                  onClick={() => setIsMenu(false)}
                >
                  Contact Us <MdEmail />
                </p>
              </Link>
            </motion.div>
          )}
        </div>
        {/* <div
          className="relative flex items-center justify-center"
          onClick={showCart}
        >
          <FaHeart className="text-textColor text-2xl  cursor-pointer" />
          {cartItems && cartItems.length > 0 && (
            <div className=" absolute -top-2 -right-2 w-5 h-5 rounded-full bg-cartNumBg flex items-center justify-center">
              <p className="text-xs text-white font-semibold">
                {cartItems.length}
              </p>
            </div>
          )}
        </div> */}

        <Link to={"/"} className="flex items-center gap-2">
          <p className="text-xl font-bold text-textBlue">Your Planner</p>
        </Link>

        <div className="relative">
          {user ? (
            <motion.img
              whileTap={{ scale: 0.8 }}
              src={user.photoURL}
              className="w-10 min-w-[40px] h-10 min-h-[40px] drop-shadow-xl cursor-pointer rounded-full"
              alt="userprofile"
              onClick={handleLogin}
            />
          ) : (
            <button className=" bg-blue-700 hover:bg-blue-500 text-white font-semibold py-1 px-2 rounded" onClick={() => setIsLoginModalOpen(true)}>Login/Register</button>
          )}
          {isLoginModalOpen && <Login closeModal={() => setIsLoginModalOpen(false)} />}
          {isMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              className="w-40 bg-gray-50 shadow-xl rounded-lg flex flex-col absolute top-12 right-0"
            >
              {user && user.email === "yourplaneer2023@gmail.com" ? (
                <Link to={"/admin-dashboard"}>
                  <p className="px-4 py-2 flex items-center gap-3 cursor-pointer hover:bg-slate-100 transition-all duration-100 ease-in-out text-textColor text-base"
                    onClick={() => setIsMenu(false)}>
                    <MdAdminPanelSettings /> Admin
                  </p>
                </Link>
              ) :
                (
                  <div className="">
                    <Link to={"/profile"} flag={false}>
                      <p className="px-4 py-2 flex items-center gap-3 cursor-pointer hover:bg-slate-100 transition-all duration-100 ease-in-out text-textColor text-base"
                        onClick={() => setIsMenu(false)}>
                        <FaUserAlt /> View profile
                      </p>
                    </Link>
                  </div>

                )
              }
              <Link to={"/planner-form"}>
                <p
                  className="m-2 p-2 rounded-md shadow-md flex items-center justify-center bg-blue-500 text-white gap-3 cursor-pointer hover:bg-gray-300 transition-all duration-100 ease-in-out text-base"
                  onClick={() => setIsMenu(false)}>
                  Become A Planner
                </p>
              </Link>
              <p
                className="m-2 p-2 rounded-md shadow-md flex items-center justify-center bg-gray-200 gap-3 cursor-pointer hover:bg-gray-300 transition-all duration-100 ease-in-out text-textColor text-base"
                onClick={logout}
              >
                Logout <MdLogout />
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
