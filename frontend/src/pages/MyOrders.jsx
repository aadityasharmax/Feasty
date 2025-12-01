import React from 'react'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setMyOrders, updateRealTimeOrderStatus } from '../redux/userSlice.js'
import { useSelector } from 'react-redux'
import { IoChevronBackSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import UserOrderCard from '../components/UserOrderCard.jsx';
import OwnerOrderCard from '../components/OwnerOrderCard.jsx';




const MyOrders = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch()
  const {userData, myOrders, socket} = useSelector((state) => state.user)

  useEffect(() => {
    socket?.on('newOrder',(data) => {
      console.log("Received newOrder:", data);
      if(data.shopOrders?.owner._id == userData._id){
        dispatch(setMyOrders([data,...myOrders]))
      }
    })

    socket?.on('update-status',({orderId, shopId, status, userId}) => {
      console.log("Received update-status:", {orderId, shopId, status, userId});
      if(userData.role === 'owner' && userData._id == userId){
        dispatch(updateRealTimeOrderStatus({orderId, shopId, status}))
      } else if(userData.role === 'user' && userData._id == userId){
        dispatch(updateRealTimeOrderStatus({orderId, shopId, status}))
      }
    })


    return () => {
      socket?.off('newOrder')
      socket?.off('update-status')
    }
  },[socket])


  return (
    <div className='w-full min-h-screen bg-[#fff9f6] flex justify-center px-4'>
      <div className=' w-full max-w-[800px] p-4'>
        <div
                className="absolute flex gap-10 top-5 left-5 z-10 cursor-pointer"
                onClick={() => navigate("/")}
              >
                <IoChevronBackSharp size={35} className="text-[#ff4d2d]" />
              <h1 className="text-2xl font-bold text-gray-800">My Orders</h1>
              </div>

              <div className='space-y-6 mt-20 mb-10'>
                {myOrders.map((order,index) => (
                  userData.role === 'user' ? 
                  (
                    <UserOrderCard data={order} key={index}/>
                  )
                  :

                  userData.role === 'owner' ? 
                  (
                    <OwnerOrderCard data={order} key={index}/>
                  )
                  : 
                  null

                  
                  
                ))}
              </div>
      </div>
    </div>
  )
}

export default MyOrders
