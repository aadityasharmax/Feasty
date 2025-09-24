import express from 'express';
import isAuth from '../middleware/auth.js';
import { addItem, deleteItem, editItem, getItemById } from '../controllers/item.controllers.js';
import { upload } from '../middleware/multer.js';


const itemRouter = express.Router()

itemRouter.post("/add-item", isAuth, upload.single("image") ,addItem)
itemRouter.post("/edit-item/:itemId", isAuth, upload.single("image") ,editItem)
itemRouter.get("/get-by-id/:itemId", isAuth ,getItemById)
itemRouter.delete("/delete/:itemId",isAuth,deleteItem)




export default itemRouter;