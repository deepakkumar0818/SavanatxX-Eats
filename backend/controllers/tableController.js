import tableModel from "../models/tableModel.js";
import bookingModel from "../models/bookingModel.js";

// Add new table
const addTable = async (req, res) => {
    try {
        const { tableNumber, tableName, capacity, location, features, minBookingHours, pricePerHour, description } = req.body;

        // Check if table number already exists
        const existingTable = await tableModel.findOne({ tableNumber });
        if (existingTable) {
            return res.json({ success: false, message: "Table number already exists" });
        }

        const newTable = new tableModel({
            tableNumber,
            tableName: tableName || `Table ${tableNumber}`,
            capacity,
            location: location || 'indoor',
            features: features || [],
            minBookingHours: minBookingHours || 1,
            pricePerHour: pricePerHour || 0,
            description: description || '',
            status: 'available',
            isActive: true
        });

        await newTable.save();
        console.log("New table added:", tableNumber);

        res.json({ success: true, message: "Table added successfully", data: newTable });
    } catch (error) {
        console.error("Error adding table:", error);
        res.json({ success: false, message: error.message });
    }
};

// Get all tables (Admin) with booking info
const listTables = async (req, res) => {
    try {
        const tables = await tableModel.find({}).sort({ tableNumber: 1 });
        
        // Get today's bookings for all tables
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));
        
        const todayBookings = await bookingModel.find({
            tableId: { $ne: null },
            date: { $gte: startOfDay, $lt: endOfDay },
            status: { $in: ['Pending', 'Confirmed'] }
        });

        // Also get upcoming bookings (next 7 days)
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        
        const upcomingBookings = await bookingModel.find({
            tableId: { $ne: null },
            date: { $gte: new Date(), $lt: nextWeek },
            status: { $in: ['Pending', 'Confirmed'] }
        });

        // Attach booking info to each table
        const tablesWithBookings = tables.map(table => {
            const tableObj = table.toObject();
            
            // Today's bookings for this table
            tableObj.todayBookings = todayBookings.filter(b => 
                b.tableId && b.tableId.toString() === table._id.toString()
            ).map(b => ({
                _id: b._id,
                time: b.time,
                guests: b.guests,
                name: b.name,
                status: b.status
            }));
            
            // Upcoming bookings count
            tableObj.upcomingBookingsCount = upcomingBookings.filter(b => 
                b.tableId && b.tableId.toString() === table._id.toString()
            ).length;
            
            // Check if table is booked right now (within 2 hours of current time)
            const now = new Date();
            const currentHour = now.getHours();
            tableObj.isCurrentlyBooked = tableObj.todayBookings.some(b => {
                const bookingHour = parseInt(b.time.split(':')[0]);
                return Math.abs(currentHour - bookingHour) <= 2;
            });
            
            return tableObj;
        });

        res.json({ success: true, data: tablesWithBookings });
    } catch (error) {
        console.error("Error fetching tables:", error);
        res.json({ success: false, message: error.message });
    }
};

// Get available tables for booking (User frontend)
const getAvailableTables = async (req, res) => {
    try {
        const { date, time, guests } = req.query;

        // Get all active tables that can accommodate the guests
        let query = { isActive: true };
        if (guests) {
            query.capacity = { $gte: parseInt(guests) };
        }

        const tables = await tableModel.find(query).sort({ capacity: 1 });

        // If date and time provided, check for existing bookings
        if (date && time) {
            const bookingDate = new Date(date);
            
            // Get bookings for that date and time
            const existingBookings = await bookingModel.find({
                date: {
                    $gte: new Date(bookingDate.setHours(0, 0, 0, 0)),
                    $lt: new Date(bookingDate.setHours(23, 59, 59, 999))
                },
                time: time,
                status: { $in: ['Pending', 'Confirmed'] }
            });

            // Get booked table IDs
            const bookedTableIds = existingBookings
                .filter(b => b.tableId)
                .map(b => b.tableId.toString());

            // Filter out booked tables and maintenance tables
            const availableTables = tables.filter(table => 
                !bookedTableIds.includes(table._id.toString()) && 
                table.status !== 'maintenance'
            );

            return res.json({ success: true, data: availableTables });
        }

        // Return all active tables (not in maintenance)
        const availableTables = tables.filter(t => t.status !== 'maintenance');
        res.json({ success: true, data: availableTables });
    } catch (error) {
        console.error("Error fetching available tables:", error);
        res.json({ success: false, message: error.message });
    }
};

// Update table status
const updateTableStatus = async (req, res) => {
    try {
        const { tableId, status } = req.body;

        if (!tableId || !status) {
            return res.json({ success: false, message: "Table ID and status are required" });
        }

        const validStatuses = ['available', 'occupied', 'reserved', 'maintenance'];
        if (!validStatuses.includes(status)) {
            return res.json({ success: false, message: "Invalid status" });
        }

        const table = await tableModel.findByIdAndUpdate(
            tableId,
            { status },
            { new: true }
        );

        if (!table) {
            return res.json({ success: false, message: "Table not found" });
        }

        console.log(`Table ${table.tableNumber} status updated to: ${status}`);
        res.json({ success: true, message: "Table status updated", data: table });
    } catch (error) {
        console.error("Error updating table status:", error);
        res.json({ success: false, message: error.message });
    }
};

// Update table details
const updateTable = async (req, res) => {
    try {
        const { tableId, ...updateData } = req.body;

        if (!tableId) {
            return res.json({ success: false, message: "Table ID is required" });
        }

        const table = await tableModel.findByIdAndUpdate(
            tableId,
            updateData,
            { new: true }
        );

        if (!table) {
            return res.json({ success: false, message: "Table not found" });
        }

        res.json({ success: true, message: "Table updated successfully", data: table });
    } catch (error) {
        console.error("Error updating table:", error);
        res.json({ success: false, message: error.message });
    }
};

// Toggle table active status
const toggleTableActive = async (req, res) => {
    try {
        const { tableId } = req.body;

        const table = await tableModel.findById(tableId);
        if (!table) {
            return res.json({ success: false, message: "Table not found" });
        }

        table.isActive = !table.isActive;
        await table.save();

        res.json({ 
            success: true, 
            message: `Table ${table.isActive ? 'activated' : 'deactivated'}`,
            data: table 
        });
    } catch (error) {
        console.error("Error toggling table:", error);
        res.json({ success: false, message: error.message });
    }
};

// Delete table
const deleteTable = async (req, res) => {
    try {
        const { tableId } = req.body;

        const table = await tableModel.findByIdAndDelete(tableId);
        if (!table) {
            return res.json({ success: false, message: "Table not found" });
        }

        console.log("Table deleted:", table.tableNumber);
        res.json({ success: true, message: "Table deleted successfully" });
    } catch (error) {
        console.error("Error deleting table:", error);
        res.json({ success: false, message: error.message });
    }
};

// Get single table
const getTable = async (req, res) => {
    try {
        const { tableId } = req.params;
        const table = await tableModel.findById(tableId);
        
        if (!table) {
            return res.json({ success: false, message: "Table not found" });
        }

        res.json({ success: true, data: table });
    } catch (error) {
        console.error("Error fetching table:", error);
        res.json({ success: false, message: error.message });
    }
};

export { 
    addTable, 
    listTables, 
    getAvailableTables, 
    updateTableStatus, 
    updateTable, 
    toggleTableActive, 
    deleteTable,
    getTable 
};

