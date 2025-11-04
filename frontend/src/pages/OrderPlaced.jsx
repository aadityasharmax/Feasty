import React, { useEffect, useState } from 'react'
import { FaCircleCheck } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';

const OrderPlaced = () => {
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className='min-h-screen bg-[#fff9f6] flex flex-col justify-center items-center px-4 text-center relative overflow-hidden'>
      {/* 🎊 Confetti effect */}
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={500}
          gravity={0.6}
        />
      )}

      <FaCircleCheck className='text-green-500 text-6xl mb-4'/>
      <h1 className='text-3xl font-bold text-gray-800 mb-2'>Order Placed!</h1>
      <p className='text-gray-600 max-w-md mb-6'>
        Thank you for your purchase. Your order is being prepared.<br/>
        You can track your order in the "My Orders" section.
      </p>
      <button
        className='bg-[#ff4d2d] hover:bg-[#e64526] text-white px-6 py-3 rounded-lg text-lg font-medium transition'
        onClick={() => navigate('/my-orders')}
      >
        Back To My Orders
      </button>
    </div>
  )
}

export default OrderPlaced
