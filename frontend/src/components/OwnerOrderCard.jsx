import React from 'react'
import { FaMobileRetro } from "react-icons/fa6";
import { FaPhoneAlt } from "react-icons/fa";

const OwnerOrderCard = ({data}) => {
  return (
    <div className='bg-white rounded-lg shadow p-4 space-y-4'>
        <div className=''>
            <h2 className='text-lg font-semibold text-gray-800'>{data.user.fullName}</h2>
        <p className='text-sm text-gray-500'>{data.user.email}</p>
        <p className='flex items-center gap-2 text-sm text-gray-600 mt-1'><FaPhoneAlt /><span>{data.user.mobile}</span></p>
        </div>

        <div className='flex flex-col items-start gap-2 text-gray-600 text-sm'>
            <p>{data?.deliveryAddress?.text}</p>
            <p className='text-xs text-gray-500'>Lat: {data?.deliveryAddress?.latitude}, Lon: {data?.deliveryAddress?.latitude}</p>
        </div>
    </div>
  )
}

export default OwnerOrderCard