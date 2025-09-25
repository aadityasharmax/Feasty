import React from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import { serverUrl } from '../App.jsx'
import { useDispatch, useSelector } from 'react-redux'
import { setItemsInMyCity} from '../redux/userSlice.js'

const useGetItemsByCity = () => {

    const dispatch = useDispatch()
    const {city} = useSelector(state => state.user)
  useEffect(() => {
    const fetchItems = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/item/get-by-city/${city}`,{withCredentials:true})
            dispatch(setItemsInMyCity(result.data))
            console.log(result.data)
            console.log(result)
        } catch (error) {
            console.log(error)
        }
    }

    fetchItems();
  },[city])
}

export default useGetItemsByCity