import {useState}  from "react";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase.js"
import {ClipLoader} from "react-spinners"
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice.js";

const SignIn = () => {
  const primaryColor = "#ff4d2d";
  const hoverColor = "#e64323";
  const bgColor = "#fff9f6";
  const borderColor = "#ddd";

  const [showPassword, setShowPassword] = useState(false);
  const[email, setEmail] = useState("");
  const[password, setPassword] = useState("");  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignIn = async () => {
    setLoading(true)
    try {   
        const result = await axios.post(`${serverUrl}/api/auth/signin`,{
         email, password
        },{withCredentials: true});
        setLoading(false)
        setError("")  
        dispatch(setUserData(result.data.user))
        navigate('/')
    } catch (error) {
      setError(error.response.data.message);
      setLoading(false)
    }
  }


  const handleGoogleAuth = async () => {

  
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      try {
        const axiosResult = await axios.post(`${serverUrl}/api/auth/googleauth`,{
          email: result.user.email, 
      },{withCredentials: true});
      dispatch(setUserData(axiosResult.data.user))
      setError("")
      navigate('/')
      } catch (error) {
        setError(error.response.data.message);
      }
  }

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4"
      style={{ backgroundColor: bgColor }}
    >
      <div
        className={`bg-white rounded-xl shadow-lg w-full max-w-md p-8 border-[1px] `}
        style={{ borderColor: borderColor }}
      >
        <h1
          className={`text-3xl font-bold mb-2 `}
          style={{ color: primaryColor }}
        >
          Feasty
        </h1>

        <p className="text-gray-600 mb-8">
          SignIn to your account to get started with delicious food deliveries
        </p>

        {/* email */}

        <div className="mb-4">
          <label className="block text-gray-700 font-md mb-1" htmlFor="email">
            Email
          </label>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none"
            type="text"
            placeholder="Enter your email"
            style={{ border: `1px solid ${borderColor}` }}
            required
          />
        </div>

        {/* password */}

        <div className="mb-4">
          <label
            className="block text-gray-700 font-md mb-1"
            htmlFor="password"
          >
            Password
          </label>
          <div className="relative">
            <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none "
              type={`${showPassword ? "text" : "password"}`}
              placeholder="Enter your password"
              style={{ border: `1px solid ${borderColor}` }}
              required
              />

          <button className="absolute right-3 top-[14px] text-gray-500 cursor-pointer" onClick={() => {
            setShowPassword(!showPassword)
          }}>{!showPassword? <FaRegEye /> : <FaRegEyeSlash /> }</button>
          </div>
        </div>

          {/* forgotpassword */}

          <div className="text-right text-sm text-[#ff4d2d] font-semibold mb-6 cursor-pointer" onClick={() => navigate("/forgotpassword")}>
            Forgot Password
          </div>


        {/* sign Up button */}
        <button className={`w-full font-semibold py-2 rounded-lg cursor-pointer trasition duration-200 text-white bg-[#ff4d2d] hover:bg-[#e64323] `}
        onClick={handleSignIn}
        disabled={loading}
        >
        {loading ? <ClipLoader size={20} color="white" /> : "SignIn"}
      </button>

      <p className="text-red-500 text-center my-[10px]">{error}</p>

      <button className="w-full mt-4 flex items-center justify-center gap-2 border border-gray-200 rounded-lg px-3 py-2 text-center font-medium transition-colors cursor-pointer hover:bg-gray-100"
      onClick={handleGoogleAuth}
      >
        <FcGoogle size={20}/>
        <span>Sign In with Google</span>
        
        </button>

        <p className="text-center mt-2" >Want to create a new account ? <span className="text-[#ff4d2d] cursor-pointer" onClick={() => navigate("/signup")}>Sign In</span></p>
      </div>


      
    </div>
  );
};

export default SignIn;
