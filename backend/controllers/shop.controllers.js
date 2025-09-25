import Shop from "../models/shop.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

export const createShopOrEdit = async (req, res) => {
  console.log("Body:", req.body);
    console.log("UserId:", req.userId);
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
        image,
        owner: req.userId,
      },{new:true});
    }

    await shop.populate("owner items");
    console.log("Final Shop Data:", shop);
    return res.status(201).json(shop);
  } catch (error) {
    return res.status(500).json({ message: `Create shop error ${error}` });
  }
};

// cnotroller to get shop 

export const getMyShop = async (req,res) => {
  try {
    const shop = await Shop.findOne({owner:req.userId}).populate("owner").populate({
      path:"items",
      options:{sort:{updatedAt:-1}}
    })

    if(!shop){
      return null;
    }
    
    return res.status(200).json(shop)
  } catch (error) {
    return res.status(500).json({ message: `Get shop error ${error}` });
  }
}

// controller to find shop whose city is same as user city 


export const getShopByCity = async (req,res) => {
  try {
    const {city} = req.params

    const shops = await Shop.find({
      
      city:{$regex: new RegExp(`^${city}$`, "i")} // matches both city user city and current city 
    }).populate("items")

    if(!shops){
      return res.status(400),json({message:"Shop not found"})
    }

    return res.status(200).json(shops)
      } catch (error) {
    return res.status(500).json({ message: `Get shop by city error ${error}` });
  }
}

