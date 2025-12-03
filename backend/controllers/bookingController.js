import bookingModel from "../models/bookingModel.js";

// Create a new booking
const createBooking = async (req, res) => {
    try {
        const { name, email, phone, date, time, guests, occasion, specialRequests, preOrderedItems, preOrderTotal, tableId, tableNumber, tableName } = req.body;

        // Validate required fields
        if (!name || !email || !phone || !date || !time || !guests) {
            return res.json({ success: false, message: "Please fill all required fields" });
        }

        // Check if there are pre-ordered items
        const hasPreOrder = preOrderedItems && preOrderedItems.length > 0;

        // Create new booking
        const newBooking = new bookingModel({
            name,
            email,
            phone,
            date: new Date(date),
            time,
            guests,
            tableId: tableId || null,
            tableNumber: tableNumber || '',
            tableName: tableName || '',
            occasion: occasion || '',
            specialRequests: specialRequests || '',
            status: 'Pending',
            preOrderedItems: preOrderedItems || [],
            preOrderTotal: preOrderTotal || 0,
            hasPreOrder: hasPreOrder
        });

        await newBooking.save();
        console.log("New booking created:", newBooking._id, tableNumber ? `Table: ${tableNumber}` : '', hasPreOrder ? `with ${preOrderedItems.length} pre-ordered items` : '');

        res.json({ 
            success: true, 
            message: hasPreOrder ? "Table booked with food pre-order!" : "Table booked successfully!", 
            bookingId: newBooking._id,
            hasPreOrder: hasPreOrder,
            tableNumber: tableNumber
        });
    } catch (error) {
        console.error("Error creating booking:", error);
        res.json({ success: false, message: error.message });
    }
};

// Get all bookings (for admin)
const listBookings = async (req, res) => {
    try {
        const bookings = await bookingModel.find({}).sort({ createdAt: -1 });
        res.json({ success: true, data: bookings });
    } catch (error) {
        console.error("Error fetching bookings:", error);
        res.json({ success: false, message: error.message });
    }
};

// Update booking status (for admin)
const updateBookingStatus = async (req, res) => {
    try {
        const { bookingId, status } = req.body;

        if (!bookingId || !status) {
            return res.json({ success: false, message: "Booking ID and status are required" });
        }

        const updatedBooking = await bookingModel.findByIdAndUpdate(
            bookingId,
            { status },
            { new: true }
        );

        if (!updatedBooking) {
            return res.json({ success: false, message: "Booking not found" });
        }

        console.log("Booking status updated:", bookingId, "->", status);
        res.json({ success: true, message: "Booking status updated", data: updatedBooking });
    } catch (error) {
        console.error("Error updating booking status:", error);
        res.json({ success: false, message: error.message });
    }
};

// Delete a booking (for admin)
const deleteBooking = async (req, res) => {
    try {
        const { bookingId } = req.body;

        if (!bookingId) {
            return res.json({ success: false, message: "Booking ID is required" });
        }

        const deletedBooking = await bookingModel.findByIdAndDelete(bookingId);

        if (!deletedBooking) {
            return res.json({ success: false, message: "Booking not found" });
        }

        console.log("Booking deleted:", bookingId);
        res.json({ success: true, message: "Booking deleted successfully" });
    } catch (error) {
        console.error("Error deleting booking:", error);
        res.json({ success: false, message: error.message });
    }
};

// Get booking by ID
const getBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const booking = await bookingModel.findById(bookingId);

        if (!booking) {
            return res.json({ success: false, message: "Booking not found" });
        }

        res.json({ success: true, data: booking });
    } catch (error) {
        console.error("Error fetching booking:", error);
        res.json({ success: false, message: error.message });
    }
};

// Get bookings by date (for checking availability)
const getBookingsByDate = async (req, res) => {
    try {
        const { date } = req.query;
        
        if (!date) {
            return res.json({ success: false, message: "Date is required" });
        }

        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const bookings = await bookingModel.find({
            date: { $gte: startOfDay, $lte: endOfDay },
            status: { $ne: 'Cancelled' }
        });

        res.json({ success: true, data: bookings });
    } catch (error) {
        console.error("Error fetching bookings by date:", error);
        res.json({ success: false, message: error.message });
    }
};

// Get user's bookings by email or phone
const getUserBookings = async (req, res) => {
    try {
        const { email, phone } = req.body;
        
        if (!email && !phone) {
            return res.json({ success: false, message: "Email or phone is required" });
        }

        // Build query - search by email OR phone
        let query = {};
        if (email && phone) {
            query = { $or: [{ email: email }, { phone: phone }] };
        } else if (email) {
            query = { email: email };
        } else {
            query = { phone: phone };
        }

        const bookings = await bookingModel.find(query).sort({ createdAt: -1 });
        res.json({ success: true, data: bookings });
    } catch (error) {
        console.error("Error fetching user bookings:", error);
        res.json({ success: false, message: error.message });
    }
};

// Cancel booking by user
const cancelUserBooking = async (req, res) => {
    try {
        const { bookingId, email } = req.body;

        if (!bookingId || !email) {
            return res.json({ success: false, message: "Booking ID and email are required" });
        }

        // Find booking and verify it belongs to the user
        const booking = await bookingModel.findOne({ _id: bookingId, email: email });

        if (!booking) {
            return res.json({ success: false, message: "Booking not found or unauthorized" });
        }

        // Only allow cancellation of pending or confirmed bookings
        if (booking.status === 'Completed' || booking.status === 'Cancelled') {
            return res.json({ success: false, message: `Cannot cancel a ${booking.status.toLowerCase()} booking` });
        }

        booking.status = 'Cancelled';
        await booking.save();

        console.log("Booking cancelled by user:", bookingId);
        res.json({ success: true, message: "Booking cancelled successfully" });
    } catch (error) {
        console.error("Error cancelling booking:", error);
        res.json({ success: false, message: error.message });
    }
};

export { createBooking, listBookings, updateBookingStatus, deleteBooking, getBooking, getBookingsByDate, getUserBookings, cancelUserBooking };

