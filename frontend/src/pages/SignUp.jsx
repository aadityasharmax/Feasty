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

const SignUp = () => {
  const primaryColor = "#ff4d2d";
  const hoverColor = "#e64323";
  const bgColor = "#fff9f6";
  const borderColor = "#ddd";

  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("user"); 
  const[fullName, setFullName] = useState("");
  const[email, setEmail] = useState("");
  const[mobile, setMobile] = useState("");
  const[password, setPassword] = useState("");  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async () => {
    setLoading(true)
    try {   
        const result = await axios.post(`${serverUrl}/api/auth/signup`,{
            fullName, email, mobile, password, role
        },{withCredentials: true});
        console.log(result)
        setError("")
        setLoading(false)
        navigate('/signin')

        
    } catch (error) {
        setError(error.response.data.message);
    }
  }

const handleGoogleAuth = async () => {

    if(!mobile){
        setError("Please enter your mobile number")
        alert("Please enter your mobile number")
    }

    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider)
    try {
      const axiosResult = await axios.post(`${serverUrl}/api/auth/googleauth`,{
        fullName: result.user.displayName, 
        email: result.user.email, 
        mobile, 
        role
    },{withCredentials: true});
    setError("")
    // navigate('/')
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
          Create your account to get started with delicious food deliveries
        </p>

        {/* fullName */}

        <div className="mb-4">
          <label
            className="block text-gray-700 font-md mb-1"
            htmlFor="fullName"
          >
            Full Name
          </label>
          <input
            onChange={(e) => setFullName(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none "
            type="text"
            placeholder="Enter your full name"
            style={{ border: `1px solid ${borderColor}` }}
            value={fullName}
            required
          />
        </div>

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

        {/* mobile */}

        <div className="mb-4">
          <label className="block text-gray-700 font-md mb-1" htmlFor="mobile">
            Mobile
          </label>
          <input
            onChange={(e) => setMobile(e.target.value)}
            value={mobile}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none "
            type="text"
            placeholder="Enter your Mobile Number"
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
              placeholder="Create your Password"
              style={{ border: `1px solid ${borderColor}` }}
              required
              />

          <button className="absolute right-3 top-[14px] text-gray-500 cursor-pointer" onClick={() => {
            setShowPassword(!showPassword)
          }}>{!showPassword? <FaRegEye /> : <FaRegEyeSlash /> }</button>
          </div>
        </div>



        {/* role */}

        <div className="mb-4">
          <label
            className="block text-gray-700 font-md mb-1"
            htmlFor="role"
          >
            Role
          </label>
          <div className="flex gap-2">
            {["user","owner","deliveryBoy"].map((r) => (
                <button className="flex-1 border rounded-lg px-3 py-2 text-center font-medium transition-colors cursor-pointer" 
                onClick={() => setRole(r)} 
                
                style={
                    role == r ? {backgroundColor: primaryColor, color: "white", border: `1px solid ${primaryColor}`} : {border: `1px solid ${borderColor}`, color: `${primaryColor}`}
                } >{r}</button>
            ))}
          </div>
        </div>

        {/* sign Up button */}
        <button className={`w-full font-semibold py-2 rounded-lg cursor-pointer trasition duration-200 text-white bg-[#ff4d2d] hover:bg-[#e64323] `}
        onClick={handleSignUp} 
        disabled={loading}
        >
          {loading ? <ClipLoader size={20} color="white" /> : "SignUp"}
      </button>

      <p className="text-red-500 text-center my-[10px]">{error}</p>

      <button className="w-full mt-4 flex items-center justify-center gap-2 border border-gray-200 rounded-lg px-3 py-2 text-center font-medium transition-colors cursor-pointer hover:bg-gray-100"
      onClick={handleGoogleAuth}
      >
        <FcGoogle size={20}/>
        <span>Sign Up with Google</span>
        
        </button>

        <p className="text-center mt-2" >Already have an account ? <span className="text-[#ff4d2d] cursor-pointer" onClick={() => navigate("/signin")}>Sign In</span></p>
      </div>


      
    </div>
  );
};

export default SignUp;
