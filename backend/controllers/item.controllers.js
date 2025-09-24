import Item from "../models/items.model.js";
import Shop from "../models/shop.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

export const addItem = async (req, res) => {
  try {
    const { name, category, foodType, price } = req.body;

    let image;

    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }
    const shop = await Shop.findOne({ owner: req.userId })
    if (!shop) {
      res.status(400).json({ message: "Shop not found" });
    }

  
    const item = await Item.create({
      name,
      category,
      foodType,
      price,
      image,
      shop: shop._id,
    });

    shop.items.push(item._id)
    await shop.save()
    await shop.populate("owner")
    
    await shop.populate({
      path:"items",
      options:{sort:{updatedAt:-1}}
    })


    return res.status(201).json(shop);
  } catch (error) {
    res.status(500).json({ message: `Item create error ${error}` });
  }
};


// Edit item 

export const editItem = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const { name, category, foodType, price } = req.body;

    let image;

    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }

    const item = await Item.findByIdAndUpdate(
      itemId,
      {
        name,
        category,
        foodType,
        price,
        image,
      },
      { new: true }
    );

    if (!item) {
      res.status(400).json({ message: "Item not found" });
    }

    const shop = await Shop.findOne({owner:req.userId}).populate({
      path:"items",
      options:{sort:{updatedAt:-1}}
    })
    return res.status(200).json(shop)
  } catch (error) {
    res.status(500).json({ message: `Item edit error ${error}` });
  }
};

export const getItemById = async (req,res) => {
  try {
    const itemId = req.params.itemId;

    const item = await Item.findById(itemId)
    if(!item){
      return res.status(400).json({message:`Item not found error at getItemById`})
    }

    return res.status(200).json(item)

  } catch (error) {
     res.status(500).json({ message: `Get item By id error ${error}` });
  }
} 

export const deleteItem = async (req,res) => {
  try {
    const itemId = req.params.itemId
    const item = await Item.findByIdAndDelete(itemId)
    if(!item){
      return res.status(400).json({message:`Item not found`})
    }

    const shop = await Shop.findOne({owner:req.userId})
    shop.items = shop.items.filter(i => i.toString() !== item._id.toString());
    await shop.save()
    await shop.populate("items")
    await shop.populate({
      path:"items",
      options:{sort:{updatedAt:-1}}
    })

    return res.status(200).json(shop)

  } catch (error) {
    res.status(500).json({ message: `Delete item error ${error}` });
  }
}
