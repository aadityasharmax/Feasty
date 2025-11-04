import React from "react";
import { useNavigate } from "react-router-dom";
import Nav from "../components/Nav";
import { useSelector } from "react-redux";
import { FaUtensils } from "react-icons/fa";
import { FaPen } from "react-icons/fa";
import OwnerItemCard from "./OwnerItemCard";

const OwnerDashboard = () => {
  const { myShopData } = useSelector((state) => state.owner);
  const navigate = useNavigate();

  
  return (
    <div className="w-full min-h-screen flex flex-col items-center">
      <Nav />

      {!myShopData && (
        <div className="flex justify-center items-center p-4 sm:p-6">
          <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-4 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex flex-col items-center text-center">
              <FaUtensils className="text-[#ff4d2d] w-16 h-16 sm:w-20 sm:h-20 mb-4" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                Add your restaurant
              </h2>
              <p className="text-gray-600 mb-4 text-sm sm:text-base">
                Join our food delivery platform and reach thousands of customers
                everyday
              </p>
              <button
                className="bg-[#ff4d2d] text-white px-5 sm:px-6 py-2 rounded-full font-medium shadow-md hover:bg-orange-600 transition-colors duration-200 cursor-pointer"
                onClick={() => navigate("/create-edit-shop")}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      )}

      {myShopData && (
        <div className="w-full h-full flex flex-col items-center gap-4 px-2 sm:px-6">
          <h1
            className="text-2xl sm:text-3xl text-gray-900 flex items-center gap-3 mt-4
        text-center
        "
          >
            <FaUtensils className="text-[#ff4d2d] w-14 h-14" />
            Welcome to {myShopData.shopName}
          </h1>

          <div
            className="bg-white shadow-lg rounded-xl overflow-hidden border border-orange-100
          hover:shadow-2xl transition-all dration-300 w-full max-w-3xl relative
          "
          >
            <div
              className="absolute top-4 right-4 bg-[#ff4d2d] text-white p-2 rounded-full shadow-md cursor-pointer hover:bg-orange-600 transition-colors
            "
              onClick={() => navigate("/create-edit-shop")}
            >
              <FaPen size={20} />
            </div>
            <img
              className="w-full h-45 sm:h-64 object-cover"
              src={myShopData.image}
              alt="shop image"
            />

            <div className="p-2 sm:p-4">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                {myShopData.shopName}
              </h1>
              <p className="text-gray-500">
                {myShopData.city},{myShopData.state}
              </p>
              <p className="text-gray-500 mb-4">{myShopData.address}</p>
            </div>
            </div>

            {myShopData.items.length == 0 && (
              <div className="flex justify-center items-center p-4 sm:p-6">
                <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-4 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                  <div className="flex flex-col items-center text-center">
                    <FaUtensils className="text-[#ff4d2d] w-16 h-16 sm:w-20 sm:h-20 mb-4" />
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                      Add your food item
                    </h2>
                    <p className="text-gray-600 mb-4 text-sm sm:text-base">
                      Share your delicious dishes with the customers by adding them to the menu.
                    </p>
                    <button
                      className="bg-[#ff4d2d] text-white px-5 sm:px-6 py-2 rounded-full font-medium shadow-md hover:bg-orange-600 transition-colors duration-200 cursor-pointer"
                      onClick={() => navigate('add-food')}
                    >
                      Add Food
                    </button>
                  </div>
                </div>
              </div>
            )}

            {myShopData.items.length > 0 && <div className="flex flex-col items-center gap-4 w-full max-w-3xl">
              {myShopData.items.map((item,index) => (
                <OwnerItemCard data={item} key={index}/>
              ))}
              </div>}
          
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;
