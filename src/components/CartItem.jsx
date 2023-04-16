import React, { useEffect, useState } from "react";
import { useStateValue } from "../context/StateProvider";
import { actionType } from "../context/reducer";

const CartItem = ({ item }) => {
  const [{ cartItems }, dispatch] = useStateValue();


  return (
    <div className="w-full p-1 px-2 rounded-lg bg-cartItem flex items-center gap-2">
      <img
        src={item?.imageURL}
        className="w-20 h-20 max-w-[60px] rounded-full object-contain"
        alt=""
      />

      {/* name section */}
      <div className="flex flex-col gap-2">
        <p className="text-base text-gray-50">{item?.company}</p>
        <p className="text-sm block text-gray-300 font-semibold">
           {item.register}
        </p>
      </div>

      {/* button section */}
    </div>
  );
};

export default CartItem;
