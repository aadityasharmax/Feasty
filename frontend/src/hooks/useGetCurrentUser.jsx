import React from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import { serverUrl } from '../App.jsx'

const useGetCurrentUser = () => {
  useEffect(() => {
    const fetchUser = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/user/current`,{withCredentials:true})
            console.log(result)
        } catch (error) {
            console.log(error)
        }
    }

    fetchUser();
  },[])
}

export default useGetCurrentUser