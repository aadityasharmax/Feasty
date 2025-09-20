import express from 'express';
import { createShopOrEdit } from '../controllers/shop.controllers.js';
import isAuth from '../middleware/auth.js';
import { upload } from '../middleware/multer.js';


const shopRoutes = express.Router()

userRouter.post("/create-edit", isAuth, upload.single("image") ,createShopOrEdit)



export default shopRoutes;