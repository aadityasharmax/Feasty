import React from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import { serverUrl } from '../App.jsx'
import { useDispatch, useSelector } from 'react-redux'
import { setShopsInMyCity, setUserData } from '../redux/userSlice.js'

const useGetShopByCity = () => {

    const dispatch = useDispatch()
    const {city} = useSelector(state => state.user)
  useEffect(() => {
    const fetchShop = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/shop/get-by-city/${city}`,{withCredentials:true})
            dispatch(setShopsInMyCity(result.data))
            console.log(result.data)
            console.log(result)
        } catch (error) {
            console.log(error)
        }
    }

    fetchShop();
  },[city])
}

export default useGetShopByCity

