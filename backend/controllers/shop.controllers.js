import Shop from "../models/shop.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

export const createShopOrEdit = async (req, res) => {
  try {
    const { shopName, city, state, address, items } = req.body;
    let image;

    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }

    let shop = await Shop.findOne({ owner: req.userId });

    if (!shop) {
      shop = await Shop.create({
        shopName,
        city,
        state,
        address,
        image,
        owner: req.userId,
      });
    }
    else{
        shop = await Shop.findByIdAndUpdate(shop._id,{
        shopName,
        city,
        state,
        address,
        owner: req.userId,
      },{new:true});
    }

    await shop.populate("owner");
    return res.status(201).json(shop);
  } catch (error) {
    return res.status(500).json({ message: `Create shop error ${error}` });
  }
};

// cnotroller to get shop 

export const getMyShop = async (req,res) => {
  try {
    const shop = await Shop.findOne({owner:req.userId}).populate("owner items")

    if(!shop){
      return null;
    }
    
    return res.status(200).json(shop)
  } catch (error) {
    return res.status(500).json({ message: `Get shop error ${error}` });
  }
}

