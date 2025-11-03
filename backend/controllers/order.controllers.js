import DeliveryAssignment from "../models/deliveryAssignment.model.js";
import Order from "../models/order.model.js";
import Shop from "../models/shop.model.js";
import User from "../models/user.model.js";

export const placeOrder = async (req, res) => {
  try {
    const { cartItems, paymentMethod, deliveryAddress, totalAmount } = req.body;

    // empty cart check
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // delivery address check
    if (
      !deliveryAddress.text ||
      !deliveryAddress.latitude ||
      !deliveryAddress.longitude
    ) {
      return res
        .status(400)
        .json({ message: "Delivery address is incomplete" });
    }

    const groupItemsByShop = {};

    cartItems.forEach((item) => {
      const shopId = item.shop;
      if (!groupItemsByShop[shopId]) {
        groupItemsByShop[shopId] = [];
      }

      groupItemsByShop[shopId].push(item);
    });

    const shopOrders = await Promise.all(
      Object.keys(groupItemsByShop).map(async (shopId) => {
        const shop = await Shop.findById(shopId).populate("owner");
        if (!shop) {
          return res
            .status(404)
            .json({ message: `Shop with id ${shopId} not found` });
        }

        const items = groupItemsByShop[shopId];

        const subTotal = items.reduce(
          (acc, item) => acc + Number(item.price) * Number(item.quantity),
          0
        );

        return {
          shop: shop._id,
          owner: shop.owner._id,
          subTotal,
          shopOrderItems: items.map((item) => ({
            item: item.id,
            price: item.price,
            quantity: item.quantity,
            name: item.name,
          })),
        };
      })
    );

    const newOrder = new Order({
      user: req.userId,
      paymentMethod,
      deliveryAddress,
      totalAmount,
      shopOrders,
    })

    await newOrder.populate("shopOrders.shopOrderItems.item", "name image price")
    await newOrder.populate("shopOrders.shop", "shopName")

    const savedOrder = await newOrder.save();
    return res
      .status(201)
      .json({ message: "Order placed successfully", order: savedOrder });
  } catch (error) {
    return res.status(500).json({ message: `Place order error ${error}` });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role == "user") {
      const orders = await Order.find({ user: req.userId })
        .sort({ createdAt: -1 })
        .populate("shopOrders.shop")
        .populate("shopOrders.owner", "name email mobile")
        .populate("shopOrders.shopOrderItems.item", "name image price");

      return res.status(200).json(orders);
    } else if (user.role == "owner") {
      const orders = await Order.find({ "shopOrders.owner": req.userId })
        .sort({ createdAt: -1 })
        .populate("shopOrders.shop")
        .populate("user")
        .populate("shopOrders.shopOrderItems.item", "name image price");


        const filteredOrder = orders.map((order) => ({
          id: order._id,
          payentMethod: order.paymentMethod,
          user:order.user,
          deliveryAddress: order.deliveryAddress,
          shopOrders: order.shopOrders.find(o => o.owner._id == req.userId),
          createdAt: order.createdAt
        }))

        console.log(orders)

      return res.status(200).json(filteredOrder);
    }
  } catch (error) {
    return res.status(500).json({ message: `Get user order error ${error}` });
  }
};


export const updateOrderStatus = async (req,res) => {
  try {
    const {orderId,shopId} = req.params;
    const {status} = req.body;

    if (!orderId || !shopId) {
      return res.status(400).json({ message: "orderId and shopId are required" });
    }

    const order = await Order.findById(orderId)

    if (!order) return res.status(404).json({ message: "Order not found" });

    const shopOrder =  order.shopOrders.find(o => o.shop == shopId)

    if(!shopOrder){
      return res.status(400).json({message:"Shop order not found"})
    }

    shopOrder.status = status

    let deliveryBoysPayload = []
    if (status == "out for delivery" && !shopOrder.assignment) {
      const {longitude,latitude} = order.deliveryAddress

      // finding delivery boys within 5 km 

      const nearByRider = await User.find({
        role:"deliveryBoy",
        location:{
          $near:{
            $geometry:{
              type:"Point",
              coordinates: [longitude, latitude]
            },
            $maxDistance:5000
          }
        }
      })

      const nearByIds = nearByRider.map(b => b._id)

      const busyIds = await DeliveryAssignment.find({
  assignedTo: { $in: nearByIds },
  status: { $nin: ["broadcasted", "completed"] }
}).distinct("assignedTo")

const busyIdsSet = new Set(busyIds.map(id => String(id)))

const availableRider = nearByRider.filter(b => !busyIdsSet.has(String(b._id)))

      const candidates = availableRider.map(b => b._id)

      if(candidates.length == 0){
        await Order.save()
        return res.json({message: "Order status updated but no available delivery boy"}) 
      }

       const deliveryAssignment = await DeliveryAssignment.create({
        order:order._id,
        shop:shopOrder.shop,
        shopOrderId : shopOrder._id,
        broadcastedTo:candidates,
        status:"broadcasted",
      })

      shopOrder.assignedDeliveryBoy = deliveryAssignment.assignedTo
      shopOrder.assignment = deliveryAssignment._id

      deliveryBoysPayload = availableRider.map(b => ({
        id : b._id,
        fullName : b.fullName,
        longitude: b.location.coordinates?.[0],
        latitude: b.location.coordinates?.[1],
        mobile : b.mobile,


      }))






    }

    // delivery assignment
    await shopOrder.save()
    await order.save()

    const updatedShopOrder = order.shopOrders.find(o => o.shop == shopId)

    await order.populate("shopOrders.shop","shopName")

     await order.populate("shopOrders.assignedDeliveryBoy","fullName email mobile")

     



    // await shopOrder.populate("shopOrderItems.item","name image price")

    return res.status(200).json({
      shopOrder:updatedShopOrder,
      assignedDeliveryBoy:updatedShopOrder?.assignedDeliveryBoy,
      availableBoys:deliveryBoysPayload,
      assignment: updatedShopOrder?.assignment

    })


  } catch (error) {
    return res.status(500).json({ message: `update status error ${error}` });
  }
}

export const getDeliveryBoyAssignment = async (req,res) => {
  try {
    const deliveryBoyId = req.userId
    const assignments = await DeliveryAssignment.find({
      broadcastedTo:deliveryBoyId,
      status:"broadcasted"

    }) .populate("order")
    .populate("shop")

    const formatted = assignments.map(a => ({
      assignmentId:a._id,
      orderId : a.order._id,
      shopName : a.shop.shopName,
      deliveryAddress: a.order.deliveryAddress,
      items:a.order.shopOrders.find(so => so._id.equals(a.shopOrderId) ).shopOrderItems || [],
      subTotal : a.order.shopOrders.find(so => so._id.equals(a.shopOrderId))?.subTotal
    }))

    return res.status(200).json(formatted)
  } catch (error) {
    return res.status(500).json({ message: `get delivery boy assignment error ${error}` });
  }
}


