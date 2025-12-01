import DeliveryAssignment from "../models/deliveryAssignment.model.js";
import Order from "../models/order.model.js";
import Shop from "../models/shop.model.js";
import User from "../models/user.model.js";
import { sendDeliveryOtpMail } from "../utils/mail.js";
import Razorpay from "razorpay"
import dotenv from "dotenv"

dotenv.config()

let instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

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

    if(paymentMethod == "online"){
      const razorOrder = await instance.orders.create({
        amount:Math.round(totalAmount*100),
        currency:'INR',
        receipt:`receipt_${Date.now()}`
      })
      const newOrder = new Order({
      user: req.userId,
      paymentMethod,
      deliveryAddress,
      totalAmount,
      shopOrders,
      razorpayOrderId:razorOrder.id,
      payment:false
    })

    const savedOrder = await newOrder.save();


    return res.status(200).json({
      razorOrder,
      orderId : savedOrder._id,

    })


    }


    // cod payment 


    const newOrder =  new Order({
      user: req.userId,
      paymentMethod,
      deliveryAddress,
      totalAmount,
      shopOrders,
    });

    await newOrder.populate(
      "shopOrders.shopOrderItems.item",
      "name image price"
    );
    await newOrder.populate("shopOrders.shop", "shopName");
    await newOrder.populate("shopOrders.owner", "fullName socketId")
    await newOrder.populate("user", "fullName email mobile")

    const io = req.app.get('io')

    if(io){
      newOrder.shopOrders.forEach(shopOrder => {
        const ownerSocketId = shopOrder.owner.socketId
        if(ownerSocketId){
          io.to(ownerSocketId).emit('newOrder',{
              _id:newOrder._id,
              paymentMethod:newOrder.paymentMethod,
              user:newOrder.user,
              shopOrders:shopOrder,
              createdAt:newOrder.createdAt,
              deliveryAddress:newOrder.deliveryAddress,
              payment:newOrder.payment          
          })
        }
      })
    }



    const savedOrder = await newOrder.save();
    return res
      .status(201)
      .json({ message: "Order placed successfully", order: savedOrder });
  } catch (error) {
    return res.status(500).json({ message: `Place order error ${error}` });
  }
};


export const verifyPayment = async(req,res) => {
  try {
    const {razorpay_payment_id, orderId} = req.body;
    const payment = await instance.payments.fetch(razorpay_payment_id)
    if(!payment || payment.status != "captured"){
      return res.status(400).json({message:"payment not captured"})
    }

    const order = await Order.findById(orderId);
    if(!order){
       return res.status(400).json({message:"order not found"})
    }

    order.payment = true
    order.razorpayPaymentId = razorpay_payment_id
    await order.save()

    await order.populate(
      "shopOrders.shopOrderItems.item",
      "name image price"
    );
    await order.populate("shopOrders.shop", "shopName");
    await order.populate("shopOrders.owner", "fullName socketId")
    await order.populate("user", "fullName email mobile")

    const io = req.app.get('io')

    if(io){
      order.shopOrders.forEach(shopOrder => {
        const ownerSocketId = shopOrder.owner.socketId
        if(ownerSocketId){
          io.to(ownerSocketId).emit('newOrder',{
              _id:order._id,
              paymentMethod:order.paymentMethod,
              user:order.user,
              shopOrders:shopOrder,
              createdAt:order.createdAt,
              deliveryAddress:order.deliveryAddress,
              payment:order.payment          
          })
        }
      })
    }


    return res.status(200).json(order)

  } catch (error) {
    return res.status(500).json({ message: `Verify payment error${error}` });
  }
}


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
        .populate("shopOrders.shopOrderItems.item", "name image price")
        .populate("shopOrders.assignedDeliveryBoy", "fullName mobile");

      const filteredOrder = orders.map((order) => ({
        id: order._id,
        paymentMethod: order.paymentMethod,
        user: order.user,
        deliveryAddress: order.deliveryAddress,
        shopOrders: order.shopOrders.find((o) => o.owner._id == req.userId),
        createdAt: order.createdAt,
        payment:order.payment
      }));

      console.log(orders);

      return res.status(200).json(filteredOrder);
    }
  } catch (error) {
    return res.status(500).json({ message: `Get user order error ${error}` });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, shopId } = req.params;
    const { status } = req.body;

    if (!orderId || !shopId) {
      return res
        .status(400)
        .json({ message: "orderId and shopId are required" });
    }

    const order = await Order.findById(orderId);

    if (!order) return res.status(404).json({ message: "Order not found" });

    const shopOrder = order.shopOrders.find((o) => o.shop == shopId);

    if (!shopOrder) {
      return res.status(400).json({ message: "Shop order not found" });
    }

    shopOrder.status = status;

    let deliveryBoysPayload = [];
    if (status == "out for delivery" && !shopOrder.assignment) {
      const { longitude, latitude } = order.deliveryAddress;

      // finding delivery boys within 5 km

      const nearByRider = await User.find({
        role: "deliveryBoy",
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [longitude, latitude],
            },
            $maxDistance: 5000,
          },
        },
      });

      const nearByIds = nearByRider.map((b) => b._id);

      const busyIds = await DeliveryAssignment.find({
        assignedTo: { $in: nearByIds },
        status: { $nin: ["broadcasted", "completed"] },
      }).distinct("assignedTo");

      const busyIdsSet = new Set(busyIds.map((id) => String(id)));

      const availableRider = nearByRider.filter(
        (b) => !busyIdsSet.has(String(b._id))
      );

      const candidates = availableRider.map((b) => b._id);

      if (candidates.length == 0) {
        await Order.save();
        return res.json({
          message: "Order status updated but no available delivery boy",
        });
      }

      const deliveryAssignment = await DeliveryAssignment.create({
        order: order._id,
        shop: shopOrder.shop,
        shopOrderId: shopOrder._id,
        broadcastedTo: candidates,
        status: "broadcasted",
      })

      await deliveryAssignment.populate('order')
      await deliveryAssignment.populate('shop')

      shopOrder.assignedDeliveryBoy = deliveryAssignment.assignedTo;
      shopOrder.assignment = deliveryAssignment._id;

      deliveryBoysPayload = availableRider.map((b) => ({
        id: b._id,
        fullName: b.fullName,
        longitude: b.location.coordinates?.[0],
        latitude: b.location.coordinates?.[1],
        mobile: b.mobile,
      }))

      const io = req.app.get('io')

      if(io){
        availableRider.forEach(boy => {
          const boySocketId = boy.socketId
          if(boySocketId){
            io.to(boySocketId).emit('newAssignment',{
              sentTo:boy._id,
              assignmentId:deliveryAssignment._id,
              orderId:deliveryAssignment.order._id,
              shopName:deliveryAssignment.shop.shopName,
              deliveryAddress:deliveryAssignment.order.deliveryAddress,
              items:deliveryAssignment.order.shopOrders.find(so => so._id.equals(deliveryAssignment.shopOrderId)).shopOrderItems || [],
              subTotal:deliveryAssignment.order.shopOrders.find(so => so._id.equals(deliveryAssignment.shopOrderId)).subTotal
            })
          }
        })
      }
    }

    // delivery assignment
    await shopOrder.save();
    await order.save();

    const updatedShopOrder = order.shopOrders.find(o => o.shop == shopId);

    await order.populate("shopOrders.shop", "shopName");

    await order.populate(
      "shopOrders.assignedDeliveryBoy",
      "fullName email mobile"
    )

    await order.populate("user", "socketId")

    const io = req.app.get('io')

    if(io){
      const userSocketId = order.user.socketId
      if(userSocketId){
        io.to(userSocketId).emit('update-status',{
          orderId:order._id,
          shopId:updatedShopOrder.shop._id,
          status:updatedShopOrder.status,
          userId:order.user._id
        })
      }
    }



    // await shopOrder.populate("shopOrderItems.item","name image price")

    return res.status(200).json({
      shopOrder: updatedShopOrder,
      assignedDeliveryBoy: updatedShopOrder?.assignedDeliveryBoy,
      availableBoys: deliveryBoysPayload,
      assignment: updatedShopOrder?.assignment,
    });
  } catch (error) {
    return res.status(500).json({ message: `update status error ${error}` });
  }
};

export const getDeliveryBoyAssignment = async (req, res) => {
  try {
    const deliveryBoyId = req.userId;
    const assignments = await DeliveryAssignment.find({
      broadcastedTo: deliveryBoyId,
      status: "broadcasted",
    })
      .populate("order")
      .populate("shop");

    const formatted = assignments.map((a) => ({
      assignmentId: a._id,
      orderId: a.order._id,
      shopName: a.shop.shopName,
      deliveryAddress: a.order.deliveryAddress,
      items:
        a.order.shopOrders.find((so) => so._id.equals(a.shopOrderId))
          .shopOrderItems || [],
      subTotal: a.order.shopOrders.find((so) => so._id.equals(a.shopOrderId))
        ?.subTotal,
    }));

    return res.status(200).json(formatted);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `get delivery boy assignment error ${error}` });
  }
};

export const acceptOrder = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    console.log("acceptOrder called:", { assignmentId, userId: req.userId });
    const assignment = await DeliveryAssignment.findById(assignmentId);

    if (!assignment) {
      return res.status.json(400).json({ message: "Assignment not found" });
    }

    if (assignment.status !== "broadcasted") {
      return res.status.json(400).json({ message: "Assignment is expired" });
    }

    const alreadyAssigned = await DeliveryAssignment.findOne({
      assignedTo: req.userId,
      status: { $nin: ["broadcasted", "completed"] },
    });

    if (alreadyAssigned) {
      return res.status
        .json(400)
        .json({ message: "Rider already assigned to another order" });
    }

    assignment.assignedTo = req.userId;
    assignment.status = "assigned";
    assignment.acceptedAt = new Date();

    await assignment.save();
       // confirm saved
    console.log("assignment after save:", assignment);

    const order = await Order.findById(assignment.order);

    if (!order) {
      return res.status.json(400).json({ message: "Order not found" });
    }

    const shopOrder = order.shopOrders.find((so) =>
      so._id.equals(assignment.shopOrderId)
    );
    shopOrder.assignedDeliveryBoy = req.userId;

    await order.save();

    await order.populate("shopOrders.assignedDeliveryBoy");

    return res.status(200).json({
      message: "Order accepted",
    });
  } catch (error) {
    return res.status(500).json({ message: `Accept order error ${error}` });
  }
};

export const getCurrentOrder = async (req, res) => {
  try {
    console.log("getCurrentOrder req.userId:", req.userId);
    const assignment = await DeliveryAssignment.findOne({
      assignedTo: req.userId,
      status: "assigned",
    })

      .populate("shop", "shopName")
      .populate("assignedTo", "fullName mobile location")
      .populate({
        path: "order",
        populate: [
          { path: "user", select: "fullName email location mobile" },
          { path: "shopOrders.shop", select: "shopName" },
        ],
      });

    if (!assignment) {
      return res.status(400).json({ message: "assignment not found" });
    }

    if (!assignment.order) {
      return res.status(400).json({ message: "order not found" });
    }

    const shopOrder = assignment.order.shopOrders.find(
      (so) => String(so._id) == String(assignment.shopOrderId)
    );

    if (!shopOrder) {
      return res
        .status(400)
        .json({ message: "shop order not found in get current order" });
    }

    let deliveryBoyLocation = { latitude: null, longitude: null };
    if (assignment.assignedTo.location.coordinates.length == 2) {
      deliveryBoyLocation.latitude =
        assignment.assignedTo.location.coordinates[1];
      deliveryBoyLocation.longitude =
        assignment.assignedTo.location.coordinates[0];
    }

    let customerLocation = { latitude: null, longitude: null };

    if (assignment.order.deliveryAddress) {
      customerLocation.latitude = assignment.order.deliveryAddress.latitude;
      customerLocation.longitude = assignment.order.deliveryAddress.longitude;
    }

    return res.status(200).json({
      _id: assignment.order._id,
      user: assignment.order.user,
      shopOrder,
      deliveryAddress: assignment.order.deliveryAddress,
      deliveryBoyLocation,
      customerLocation,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `get current order error ${error}` });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId)

      .populate("user")
      .populate({
        path: "shopOrders.shop",
        model: "Shop",
      })

      .populate({
        path: "shopOrders.assignedDeliveryBoy",
        model: "User",
      })

      .populate({
        path: "shopOrders.shopOrderItems.item",
        model: "Item",
      })
      .lean();

    if (!order) {
      return res.status(400), json({ message: "order not found" });
    }

    return res.status(200).json(order);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `get current order by id error ${error}` });
  }
};

export const sendDeliveryOtp = async (req, res) => {
  try {
    const { orderId, shopOrderId } = req.body;
    const order =  await Order.findById(orderId).populate("user");

    const shopOrder =  order.shopOrders.id(shopOrderId);

    if (!order || !shopOrder) {
      return res.status(400).json({ message: "Order or shopOrder id missing" });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    shopOrder.deliveryOtp = otp;
    shopOrder.otpExpires = Date.now() + 5 * 60 * 1000;
    await order.save();

    await sendDeliveryOtpMail(order.user, otp);
    return res
      .status(200)
      .json({ message: `OTP sent to user ${order.user.fullName}` });
  } catch (error) {
    return res.status(500).json({ message: `otp send error ${error}` });
  }
};

export const verifyDeliveryOtp = async (req, res) => {
  try {
    const { orderId, shopOrderId,otp } = req.body;
    const order = await Order.findById(orderId).populate("user");
    const shopOrder =  order.shopOrders.id(shopOrderId);

    if (!order || !shopOrder) {
      return res.status(400).json({ message: "Order or shopOrder id missing" });
    }

    if (
      shopOrder.deliveryOtp != otp  ||
      shopOrder.otpExpires < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid/Expired otp" });
    }

    shopOrder.status = "delivered";
    shopOrder.deliveredAt = Date.now();
    await order.save();
    await DeliveryAssignment.deleteOne({
      shopOrderId:shopOrder._id,
      order:order._id,
      assignedTo:shopOrder.assignedDeliveryBoy
    })

    return res.status(200).json({message:"Order delivered successfully"})
  } catch (error) {
     return res.status(500).json({ message: `verify delivery otp error ${error}` });
  }
};



export const getTodayDeliveries = async(req,res) => {
  try {
    const deliveryBoyId = req.userId;
    const startOfDay = new Date();
    startOfDay.setHours(0,0,0,0);
    const endOfDay = new Date();
    endOfDay.setHours(23,59,59,999);

    const orders = await Order.find({
      "shopOrders.assignedDeliveryBoy":deliveryBoyId,
      "shopOrders.status":"delivered",
      "shopOrders.deliveredAt":{$gte:startOfDay ,$lte:endOfDay}
    }).lean()

    let todayDeliveries = []

    orders.forEach(order => {
      order.shopOrders.forEach(shopOrder => {
        if(shopOrder.assignedDeliveryBoy == deliveryBoyId && shopOrder.status == "delivered" && shopOrder.deliveredAt && shopOrder.deliveredAt >= startOfDay){
          todayDeliveries.push(shopOrder)
        }
      })
    })

    let stats = {}

    todayDeliveries.forEach(shopOrder => {
      const hour = new Date(shopOrder.deliveredAt).getHours()

      stats[hour] = (stats[hour] || 0 ) + 1
    })


    let formattedStats = Object.keys(stats).map(hour => ({
      hour:parseInt(hour),
      count:stats[hour]
    }))

    formattedStats.sort((a,b) => a.hour - b.hour)

    return res.status(200).json(formattedStats)

    
  } catch (error) {
    return res.status(500).json({ message: `today delivery error ${error}` });
  }
}