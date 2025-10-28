import { createSlice } from "@reduxjs/toolkit";

const mapSlice = createSlice({
  name: "user",
  initialState: {
    location:{
      latitude:null,
      longitude:null
    },

    address:null,


  },
  reducers: {
    setLocation:(state,action) => {
      const {latitude,longitude} = action.payload;
      state.location.latitude = latitude;
      state.location.longitude = longitude;
    },

    setAddress:(state,action) => {
      state.address = action.payload;
    }
  },
});

export const {
  setLocation,
  setAddress,
} = mapSlice.actions;

export default mapSlice.reducer;
