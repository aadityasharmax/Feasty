import React, { useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../App";
import axios from "axios";


const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const navigate = useNavigate()

  const handleSendOtp = async () => {
    try {
        const result = await axios.post(`${serverUrl}/api/auth/sendotp`,{email},{ withCredentials:true })
        

        setStep(2)
    } catch (error) {
        setError(error.response.data.message); 
      }
  }


   const handleVerifyOtp = async () => {
    try {
        const result = await axios.post(`${serverUrl}/api/auth/verifyotp`,{email,otp},{ withCredentials:true })
        // console.log(result)

        setStep(3)
    } catch (error) {
        setError(error.response.data.message);
    }
  }

  const handleResetPassword = async () => {
    if(newPassword !== confirmNewPassword){
        alert("Passwords do not match")
        navigate('/signin')
    }

    try {
        const result = await axios.post(`${serverUrl}/api/auth/resetpassword`,{email,newPassword},{ withCredentials:true })
        // console.log(result)

        setStep(3)
    } catch (error) {
        setError(error.response.data.message);
    }
  }


  return (
    <div className="flex items-center w-full justify-center min-h-screen p-4 bg-[#fff9f6]">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8">
        <div className="flex items-center gap-4 mb-6 cursor-pointer">
          <IoMdArrowRoundBack size={20} className="text-[#ff4d2d] cursor-pointer" onClick={() => navigate('/signin')} />
          <h1 className="text-32xl font-bold text-center text-[#ff4d2d]">
            Forgot Password
          </h1>
        </div>

        {step == 1 && (
          <div>
            {/* email */}

            <div className="mb-4">
              <label
                className="block text-gray-700 font-md mb-1"
                htmlFor="email"
              >
                Email
              </label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="w-full border-[1px] border-gray-200 rounded-lg px-3 py-2 focus:outline-none "
                type="text"
                placeholder="Enter your email"
              />
            </div>

            <button className={`w-full font-semibold py-2 rounded-lg cursor-pointer trasition duration-200 text-white bg-[#ff4d2d] hover:bg-[#e64323] `}
            onClick={handleSendOtp}
        >
        Send Otp
      </button>


          </div>
        )}

        {step == 2 && (
          <div>
            {/* email */}

            <div className="mb-4">
              <label
                className="block text-gray-700 font-md mb-1"
                htmlFor="otp"
              >
                OTP
              </label>
              <input
                onChange={(e) => setOtp(e.target.value)}
                value={otp}
                className="w-full border-[1px] border-gray-200 rounded-lg px-3 py-2 focus:outline-none "
                type="text"
                placeholder="Enter the otp sent to your email"
              />
            </div>

            <button className={`w-full font-semibold py-2 rounded-lg cursor-pointer trasition duration-200 text-white bg-[#ff4d2d] hover:bg-[#e64323] `}
            onClick={handleVerifyOtp}
        >
        Verify
      </button>

      


          </div>
        )}

        {step == 3 && (
          <div>
            

            <div className="mb-4">
              <label
                className="block text-gray-700 font-md mb-1"
                htmlFor="newPassword"
              >
                New Password
              </label>
              <input
                onChange={(e) => setNewPassword(e.target.value)}
                value={newPassword}
                className="w-full border-[1px] border-gray-200 rounded-lg px-3 py-2 focus:outline-none "
                type="text"
                placeholder="Enter new password"
                required
              />
            </div>


            <div className="mb-4">
              <label
                className="block text-gray-700 font-md mb-1"
                htmlFor="confirmNewPassword"
              >
                Confirm New Password
              </label>
              <input
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                value={confirmNewPassword}
                className="w-full border-[1px] border-gray-200 rounded-lg px-3 py-2 focus:outline-none "
                type="text"
                placeholder="Confirm new password"
                required
              />
            </div>

            <button className={`w-full font-semibold py-2 rounded-lg cursor-pointer trasition duration-200 text-white bg-[#ff4d2d] hover:bg-[#e64323] `}
            onClick={handleResetPassword}
        >
        Reset Password
      </button>


          </div>
        )}

        <p className="text-red-500 text-center my-[10px]">{error}</p>
        

      </div>
    </div>
  );
};

export default ForgotPassword;
