import express from "express";
import { 
    createBooking, 
    listBookings, 
    updateBookingStatus, 
    deleteBooking, 
    getBooking,
    getBookingsByDate,
    getUserBookings,
    cancelUserBooking
} from "../controllers/bookingController.js";
import {
    createPreOrderPayment,
    verifyPreOrderPayment,
    getRazorpayKey
} from "../controllers/bookingPaymentController.js";

const bookingRouter = express.Router();

// Create a new booking (public)
bookingRouter.post("/create", createBooking);

// Get all bookings (admin)
bookingRouter.get("/list", listBookings);

// Update booking status (admin)
bookingRouter.post("/status", updateBookingStatus);

// Delete a booking (admin)
bookingRouter.post("/delete", deleteBooking);

// Get user's bookings by email/phone
bookingRouter.post("/user-bookings", getUserBookings);

// Cancel booking by user
bookingRouter.post("/cancel", cancelUserBooking);

// Payment routes
bookingRouter.get("/payment/key", getRazorpayKey);
bookingRouter.post("/payment/create", createPreOrderPayment);
bookingRouter.post("/payment/verify", verifyPreOrderPayment);

// Get bookings by date (for availability check)
bookingRouter.get("/check/availability", getBookingsByDate);

// Get single booking by ID (keep at end due to param)
bookingRouter.get("/:bookingId", getBooking);

export default bookingRouter;

