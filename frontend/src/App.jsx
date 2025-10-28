import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import ForgotPassword from './pages/ForgotPassword'
import useGetCurrentUser from './hooks/useGetCurrentUser'
import { useSelector } from 'react-redux'
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
export const serverUrl = "http://localhost:3000"

const App = () => {
  
  useGetShopByCity()
  useGetCurrentUser()
  useGetCity()
  useGetMyShop()
  useGetItemsByCity()
  const {userData} = useSelector(state => state.user)
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

      {/* // element={userData?<AddItem/>:<Navigate to={"/signin"}/> */}

    
    </Routes>
  )
}

export default App