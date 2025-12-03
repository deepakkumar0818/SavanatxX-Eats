import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";



const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//placing user Order for frontend
const placeOrder = async (req, res) => {

    const frontendUrl = "http://localhost:5173";
    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address
        });
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, {cartData: {}});

        const line_items = req.body.items.map((item) =>({
        price_data: {
            currency: "inr",
            product_data: {
                name: item.name,
                
            },
            unit_amount: item.price * 100
        },
        quantity: item.quantity
        }));
        line_items.push({
            price_data: {
                currency: "inr",
                product_data: {
                    name: "Delivery Charges",
                    
                },
                unit_amount: 2*100
            },
            quantity: 1

        });
        const session = await stripe.checkout.sessions.create({
            line_items: line_items,
            mode: "payment",
            success_url: `${frontendUrl}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontendUrl}/verify?success=false&orderId=${newOrder._id}`,
           
        })
        res.json({success: true, session_url: session.url});
           
    
        
        
    } catch (error) {
        console.error(error);
        res.json({success: false, message: error.message});
        
    }

}

// Place order with Cash on Delivery
const placeOrderCOD = async (req, res) => {
    console.log("=== COD Order Request ===");
    console.log("User ID:", req.body.userId);
    console.log("Items:", req.body.items?.length, "items");
    console.log("Amount:", req.body.amount);
    console.log("Address:", req.body.address);
    
    try {
        // Validate required fields
        if (!req.body.userId) {
            return res.json({ success: false, message: "User ID is required" });
        }
        if (!req.body.items || req.body.items.length === 0) {
            return res.json({ success: false, message: "Order items are required" });
        }
        if (!req.body.amount) {
            return res.json({ success: false, message: "Order amount is required" });
        }
        if (!req.body.address) {
            return res.json({ success: false, message: "Delivery address is required" });
        }

        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
            payment: false, // COD - payment will be collected on delivery
            status: "Food Processing",
            paymentMethod: "COD",
            date: new Date()
        });
        
        const savedOrder = await newOrder.save();
        console.log("Order saved successfully! ID:", savedOrder._id);
        
        // Clear user's cart
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });
        console.log("Cart cleared for user:", req.body.userId);
        
        res.json({
            success: true, 
            message: "Order placed successfully! Pay on delivery.",
            orderId: savedOrder._id
        });
    } catch (error) {
        console.error("COD Order Error:", error);
        res.json({ success: false, message: error.message || "Failed to place order" });
    }
}

const verifyOrder = async (req, res) => {
    const {orderId, success} = req.body;
  try {
  

    if (success == "true") {
     await orderModel.findByIdAndUpdate(orderId,{payment:true, status: "Food Processing"});
        res.json({success: true, message: "Paid"});
    } else {
        const order = await orderModel.findByIdAndDelete(orderId);
        res.json({success: false, message: "Not Paid"});
      
    }
    
  } catch (error) {
    console.log(error);
    res.json({success: false, message: error.message});
  }
}


const userOrder = async (req, res) => {
try {
  const orders = await orderModel.find({userId: req.body.userId});
  res.json({success: true, data:orders});
} catch (error) {
    console.log(error);
    res.json({success: false, message: error.message});
}
}

//Lisiting order for admin panel: 

const listOrder = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({success: true, data:orders});
        
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message});
    }
}


const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    
    // Get the order to check payment method
    const order = await orderModel.findById(orderId);
    
    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }
    
    // Update object
    let updateData = { status: status };
    
    // For COD orders, mark as paid when delivered
    if (order.paymentMethod === 'COD' && status === 'Delivered') {
      updateData.payment = true;
      console.log("COD Order delivered - marking as paid:", orderId);
    }
    
    await orderModel.findByIdAndUpdate(orderId, updateData);
    
    res.json({ success: true, message: "Status updated" });
    
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}


export {placeOrder, placeOrderCOD, verifyOrder, userOrder, listOrder, updateStatus};