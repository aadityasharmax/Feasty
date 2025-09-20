import { createSlice } from "@reduxjs/toolkit";

const ownerSlice = createSlice({
    name: "owner",
    initialState : {
        shopData: null,
        shopItems:null
    },
    reducers: {
        setMyShopData: (state, action) => {
            state.userData = action.payload;
        },
        
    }
})


export const {setMyShopData} = ownerSlice.actions;

export default ownerSlice.reducer