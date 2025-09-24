import React, { useEffect, useRef, useState } from "react";
import { IoChevronBackSharp } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaUtensils } from "react-icons/fa";
import { setMyShopData } from "../redux/ownerSlice";
import axios from "axios";
import { serverUrl } from "../App";
import { ClipLoader } from "react-spinners";

const EditItem = () => {
  const navigate = useNavigate();

  const [currentItem, setCurrentItem] = useState(null)

  const { myShopData } = useSelector((state) => state.owner);
  const {itemId} = useParams()

  const [name, setName] = useState("")
  const [price,setPrice] = useState(0)
  const [category,setCategory] = useState("")
  const [foodType, setFoodType] = useState("veg")
  const [loading,setLoading] = useState(false)
  
  const [frontendImage, setFrontendImage] = useState("");
  const [backendImage, setBackendImage] = useState(null);

  const categories = ["Snacks","Main Course","Desserts","Pizza","Burgers","Sandwiches","South Indian","North Indian","Chinese","Fast Food","Others"]

  const dispatch = useDispatch();

  const handleImage = async (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    setLoading(true)
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("foodType", foodType);
      if (backendImage) {
        formData.append("image", backendImage);
      }

      const result = await axios.post(
        `${serverUrl}/api/item/edit-item/${itemId}`,
        formData,
        { withCredentials: true }
      );

      dispatch(setMyShopData(result.data));
      setLoading(false)
      navigate("/")
    } catch (error) {
      console.log(error);
      setLoading(false)
    }
  };


  useEffect(() => {
    const handleGetItemById = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/item/get-by-id/${itemId}`,{withCredentials:true})
            setCurrentItem(result.data)
        } catch (error) {
            console.log(error)
        }

    }
    handleGetItemById()
  },[itemId])

  useEffect(() => {
    setName(currentItem?.name || "")
    setPrice(currentItem?.price || "")
    setFoodType(currentItem?.foodType || "")
    setCategory(currentItem?.category || "")
    setFrontendImage(currentItem?.image || "")
  },[currentItem])

  return (
    <div className="flex justify-center flex-col items-center p-6 bg-gradient-to-br from-orange-50 relative to-white min-h-screen">
      <div
        className="absolute top-[20px] left-[20px] z-[10] mb-[10px] cursor-pointer"
        onClick={() => navigate("/")}
      >
        <IoChevronBackSharp size={35} />
      </div>

      <div className="max-w-lg w-full bg-white shadow-xl rounded-2xl p-8 border border-orange-100">
        <div className="flex  flex-col items-center mb-6">
          <div className="bg-orange-100 p-4 rounded-full mb-4">
            <FaUtensils className="text-[#ff4d2d] w-16 h-16" />
          </div>

          <div className="text-3xl font-extrabold text-gray-900">
            Edit Food Item
          </div>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter food name"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Food Image
            </label>
            <input
              type="file"
              accept="image/*"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Choose shop image"
              onChange={handleImage}
            />
            {frontendImage && (
              <div className="mt-4">
                <img
                  src={frontendImage}
                  className="w-full h-48 object-cover rounded-lg border"
                  alt=""
                />
              </div>
            )}
          </div>


          {/* price */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Enter Price (in rupees)
            </label>
            <input
              type="number"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter food price"
              onChange={(e) => setPrice(e.target.value)}
              value={price}
            />
          </div>

          {/* category */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select category
            </label>
            <select
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              onChange={(e) => setCategory(e.target.value)}
              value={category}
            >

            <option value="">Select Category</option>
            {categories.map((cate,index) => (
                <option value={cate} key={index}>{cate}</option>
            ))}
            </select>
          </div>


          {/* foodType */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select food type
            </label>
            <select
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              onChange={(e) => setFoodType(e.target.value)}
              value={foodType}
            >
                <option value="veg">Veg</option>
                <option value="non-veg">Non Veg</option>
        
            </select>
          </div>


          <button className="w-full bg-[#ff4d2d] text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-orange-600 hover:shadowlg transition-all cursor-pointer"
          disabled={loading}
          >
            {loading ? <ClipLoader size={20} color="white"/>:"Save"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditItem;
