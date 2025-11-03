import express from 'express';
import isAuth from '../middleware/auth.js';
import { getDeliveryBoyAssignment, getMyOrders, placeOrder, updateOrderStatus } from '../controllers/order.controllers.js';



const orderRoutes = express.Router()

orderRoutes.post("/place-order",isAuth,placeOrder);
orderRoutes.get("/my-orders",isAuth,getMyOrders);
orderRoutes.post("/update-status/:orderId/:shopId",isAuth,updateOrderStatus)
orderRoutes.get("/get-assignments",isAuth,getDeliveryBoyAssignment);




export default orderRoutes;