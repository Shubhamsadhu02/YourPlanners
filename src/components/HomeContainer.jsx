import React from "react";

import HeroBg from "../img/heroBg.png";
import { heroData } from "../utils/data";
import { HashLink } from 'react-router-hash-link';

const HomeContainer = () => {
  return (
    <section
    className="container"
    >
      <div
      className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full "
      id="home">
      <div className="py-2 flex-1 flex flex-col items-start justify-center gap-6">

        <p className="text-[2.5rem] lg:text-[4.5rem] font-bold tracking-wide text-headingColor">
        <span className="text-textBlue text-[3rem] lg:text-[5rem] ">
          Your Planner
          </span> is in Your City
        </p>

        <p className="text-base text-textColor text-center md:text-left md:w-[80%]">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Minima velit
          eaque fugit distinctio est nam voluptatum architecto, porro iusto
          deserunt recusandae ipsa minus eos sunt, dolores illo repellat facere
          suscipit!
        </p>

      </div>
      <div className="py-2 flex-1 flex items-center relative">
        <img
          src={HeroBg}
          className=" ml-auto h-420 w-full lg:w-auto lg:h-650 shadow-2xl"
          alt="hero-bg"
        />

        <div className="w-full h-full absolute top-0 left-0 flex items-center justify-center lg:px-32  py-4 gap-4 flex-wrap">
          {heroData &&
            heroData.map((n) => (
              <HashLink to={"/#menu"} smooth>
              <div
                key={n.id}
                className="  lg:w-190  p-4 bg-cardOverlay backdrop-blur-md rounded-3xl flex flex-col items-center justify-center drop-shadow-lg"
              >
                <img
                  src={n.imageSrc}
                  className="w-20 lg:w-40 -mt-10 lg:-mt-20 "
                  alt={n.name}
                />
                <p className="text-base lg:text-xl font-semibold text-textColor mt-2 lg:mt-4">
                  {n.name}
                </p>
              </div>
              </HashLink>
            ))}
        </div>
      </div>
    </div>
    </section>
  );
};

export default HomeContainer;
