import mongoose from "mongoose";

// Shop order item schema

const shopOrderItemSchema = new mongoose.Schema(
  {
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },

    name:{
      type:String,
      required:true
    },

    price: {
      type: Number,
    },
    quantity: {
      type: Number,
    },
  },
  { timestamps: true }
);

//Shop oder schema

const shopOrderSchema = new mongoose.Schema(
  {
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subTotal: {
      type: Number,
      required: true,
    },
    shopOrderItems: [shopOrderItemSchema],
    status:{
      type:String,
      enum:["pending","preparing","on the way","delivered","cancelled"],
      default:"pending"
      
    },

    assignment:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"DeliveryAssignment",
      default:null
    }


  },
  { timestamps: true }
);

// Order Schema

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["cod", "online"],
      required: true,
    },
    deliveryAddress: {
      text: String,
      latitude: Number,
      longitude: Number,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    shopOrders: [shopOrderSchema],
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

// const ShopOrder = mongoose.model("ShopOrder", shopOrderSchema);

// const ShopOrderItem = mongoose.model("ShopOrderItem", shopOrderItemSchema);

export default Order;
