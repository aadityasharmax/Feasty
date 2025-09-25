import express from 'express';
import { createShopOrEdit, getMyShop, getShopByCity } from '../controllers/shop.controllers.js';
import isAuth from '../middleware/auth.js';
import { upload } from '../middleware/multer.js';


const shopRoutes = express.Router()

shopRoutes.post("/create-edit", isAuth, upload.single("image") ,createShopOrEdit)
shopRoutes.get("/get-shop", isAuth, getMyShop)
shopRoutes.get("/get-by-city/:city", isAuth, getShopByCity)




export default shopRoutes;