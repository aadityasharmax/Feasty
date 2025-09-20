import express from 'express';
import isAuth from '../middleware/auth.js';
import { addItem, editItem } from '../controllers/item.controllers.js';
import { upload } from '../middleware/multer.js';


const itemRouter = express.Router()

itemRouter.post("/add-item", isAuth, upload.single("image") ,addItem)
itemRouter.post("/edit-item/:itemId", isAuth, upload.single("image") ,editItem)



export default itemRouter;