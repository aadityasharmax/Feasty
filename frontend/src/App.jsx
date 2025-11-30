import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import ForgotPassword from './pages/ForgotPassword'
import useGetCurrentUser from './hooks/useGetCurrentUser'
import { useDispatch, useSelector } from 'react-redux'
import Home from './pages/Home'
import useGetCity from './hooks/useGetCity'
import useGetMyShop from './hooks/useGetMyShop'
import CreateEditShop from './pages/CreateEditShop'
import OwnerDashboard from './components/OwnerDashboard'
import AddItem from "../src/pages/AddItem.jsx"
import EditItem from './pages/EditItem.jsx'
import useGetShopByCity from './hooks/useGetShopByCity.jsx'
import useGetItemsByCity from './hooks/useGetItemsByCity.jsx'
import CartPage from './pages/CartPage.jsx'
import CheckOut from './pages/CheckOut.jsx'
import OrderPlaced from './pages/OrderPlaced.jsx'
import MyOrders from './pages/MyOrders.jsx'
import useGetMyOrders from './hooks/useGetMyOrders.jsx'
import useUpdateLocation from './hooks/useUpdateLocation.jsx'
import TrackOrderPage from './pages/TrackOrderPage.jsx'
import Shop from './pages/Shop.jsx'
export const serverUrl = "http://localhost:3000"
import { io } from 'socket.io-client'
import { setSocket } from './redux/userSlice.js'


import { useEffect } from 'react'


const App = () => {
  
  useGetShopByCity()
  useGetCurrentUser()
  useGetCity()
  useGetMyShop()
  useGetItemsByCity()
  useGetMyOrders()
  useUpdateLocation()
  const {userData} = useSelector(state => state.user)
  const dispatch = useDispatch()

  useEffect(() => {
   const socketInstance =  io(serverUrl,{withCredentials:true})
   dispatch(setSocket(socketInstance))
   socketInstance.on('connect',() => {
    if(userData){
      socketInstance.emit('identity',{userId:userData._id})
    }
   })

   return () => {
    socketInstance.disconnect()
   }
  },[userData?._id])
  return (
    <Routes>
      <Route path='/signup' element={!userData?<SignUp/>:<Navigate to={"/"} />} />
      <Route path='/signin' element={!userData ? <SignIn/> : <Navigate to={"/"}/>} />
      <Route path='/forgotpassword' element={!userData ? <ForgotPassword/>: <Navigate to={"/"}/>} />
      <Route path='/' element={userData?<Home/>:<Navigate to={"/signin"}/>} />
      <Route path='/create-edit-shop' element={<CreateEditShop/>}/>
      <Route path='/add-food' element={<AddItem/>}/>
      <Route path='/edit-item/:itemId' element={<EditItem/>}/>
      <Route path='/cart' element={userData ?  <CartPage/> : <Navigate to={"/signin"} /> }/>
      <Route path='/checkout' element={userData ?  <CheckOut/> : <Navigate to={"/signin"} /> }/>
      <Route path='/order-placed' element={userData ?  <OrderPlaced/> : <Navigate to={"/signin"} /> }/>
      <Route path='/my-orders' element={userData ?  <MyOrders/> : <Navigate to={"/signin"} /> }/>
      <Route path='/track-order/:orderId' element={userData ?  <TrackOrderPage/> : <Navigate to={"/signin"} /> }/>
      <Route path='/shop/:shopId' element={userData ?  <Shop/> : <Navigate to={"/signin"} /> }/>

      {/* // element={userData?<AddItem/>:<Navigate to={"/signin"}/> */}

    
    </Routes>
  )
}

export default App