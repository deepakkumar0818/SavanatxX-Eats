import Razorpay from "razorpay";
import crypto from "crypto";
import bookingModel from "../models/bookingModel.js";

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create Razorpay order for pre-order payment
const createPreOrderPayment = async (req, res) => {
    try {
        const { bookingId, amount } = req.body;

        if (!bookingId || !amount) {
            return res.json({ success: false, message: "Booking ID and amount are required" });
        }

        // Verify booking exists
        const booking = await bookingModel.findById(bookingId);
        if (!booking) {
            return res.json({ success: false, message: "Booking not found" });
        }

        // Create Razorpay order
        const options = {
            amount: amount * 100, // Razorpay expects amount in paise
            currency: "INR",
            receipt: `booking_${bookingId.slice(-8)}`,
            notes: {
                bookingId: bookingId,
                type: "pre_order_payment"
            }
        };

        const order = await razorpay.orders.create(options);
        console.log("Razorpay order created:", order.id);

        // Update booking with razorpay order ID
        await bookingModel.findByIdAndUpdate(bookingId, {
            razorpayOrderId: order.id
        });

        res.json({
            success: true,
            order: order,
            key: process.env.RAZORPAY_KEY_ID
        });
    } catch (error) {
        console.error("Error creating payment order:", error);
        res.json({ success: false, message: error.message });
    }
};

// Verify payment after completion
const verifyPreOrderPayment = async (req, res) => {
    try {
        const { 
            razorpay_order_id, 
            razorpay_payment_id, 
            razorpay_signature,
            bookingId 
        } = req.body;

        // Verify signature
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            // Update booking with payment info
            await bookingModel.findByIdAndUpdate(bookingId, {
                preOrderPayment: true,
                paymentId: razorpay_payment_id,
                paymentStatus: 'paid'
            });

            console.log("Payment verified for booking:", bookingId);
            res.json({ 
                success: true, 
                message: "Payment successful",
                paymentId: razorpay_payment_id 
            });
        } else {
            // Payment verification failed
            await bookingModel.findByIdAndUpdate(bookingId, {
                paymentStatus: 'failed'
            });

            console.log("Payment verification failed for booking:", bookingId);
            res.json({ success: false, message: "Payment verification failed" });
        }
    } catch (error) {
        console.error("Error verifying payment:", error);
        res.json({ success: false, message: error.message });
    }
};

// Get Razorpay key (for frontend)
const getRazorpayKey = async (req, res) => {
    res.json({ 
        success: true, 
        key: process.env.RAZORPAY_KEY_ID 
    });
};

export { createPreOrderPayment, verifyPreOrderPayment, getRazorpayKey };

