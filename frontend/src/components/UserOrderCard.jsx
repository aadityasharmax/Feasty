import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { serverUrl } from "../App";


const UserOrderCard = ({ data }) => {
  const navigate = useNavigate();

  const [selectedRating, setSelectedRating] = useState({}) // itemId:rating
  if (!data) return null;
  // console.log("order data", data);

  // Show date in  valid format DD/MM/YYYY
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleRating = async (itemId, rating) => {
    try {
     await axios.post(`${serverUrl}/api/item/rating`,{itemId,rating},{withCredentials:true})

      setSelectedRating((prev) => ({
        ...prev,
        [itemId]:rating

      }))
    } catch (error) {
      console.log(error)
    }
  }

  const shortId = data._id ? data._id.slice(-6) : "------";
  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-4">
      <div className="flex justify-between border-b pb-2">
        <div>
          <p className="font-semibold">order #{shortId}</p>

          <p className="text-sm text-gray-500">
            Date: {formatDate(data.createdAt)}
          </p>
        </div>

        <div className="text-right ">
          {data.paymentMethod == "cod" ? (
            <p className="text-sm text-gray-500">
              {data.paymentMethod.toUpperCase()}
            </p>
          ) : (
            <p className="text-sm text-gray-500">
             Payment : {data.payment ? "true" : "false"}
            </p>
          )}

          <p className="font-medium text-blue-600">
            {data.shopOrders?.[0].status}
          </p>
        </div>
      </div>

      {data.shopOrders?.map((shopOrder, index) => (
        <div
          className="border rounded-lg p-3 bg-[#fffaf7] space-y-3"
          key={index}
        >
          <p>{shopOrder.shop.shopName}</p>

          <div className="flex space-x-4 overflow-auto pb-2">
            {shopOrder.shopOrderItems.map((item, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-40 border rounded-lg p-2 bg-white"
              >
                <img
                  src={item.item.image}
                  className="w-full h-24 object-cover rounded"
                  alt="food image"
                />
                <p className="text-sm font-semibold mt-1 ">{item.item.name}</p>

                <p className="text-xs text-gray-500 ">
                  Quantity: {item.quantity} x ₹{item.price}
                </p>

                {shopOrder.status === "delivered" && <div className="flex space-x-1 mt-2">
                  {[1,2,3,4,5].map((star) => (
                    <button className={`${selectedRating[item.item._id] >= star ? 'text-yellow-400 text-lg':'text-gray-400 text-lg'}`}
                    onClick={() => handleRating(item.item._id,star)  } 
                    key={star}
                    >★</button>
                  ))}
                </div> }
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center border-t pt-2">
            <p className="font-semibold ">Subtotal: ₹{shopOrder.subTotal}</p>
            <span className="text-sm font-medium text-blue-600">
              {shopOrder.status}
            </span>
          </div>
        </div>
      ))}

      <div className="flex justify-between items-center border-t pt-2">
        <p className="font-semibold ">Total: ₹{data.totalAmount}</p>
        <button
          className="bg-[#ff4d2d] hover:bg-[#e64526] text-white px-4 py-2 rounded-lg text-sm"
          onClick={() => navigate(`/track-order/${data._id}`)}
        >
          Track Order
        </button>
      </div>
    </div>
  );
};

export default UserOrderCard;
