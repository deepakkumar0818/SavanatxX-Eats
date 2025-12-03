import express from "express";
import authMiddleware from "../middleware/auth.js";

import { listOrder, placeOrder, placeOrderCOD, updateStatus, userOrder, verifyOrder } from "../controllers/orderController.js";
import { createRazorpayOrder, verifyRazorpayPayment, getKey } from "../controllers/orderPaymentController.js";

const orderRouter = express.Router();

orderRouter.post("/place", authMiddleware, placeOrder);
orderRouter.post("/place-cod", authMiddleware, placeOrderCOD);
orderRouter.post("/verify", verifyOrder);

// Razorpay payment routes
orderRouter.get("/razorpay-key", getKey);
orderRouter.post("/create-razorpay", authMiddleware, createRazorpayOrder);
orderRouter.post("/verify-razorpay", verifyRazorpayPayment);

orderRouter.post("/userorders", authMiddleware, userOrder);
orderRouter.get("/list", listOrder);
orderRouter.post("/status", updateStatus);


export default orderRouter;