import React from "react";
import { IoChevronBackSharp } from "react-icons/io5";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CartItemCard from "../components/CartItemCard";


const CartPage = () => {

    const navigate = useNavigate();
    const {cartItems} = useSelector(state => state.user)
  return (
    <div className="min-h-screen bg-[#fff9f6] flex justify-center p-6">
      <div className=" w-full max-w-[800px]">
        <div className="flex items-center gap-[20px] mb-6">
            <div
          className=" z-[10] cursor-pointer"
          onClick={() => navigate("/")}
        >
          <IoChevronBackSharp size={35} className="text-[#ff4d2d]"/>
        </div>
        <h1 className="text-2xl font-bold text-start">Your Cart</h1>
        </div>

        {cartItems?.length == 0 ? (
            <p className="text-gray-500 text-lg text-center">Your cart is empty</p>
        ) : (
        <div>
            {cartItems?.map((item,index) => (
                <CartItemCard data={item} key={index}/>
            ))}
        </div>
    )   
    }

      </div>
    </div>
  );
};

export default CartPage;
