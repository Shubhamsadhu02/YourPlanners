import React, { useEffect, useRef, useState } from "react";
import { FaHeart, FaEye } from 'react-icons/fa';
import { motion } from "framer-motion";
import NotFound from "../img/NotFound.svg";
import { useStateValue } from "../context/StateProvider";
import { actionType } from "../context/reducer";
import VendorProfile from "./VendorProfile";
import Avatar from "../img/avatar.png";

const RowContainer = ({ flag, data, scrollValue }) => {
  const rowContainer = useRef();
  const [items, setItems] = useState([]);
  const [{ cartItems }, dispatch] = useStateValue();
  const [open, setOpen] = useState(false);

  const addtocart = () => {
    dispatch({
      type: actionType.SET_CARTITEMS,
      cartItems: items,
    });
    localStorage.setItem("cartItems", JSON.stringify(items));
  };

  useEffect(() => {
    rowContainer.current.scrollLeft += scrollValue;
  }, [scrollValue]);

  useEffect(() => {
    addtocart();
  }, [items]);

  return (
    <div
      ref={rowContainer}
      className={`w-full flex items-center md:gap-3 my-0 md:my-12 lg:my-0 scroll-smooth  ${flag
          ? "overflow-x-scroll scrollbar-none"
          : "overflow-x-hidden flex-wrap justify-center"
        }`}
    >
      {data && data.length > 0 ? (
        <div className="w-full flex flex-col items-center justify-center">
          <img src={NotFound} className="h-340" />
          <p className="text-xl text-headingColor font-semibold my-2">
            Items Not Available
          </p>
        </div>
      ) : (
        <div>
          <div
            key={data?.id}
            className="w-full h-[180px] min-w-[275px] md:w-300 md:min-w-[300px]  bg-cardOverlay rounded-lg py-2 px-4  my-12 backdrop-blur-lg hover:drop-shadow-lg flex flex-col items-center justify-evenly relative cursor-pointer"
          >
            <div className="w-full flex items-center justify-between">
              <motion.div
                className="w-40 h-40 -mt-8 drop-shadow-2xl"
                whileHover={{ scale: 1.2 }}
              >
                <img
                  src={data?.imageURL ? data?.imageURL : Avatar}
                  alt=""
                  className="w-36 h-36 object-contain"
                />
              </motion.div>
              <motion.div
                whileTap={{ scale: 0.75 }}
                className="w-8 h-8 rounded-full bg-cartNumBg flex items-center justify-center cursor-pointer -mt-8"
                onClick={() => setItems([...cartItems, data])}
              >
                <FaHeart className="text-white" />
              </motion.div>
              <motion.div
                whileTap={{ scale: 0.75 }}
                className="w-8 h-8 rounded-full bg-cartNumBg flex items-center justify-center cursor-pointer -mt-8"
                onClick={() => setOpen(!open)}
              >
                <FaEye className="text-white" />

              </motion.div>
            </div>

            <div className="w-full flex flex-col items-end justify-end -mt-8 overflow-hidden">
              <p className="text-textColor font-semibold text-base md:text-lg truncate w-28" style={{ textAlign: "end" }}>
                {data.company}
              </p>
              <p className="mt-1 text-sm text-gray-500 capitalize">
                {data.register}
              </p>
              <div className="flex items-center gap-8">
                <p className="text-sm text-gray-500 truncate">
                  {data.area}
                </p>
              </div>
            </div>
          </div>
          {
            open ? (
              <VendorProfile setOpen={setOpen} data={data} />
            ) : null
          }
        </div>
      )
      }
    </div>
  );
};

export default RowContainer;
