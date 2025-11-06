  import React, { useState } from "react";
  import { FaMobileRetro } from "react-icons/fa6";
  import { FaPhoneAlt } from "react-icons/fa";
  import axios from "axios";
  import { serverUrl } from "../App";
  import { useDispatch } from "react-redux";
  import { updateOrderStatus } from "../redux/userSlice";
  import Order from "../../../backend/models/order.model";

  const OwnerOrderCard = ({ data }) => {
    const [availableBoys, setAvailableBoys] = useState([])
      const dispatch = useDispatch()
    const handleUpdateStatus = async (orderId, shopId, status) => {
      try {
        const result = await axios.post(
          `${serverUrl}/api/order/update-status/${orderId}/${shopId}`,
          { status },
          { withCredentials: true }
          
        );
        dispatch(updateOrderStatus({orderId,shopId,status}))
        setAvailableBoys(result.data.availableBoys)
        console.log(result.data)

      } catch (error) {
        console.log(error);
      }
    };
    return (
      <div className="bg-white rounded-lg shadow p-4 space-y-4">
        <div className="">
          <h2 className="text-lg font-semibold text-gray-800">
            {data.user.fullName}
          </h2>
          <p className="text-sm text-gray-500">{data.user.email}</p>
          <p className="flex items-center gap-2 text-sm text-gray-600 mt-1">
            <FaPhoneAlt />
            <span>{data.user.mobile}</span>
          </p>
        </div>

        <div className="flex flex-col items-start gap-2 text-gray-600 text-sm">
          <p>{data?.deliveryAddress?.text}</p>
          <p className="text-xs text-gray-500">
            Lat: {data?.deliveryAddress?.latitude}, Lon:{" "}
            {data?.deliveryAddress?.latitude}
          </p>
        </div>

        <div>
          <div className="flex space-x-4 overflow-auto pb-2">
            {data.shopOrders.shopOrderItems.map((item, index) => (
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
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-200">
          <span className="text-sm">
            Status:
            <span className="font-semibold capitalize text-[#ff4d2d]">
              {" "}
              {data.shopOrders.status}
            </span>{" "}
          </span>
          {data.shopOrders.status != "delivered" && <select
          // value={}
            onChange={(e) =>
              handleUpdateStatus(
                data.id,
                data.shopOrders.shop._id,
                e.target.value
              )
            }
            className="rounded-md border px-3 py-1 text-sm focus:outline-none focus:ring-2 border-[#ff4d2d] text-[#ff4d2d]"
          >
              <option value="">Change</option>
            <option value="pending">Pending</option>
            <option value="preparing">Preparing</option>
            <option value="out for delivery">Out for delivery</option>
          </select>}
        </div>

        {data.shopOrders.status == "out for delivery" && 
        <div className="mt-3 p-2 border rounded-lg text-sm bg-orange-50">
          {data.shopOrders.assignedDeliveryBoy ? <p>Delivery Partner</p> :  <p>Available Delivery Boys</p>} 
          
          {availableBoys.length > 0?(
            availableBoys.map((b,index) => (
              <div className="text-gray-500 ">{b.fullName} - {b.mobile}</div>
            ))
          ): data.shopOrders.assignedDeliveryBoy ? <div className="font-semibold">{data.shopOrders.assignedDeliveryBoy.fullName} - <span className="text-gray-400">{data.shopOrders.assignedDeliveryBoy.mobile}</span> </div>:<div>Waiting for rider to accept </div>  }
        </div>
        }

        <div className="text-right font-bold text-gray-800 ">
          Total: ₹{data.shopOrders.subTotal}
        </div>
      </div>
    );
  };

  export default OwnerOrderCard;
