import Razorpay from "razorpay";
import crypto from "crypto";
import orderModel from "../models/orderModel.js";

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create Razorpay order for food order payment
const createRazorpayOrder = async (req, res) => {
    try {
        const { items, amount, address, paymentMethod } = req.body;
        const userId = req.body.userId;

        if (!items || !amount || !address) {
            return res.json({ success: false, message: "Missing required order details" });
        }

        // Create order in database first (with pending payment status)
        const newOrder = new orderModel({
            userId: userId,
            items: items,
            amount: amount,
            address: address,
            paymentMethod: paymentMethod || 'RAZORPAY',
            payment: false,
            status: "Pending Payment"
        });

        await newOrder.save();
        console.log("Order created with ID:", newOrder._id);

        // Create Razorpay order
        const options = {
            amount: amount * 100, // Razorpay expects amount in paise
            currency: "INR",
            receipt: `order_${newOrder._id.toString().slice(-8)}`,
            notes: {
                orderId: newOrder._id.toString(),
                type: "food_order"
            }
        };

        const razorpayOrder = await razorpay.orders.create(options);
        console.log("Razorpay order created:", razorpayOrder.id);

        res.json({
            success: true,
            order: razorpayOrder,
            orderId: newOrder._id,
            key: process.env.RAZORPAY_KEY_ID
        });
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        res.json({ success: false, message: error.message });
    }
};

// Verify Razorpay payment and update order
const verifyRazorpayPayment = async (req, res) => {
    try {
        const { 
            razorpay_order_id, 
            razorpay_payment_id, 
            razorpay_signature,
            orderId 
        } = req.body;

        // Verify signature
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            // Update order with payment info
            await orderModel.findByIdAndUpdate(orderId, {
                payment: true,
                paymentId: razorpay_payment_id,
                razorpayOrderId: razorpay_order_id,
                status: "Food Processing"
            });

            console.log("Payment verified for order:", orderId);
            res.json({ 
                success: true, 
                message: "Payment successful",
                orderId: orderId,
                paymentId: razorpay_payment_id 
            });
        } else {
            // Payment verification failed
            await orderModel.findByIdAndUpdate(orderId, {
                status: "Payment Failed"
            });

            console.log("Payment verification failed for order:", orderId);
            res.json({ success: false, message: "Payment verification failed" });
        }
    } catch (error) {
        console.error("Error verifying payment:", error);
        res.json({ success: false, message: error.message });
    }
};

// Get Razorpay key
const getKey = async (req, res) => {
    res.json({ 
        success: true, 
        key: process.env.RAZORPAY_KEY_ID 
    });
};

export { createRazorpayOrder, verifyRazorpayPayment, getKey };

