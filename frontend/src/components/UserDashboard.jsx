import React, { useEffect, useRef, useState } from "react";
import Nav from "./Nav";
import { categories } from "../category";
import CategoryCard from "./CategoryCard";
import { FaChevronCircleLeft } from "react-icons/fa";
import { FaChevronCircleRight } from "react-icons/fa";
import { useSelector } from "react-redux";
import FoodCard from "./FoodCard";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";

const UserDashboard = () => {

  const navigate = useNavigate()
  const { city, shopsInMyCity, itemsInMyCity, searchItems} = useSelector((state) => state.user);
  const [showGetRefLeft, setShowGetRefLeft] = useState(false);
  const [showGetRefRight, setShowGetRefRight] = useState(false);

  const [showLeftShopButton, setShowLeftShopButton] = useState(false);
  const [showRightShopButton, setShowRightShopButton] = useState(false);

  const [updatedItemsList, setUpdatedItemsList] = useState([])


  const handleFilterByCategory = (category) => {
    if(category === "ALL" || category ==="All"){
      setUpdatedItemsList(itemsInMyCity)
    }

    else{
      const filteredList = itemsInMyCity.filter(i => i.category === category)
      setUpdatedItemsList(filteredList)
    }
  }

  useEffect(() => {
    setUpdatedItemsList(itemsInMyCity)
  },[itemsInMyCity])

  const cateScrollRef = useRef();
  const shopScrollRef = useRef();

  const updateButton = (ref, setShowGetRefLeft, setShowGetRefRight) => {
    const element = ref.current;
    if (element) {
      setShowGetRefLeft(element.scrollLeft > 0);
      setShowGetRefRight(
        element.scrollLeft + element.clientWidth < element.scrollWidth
      );
    }
  };

  const scrollHandler = (ref, direction) => {
    if (ref.current) {
      ref.current.scrollBy({
        left: direction == "left" ? -200 : 200,
        behavior: "smooth",
      });
    }
  };

  

  useEffect(() => {
  if (!cateScrollRef.current || !shopScrollRef.current) return;

  const handleCateScroll = () => {
    updateButton(cateScrollRef, setShowGetRefLeft, setShowGetRefRight);
  };
  const handleShopScroll = () => {
    updateButton(shopScrollRef, setShowLeftShopButton, setShowRightShopButton);
  };

  // Initial check
  handleCateScroll();
  handleShopScroll();

  // Add listeners
  cateScrollRef.current.addEventListener("scroll", handleCateScroll);
  shopScrollRef.current.addEventListener("scroll", handleShopScroll);

  // Cleanup safely
  return () => {
    if (cateScrollRef.current) {
      cateScrollRef.current.removeEventListener("scroll", handleCateScroll);
    }
    if (shopScrollRef.current) {
      shopScrollRef.current.removeEventListener("scroll", handleShopScroll);
    }
  };
}, []);



  return (
    <div className="w-screen min-h-screen flex flex-col gap-5 items-center overflow-y-auto">
      <Nav />

      {searchItems && searchItems.length > 0 && (
        <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-5 bg-white shadow-md rounded-2xl mt-4 ">
          <h1 className="text-gray-900 text-2xl sm:text-3xl font-semibold border-b border-gray-200 pb-2">Search Result</h1>
          <div className="w-full h-auto flex flex-wrap gap-6 justify-center">
            {searchItems.map(item => (
              <FoodCard data={item} key={item._id}/>
            ))}
          </div>
        </div>
      ) }

      <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-[10px]">
        <h1 className="text-gray-800 text-2xl sm:text-3xl">
          Inspiration for your first order
        </h1>

        {/* category section */}

        <div className="w-full relative">
          {/* left button */}
          {showGetRefLeft && (
            <button
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10"
              onClick={() => scrollHandler(cateScrollRef, "left")}
            >
              <FaChevronCircleLeft />
            </button>
          )}
          <div
            className="w-full flex overflow-x-auto gap-4 pb-2 "
            ref={cateScrollRef}
          >
            {categories.map((cate, index) => (
              <CategoryCard
                name={cate.category}
                image={cate.image}
                key={index}
                onClick={() => handleFilterByCategory(cate.category)}
              />
            ))}
          </div>

          {/* right button */}
          {showGetRefRight && (
            <button
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10"
              onClick={() => scrollHandler(cateScrollRef, "right")}
            >
              <FaChevronCircleRight />
            </button>
          )}
        </div>
      </div>

      <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-[10px]">
        <h1 className="text-gray-800 text-2xl sm:text-3xl">
          Best shop in <span className="text-[#ff4d2d]">{city}</span>
        </h1>

        {/* best shops in city section */}

        <div className="w-full relative">
          {/* left button */}
          {showLeftShopButton && (
            <button
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10"
              onClick={() => scrollHandler(shopScrollRef, "left")}
            >
              <FaChevronCircleLeft />
            </button>
          )}
          <div
            className="w-full flex overflow-x-auto gap-4 pb-2 "
            ref={shopScrollRef}
          >
            {shopsInMyCity.map((shop, index) => (
              <CategoryCard
                name={shop.shopName}
                image={shop.image}
                key={index}
                onClick={() => navigate(`shop/${shop._id}`)}
              />
            ))}
          </div>

          {/* right button */}
          {showRightShopButton && (
            <button
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10"
              onClick={() => scrollHandler(shopScrollRef, "right")}
            >
              <FaChevronCircleRight />
            </button>
          )}
        </div>
      </div>

      <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-[10px]">
          <h1 className="text-gray-800 text-2xl sm:text-3xl">
            Suggested Food Items
          </h1>

          <div className="w-full h-auto flex flex-wrap gap-[20px] justify-center">
            {updatedItemsList?.map((item,index) => (
              <FoodCard key={index} data={item}/>
            ))}
          </div>
      </div>
    </div>
  );
};

export default UserDashboard;
