import React, { useEffect, useState } from "react";
import { MdMiscellaneousServices } from 'react-icons/md';
import { categories } from "../utils/data";
import { motion } from "framer-motion";
import RowContainer from "./RowContainer";
import { useStateValue } from "../context/StateProvider";
import {AiOutlineSearch} from "react-icons/ai";

const MenuContainer = () => {
  const [filter, setFilter] = useState("decoration");

  const [{ plannerItems }, dispatch] = useStateValue();
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = (event) => {
    setSearchValue(event.target.value);
  };

  return (
   
    <section className="my-16 container" id="menu">
      <div className="w-full flex flex-col items-center justify-center">
        <p className="text-2xl font-semibold capitalize text-headingColor relative before:absolute before:rounded-lg before:content before:w-16 before:h-1 before:-bottom-2 before:left-0 before:bg-gradient-to-tr from-blue-400 to-blue-600 transition-all ease-in-out duration-100 mr-auto">
          Search Your Planner
        </p>

        <div className="w-full flex items-center justify-start lg:justify-center gap-8 py-6 overflow-x-scroll scrollbar-none">
          {categories &&
            categories.map((category) => (
              <motion.div
                whileTap={{ scale: 0.75 }}
                key={category.id}
                className={`group ${
                  filter === category.urlParamName ? "bg-cartNumBg" : "bg-card"
                }  p-3 min-w-[100px] h-28 cursor-pointer rounded-lg drop-shadow-xl flex flex-col gap-3 items-center justify-center hover:bg-cartNumBg `}
                onClick={() => setFilter(category.urlParamName)}
              >
                <div
                  className={`w-10 h-10 rounded-full shadow-lg ${
                    filter === category.urlParamName
                      ? "bg-white"
                      : "bg-cartNumBg"
                  } group-hover:bg-white flex items-center justify-center`}
                >
                  
                  <MdMiscellaneousServices
                    className={`${
                      filter === category.urlParamName
                        ? "text-textColor"
                        : "text-white"
                    } group-hover:text-textColor text-lg`}
                  />
                </div>
                <p
                  className={`text-sm ${
                    filter === category.urlParamName
                      ? "text-white"
                      : "text-textColor"
                  } group-hover:text-white`}
                >
                  {category.name}
                </p>
              </motion.div>
            ))}
        </div>

        <div className="w-full flex flex-col items-center">
          <div className="relative w-80 lg:w-96">
          <input
        type="text"
        placeholder="Search With Company Name, Pincode..."
        value={searchValue}
        onChange={handleSearch}
        className="border rounded my-8 p-3 w-80 lg:w-96 hover:border-indigo-500  text-sm md:text-base drop-shadow-xl"
      />
      <AiOutlineSearch size={20} className="absolute font-bold right-2 bottom-12"/>
          </div>
        <div className="w-full flex justify-center md:gap-5 lg:gap-5 flex-wrap">
        {plannerItems?.filter((n) => n.register === filter && n.isVerified === true)
        .filter((n) =>n.company.toLowerCase().includes(searchValue.toLowerCase()) || n.pinCode.includes(searchValue))
        .map((item, index) => (
          <div className="xl:w-1/4 md:w-1/3 lg:w-1/3 2xl:w-1/5">
          <RowContainer key={index} flag={false} data={item} />
          </div>
        ))}
          
        </div>
        </div>
      </div>
    </section>
   
  );
};

export default MenuContainer;
