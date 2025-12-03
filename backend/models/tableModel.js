import mongoose from "mongoose";

const tableSchema = new mongoose.Schema({
    tableNumber: {
        type: String,
        required: true,
        unique: true
    },
    tableName: {
        type: String,
        default: ''
    },
    capacity: {
        type: Number,
        required: true,
        min: 1,
        max: 20
    },
    location: {
        type: String,
        enum: ['indoor', 'outdoor', 'balcony', 'private', 'rooftop'],
        default: 'indoor'
    },
    status: {
        type: String,
        enum: ['available', 'occupied', 'reserved', 'maintenance'],
        default: 'available'
    },
    features: {
        type: [String],
        default: []
    },
    minBookingHours: {
        type: Number,
        default: 1
    },
    pricePerHour: {
        type: Number,
        default: 0
    },
    image: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        default: ''
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const tableModel = mongoose.models.table || mongoose.model("table", tableSchema);
export default tableModel;

