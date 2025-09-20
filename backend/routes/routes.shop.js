import express from 'express';
import { createShopOrEdit, getMyShop } from '../controllers/shop.controllers.js';
import isAuth from '../middleware/auth.js';
import { upload } from '../middleware/multer.js';


const shopRoutes = express.Router()

shopRoutes.post("/create-edit", isAuth, upload.single("image") ,createShopOrEdit)
shopRoutes.get("/get-shop", isAuth, getMyShop)



export default shopRoutes;