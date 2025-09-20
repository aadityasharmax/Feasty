import React from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import { serverUrl } from '../App.jsx'
import { useDispatch } from 'react-redux'
import { setMyShopData } from '../redux/ownerSlice.js'

const useGetMyShop = () => {

    const dispatch = useDispatch()
  useEffect(() => {
    const fetchMyShop = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/shop/get-shop`,{withCredentials:true})
            dispatch(setMyShopData(result.data))
            console.log(result)
        } catch (error) {
            console.log(error)
        }
    }

    fetchMyShop();
  },[])
}

export default useGetMyShop