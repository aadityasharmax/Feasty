import React from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setAdd, setCity, setState } from '../redux/userSlice.js'

const useGetCity = () => {

    const dispatch = useDispatch()
    const {userData} = useSelector(state => state.user)
    const apiKey = import.meta.env.VITE_GEO_API_KEY
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const latitude = position.coords.latitude
            const longitude = position.coords.longitude
            const result = await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${apiKey}`)
            dispatch(setCity(result.data.results[0].city));
            dispatch(setState(result.data.results[0].state))
            dispatch(setAdd(result.data.results[0].address_line1 || result.data.results[0].address_line2))
            
        })
    },[userData])
}

export default useGetCity