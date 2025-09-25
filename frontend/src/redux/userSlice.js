import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState : {
        userData: null,
        city:null,
        state:null,
        currentAdd:null,
        shopsInMyCity:null,
        itemsInMyCity:null

    },
    reducers: {
        setUserData: (state, action) => {
            state.userData = action.payload;
        },
        setCity: (state,action) => {
            state.city = action.payload
        },
        setState: (state,action) => {
            state.state = action.payload
        },
        setAdd: (state,action) => {
            state.currentAdd = action.payload
        },
        setShopsInMyCity: (state,action) => {
            state.shopsInMyCity = action.payload
        },
        setItemsInMyCity: (state,action) => {
            state.itemsInMyCity = action.payload
        }




    }
})


export const {setUserData , setCity , setState, setAdd,setShopsInMyCity,setItemsInMyCity} = userSlice.actions;

export default userSlice.reducer