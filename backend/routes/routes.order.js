import express from "express";
import isAuth from "../middleware/auth.js";
import {
  acceptOrder,
  getCurrentOrder,
  getDeliveryBoyAssignment,
  getMyOrders,
  getOrderById,
  placeOrder,
  updateOrderStatus,
} from "../controllers/order.controllers.js";

const orderRoutes = express.Router();

orderRoutes.post("/place-order", isAuth, placeOrder);
orderRoutes.get("/my-orders", isAuth, getMyOrders);
orderRoutes.post("/update-status/:orderId/:shopId", isAuth, updateOrderStatus);
orderRoutes.get("/get-assignments", isAuth, getDeliveryBoyAssignment);
orderRoutes.get("/accept-order/:assignmentId", isAuth, acceptOrder);
orderRoutes.get("/get-current-order", isAuth, getCurrentOrder);
orderRoutes.get("/get-order-by-id/:orderId", isAuth, getOrderById);

export default orderRoutes;
