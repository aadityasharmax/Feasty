import React from "react";
import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setAdd, setCity, setState } from "../redux/userSlice.js";
import { setAddress, setLocation } from "../redux/mapSlice.js";
import { serverUrl } from "../App.jsx";

function useUpdateLocation() {
    const dispatch = useDispatch();
    const {userData} = useSelector(state => state.user)

    useEffect(() => {
        const updateLocation = async (latitude,longitude) => {
            const result = await axios.post(`${serverUrl}/api/user/update-location`,{latitude,longitude},{withCredentials:true})
            console.log(result.data)
        }       

        navigator.geolocation.watchPosition((pos) => {

            updateLocation(pos.coords.latitude,pos.coords.longitude)
        })
    },[userData])
}

export default useUpdateLocation;
