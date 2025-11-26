import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoChevronBackSharp } from "react-icons/io5";
import { IoMdSearch } from "react-icons/io";
import { FaLocationDot } from "react-icons/fa6";
import { TbCurrentLocation } from "react-icons/tb";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import { MdDeliveryDining } from "react-icons/md";
import { FaMobileScreenButton } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { FaCreditCard } from "react-icons/fa";
import "leaflet/dist/leaflet.css";
import { setAddress, setLocation } from "../redux/mapSlice.js";
import axios from "axios";
import { serverUrl } from "../App";
import { addMyOrder } from "../redux/userSlice.js";
const apiKey = import.meta.env.VITE_GEO_API_KEY;


// RecenterMap component to update map view
function RecenterMap({ location }) {
  const map = useMap();
  if (location.latitude && location.longitude) {
    map.setView([location.latitude, location.longitude], 16, { animate: true });
  }
  return null;
}

const CheckOut = () => {
  const { location, address } = useSelector((state) => state.map);
  const { cartItems, totalAmount, userData } = useSelector((state) => state.user);
  const [addressInput, setAddressInput] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const deliveryFee = totalAmount > 500 ? 0 : 40;
  const amountwithDelivery = totalAmount + deliveryFee;

  const onDragEnd = (e) => {
    const { lat, lng } = e.target._latlng;
    dispatch(setLocation({ latitude: lat, longitude: lng }));
    getAddressFromCoords({ lat, lng });
  };

  // Change address in input for location
  const getAddressFromCoords = async ({ lat, lng }) => {
    try {
      const result = await axios.get(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&format=json&apiKey=${apiKey}`
      );
      dispatch(setAddress(result.data.results[0].formatted));
    } catch (error) {
      console.log(error);
    }
  };

  const getCurrentLocation = () => {
    const latitude = userData.location.coordinates[1]
    const longitude = userData.location.coordinates[0]
      
      dispatch(setLocation({ latitude, longitude }));
      getAddressFromCoords({ lat: latitude, lng: longitude });
    
  };

  // location search functionality
  const getLatLongFromAddress = async (address) => {
    try {
      // forward geocoding api for searching location from address
      const result = await axios.get(
        `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
          addressInput
        )}&apiKey=${apiKey}`
      );
      console.log(result);
      dispatch(
        setLocation({
          latitude: result.data.features[0].properties.lat,
          longitude: result.data.features[0].properties.lon,
        })
      );
      dispatch(setAddress(result.data.features[0].properties.formatted));
    } catch (error) {
      console.log(error);
    }
  };

  const handlePlaceOrder = async () => {
    try {
      const result = await axios.post(`${serverUrl}/api/order/place-order`,{
        paymentMethod,
        deliveryAddress:{
          text:addressInput,
          latitude:location.latitude,
          longitude:location.longitude
        },
        totalAmount:amountwithDelivery,
        cartItems,
      },{withCredentials:true});

      if(paymentMethod == "cod"){
        dispatch(addMyOrder(result.data.order))
      navigate("/order-placed")
      }

      else{
        const orderId = result.data.orderId
        const razorOrder = result.data.razorOrder
        openRazorpayWindow(orderId, razorOrder)
      }

      
    } catch (error) {
      console.log(error)
    }
  }

  const loadRazorpayScript = () => {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return reject(new Error("window is undefined"));
    if (window.Razorpay) return resolve(true);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error("Failed to load Razorpay script"));
    document.body.appendChild(script);
  });
};

const openRazorpayWindow = async (orderId, razorOrder) => {
  try {
    await loadRazorpayScript();

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: razorOrder.amount, // amount in paise
      currency: "INR",
      name: "Feasty",
      description: "Food Delivery Website",
      order_id: razorOrder.id,
      handler: async function (response) {
        try {
          const result = await axios.post(
            `${serverUrl}/api/order/verify-payment`,
            {
              razorpay_payment_id: response.razorpay_payment_id,
              orderId,
            },
            { withCredentials: true }
          );
          dispatch(addMyOrder(result.data.order));
          navigate("/order-placed");
        } catch (error) {
          console.error("Payment verification error:", error);
        }
      },
      modal: {
        // optional: control behavior on dismiss
        ondismiss: function () {
          console.log("Razorpay modal closed");
        },
      },
    };

    // create instance and open
    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (err) {
    console.error("Failed to open Razorpay window:", err);
    // optionally show toast / user message here
  }
};

  useEffect(() => {
    setAddressInput(address);
  }, [address]);

  return (
    <div className="min-h-screen bg-[#fff9f6] flex items-center justify-center p-6">
      <div
        className="absolute top-[20px] left-[20px] z-[10] cursor-pointer"
        onClick={() => navigate("/cart")}
      >
        <IoChevronBackSharp size={35} className="text-[#ff4d2d]" />
      </div>

      <div className="w-full max-w-[900px] bg-white rounded-2xl shadow-xl p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Checkout</h1>
        <section>
          <h2 className="text-lg font-semibold mb-2 flex items-center text-gray-800 gap-2">
            <FaLocationDot className="text-[#ff4d2d]" /> Delivery Location
          </h2>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              className="flex-1 border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff4d2d]"
              placeholder="Enter your delivery address.."
              value={addressInput || ""}
              onChange={(e) => setAddressInput(e.target.value)}
            />
            <button
              className="bg-[#ff4d2d] hover:bg-[#e64526] text-white px-3 py-2 rounded-lg flex items-center justify-center cursor-pointer"
              onClick={getLatLongFromAddress}
            >
              <IoMdSearch size={17} />
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center justify-center cursor-pointer"
              onClick={getCurrentLocation}
            >
              <TbCurrentLocation size={17} />
            </button>
          </div>

          {/*map*/}

          <div className="rounded-xl border overflow-hidden">
            <div className="h-64 w-full flex items-center justify-center">
              <MapContainer
                className={"w-full h-full"}
                center={[location?.latitude, location?.longitude]}
                zoom={16}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright"></a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <RecenterMap location={location} />
                <Marker
                  position={[location?.latitude, location?.longitude]}
                  draggable={true}
                  eventHandlers={{ dragend: onDragEnd }}
                />
              </MapContainer>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-3 text-gray-800">
            Payment Method
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                paymentMethod === "cod"
                  ? "border-[#ff4d2d] bg-orange-50 shadow"
                  : "border-gray-200 hover:border-gray-300"
              } cursor-pointer`}
              onClick={() => setPaymentMethod("cod")}
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                <MdDeliveryDining className="text-green-600 text-xl" />
              </span>

              <div>
                <p className="font-medium text-gray-800">Cash On Delivery</p>
                <p className="text-xs text-gray-500">
                  Pay with cash upon receiving your order.
                </p>
              </div>
            </div>

            <div
              className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                paymentMethod === "online"
                  ? "border-[#ff4d2d] bg-orange-50 shadow"
                  : "border-gray-200 hover:border-gray-300"
              } cursor-pointer`}
              onClick={() => setPaymentMethod("online")}
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                <FaMobileScreenButton className="text-purple-700 text-lg" />
              </span>
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                <FaCreditCard className="text-blue-700 text-lg" />
              </span>

              <div>
                <p className="font-medium text-gray-800">UPI / Credit / Debit Card</p>
                <p className="text-xs text-gray-500">
                  Pay securely online
                </p>
              </div>

              
            </div>
          </div>
        </section>

        <section>
            <h1 className="text-lg font-semibold mb-3 text-gray-800 ">Order Summary</h1>

            <div className="rounded-xl border bg-gray-50 p-4 space-y-2">
                {cartItems.map((item,index) => (
                    <div key={index} className="flex justify-between items-center"  >
                        <span>{item.name} x {item.quantity}</span>
                        <span>₹ {item.price*item.quantity}</span>
                    </div>
                ))}
                <hr className="border-gray-200 my-2"/>

                <div className="flex justify-between font-medium text-gray-800">
                    <span>Subtotal</span>
                    <span>{totalAmount}</span>
                </div>

                <div className="flex justify-between font-medium text-gray-700">
                    <span>Delvery Fee</span>
                    <span>{deliveryFee == 0 ? "Free" : deliveryFee}</span>
                </div>


                <div className="flex justify-between text-lg font-bold text-[#ff4d2d] pt-2">
                    <span>Total</span>
                    <span>{amountwithDelivery}</span>
                </div>

            </div>
        </section>

        <button className="w-full bg-[#ff4d2d] hover:bg-[#e64526] text-white py-3 rounded-xl font-semibold cursor-pointer"
        onClick={ handlePlaceOrder}
        >{paymentMethod == "cod" ? "Place Order" : "Pay & Place Order"}</button>
      </div>

    </div>
  );
};

export default CheckOut;
