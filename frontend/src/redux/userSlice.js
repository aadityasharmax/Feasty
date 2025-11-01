import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    city: null,
    state: null,
    currentAdd: null,
    shopsInMyCity: null,
    itemsInMyCity: null,
    cartItems: [],
    totalAmount:0,
    myOrders:[],
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    setCity: (state, action) => {
      state.city = action.payload;
    },
    setState: (state, action) => {
      state.state = action.payload;
    },
    setAdd: (state, action) => {
      state.currentAdd = action.payload;
    },
    setShopsInMyCity: (state, action) => {
      state.shopsInMyCity = action.payload;
    },
    setItemsInMyCity: (state, action) => {
      state.itemsInMyCity = action.payload;
    },
    addToCart: (state, action) => {
      const cartItem = action.payload;
      const existingItem = state.cartItems.find(
        (item) => item.id == cartItem.id
      );

      if (existingItem) {
        existingItem.quantity += cartItem.quantity;
      } else {
        state.cartItems.push(cartItem);
      }

      state.totalAmount = state.cartItems.reduce((sum,i) => sum + i.price * i.quantity,0)
    },

    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.cartItems.find((item) => item.id == id);
      if (item) {
        item.quantity = quantity;
      }
      state.totalAmount = state.cartItems.reduce((sum,i) => sum + i.price * i.quantity,0)
    },

    removeItemFromCart: (state, action) => {
      const id = action.payload;
      state.cartItems = state.cartItems.filter((item) => item.id != id);
      state.totalAmount = state.cartItems.reduce((sum,i) => sum + i.price * i.quantity,0)
    },
    setMyOrders:(state,action) => {
      state.myOrders = action.payload
    },
    addMyOrder:(state,action) => {
      state.myOrders = [action.payload,...state.myOrders]
    },

    updateOrderStatus:(state,action) => {
      const {orderId, shopId, status} = action.payload
      const order = state.myOrders.find(o => o.id == orderId)
      if(order){
        if(order.shopOrders && order.shopOrders.shop._id == shopId){
          order.shopOrders.status = status
        }
      }
    }
  },
});

export const {
  setUserData,
  setCity,
  setState,
  setAdd,
  setShopsInMyCity,
  setItemsInMyCity,
  addToCart,
  updateQuantity,
  removeItemFromCart,
  setMyOrders,
  addMyOrder,
  updateOrderStatus
  
} = userSlice.actions;

export default userSlice.reducer;
