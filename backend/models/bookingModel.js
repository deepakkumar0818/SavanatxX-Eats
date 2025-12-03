import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    guests: {
        type: String,
        required: true
    },
    // Table reference
    tableId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'table',
        default: null
    },
    tableNumber: {
        type: String,
        default: ''
    },
    tableName: {
        type: String,
        default: ''
    },
    occasion: {
        type: String,
        default: ''
    },
    specialRequests: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
        default: 'Pending'
    },
    // Pre-ordered food items
    preOrderedItems: {
        type: Array,
        default: []
    },
    preOrderTotal: {
        type: Number,
        default: 0
    },
    hasPreOrder: {
        type: Boolean,
        default: false
    },
    // Payment info
    preOrderPayment: {
        type: Boolean,
        default: false
    },
    paymentId: {
        type: String,
        default: ''
    },
    razorpayOrderId: {
        type: String,
        default: ''
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const bookingModel = mongoose.models.booking || mongoose.model("booking", bookingSchema);
export default bookingModel;

