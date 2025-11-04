import React from 'react'
import { useSelector } from 'react-redux'
import UserDashboard from '../components/UserDashboard'
import OwnerDashboard from '../components/OwnerDashboard'
import DeliveryBoyDashboard from '../components/DeliveryBoyDashboard'

const Home = () => {
    const {userData} = useSelector(state => state.user)
  return (
    <div className='w-[100vw] min-h-[100vh] pt-[80px] flex flex-col items-center bg-#e2e2e2 ' >
        {userData.role === "user" && <UserDashboard/> }
        {userData.role === "owner" && <OwnerDashboard/> }
        {userData.role === "deliveryBoy" && <DeliveryBoyDashboard/> }
    </div>
  )
}

export default Home