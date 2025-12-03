import foodModel from "../models/foodModel.js";
import { v2 as cloudinary } from "cloudinary";

// Add food item
const addFood = async (req, res) => {
    try {
        const { name, description, price, category } = req.body;
        const imageFile = req.file; // Get the uploaded file

        // Upload image to Cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
            resource_type: "image",
        });
        const imageUrl = imageUpload.url;

        const newFood = new foodModel({
            name,
            description,
            price,
            image: imageUrl,
            category,
        });

        // Save the new food item to the database
        await newFood.save();
        res.json({ success: true, message: "Food added successfully" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};
  //All Food List
const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({});

        res.json({ success: true, data: foods });
        console.log(foods);

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }

}


const removeFood = async (req, res) => {
    try {
        const food = await foodModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Food removed successfully" });
        
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}

// Update food status (available, unavailable, out_of_stock)
const updateFoodStatus = async (req, res) => {
    try {
        const { id, status } = req.body;
        
        if (!id || !status) {
            return res.json({ success: false, message: "ID and status are required" });
        }

        const validStatuses = ['available', 'unavailable', 'out_of_stock'];
        if (!validStatuses.includes(status)) {
            return res.json({ success: false, message: "Invalid status" });
        }

        const food = await foodModel.findByIdAndUpdate(
            id, 
            { status: status },
            { new: true }
        );

        if (!food) {
            return res.json({ success: false, message: "Food item not found" });
        }

        console.log(`Food "${food.name}" status updated to: ${status}`);
        res.json({ success: true, message: "Status updated successfully", data: food });
        
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}

// Get available food only (for user frontend)
const listAvailableFood = async (req, res) => {
    try {
        // Include items that are 'available' OR don't have a status field (legacy items)
        const foods = await foodModel.find({
            $or: [
                { status: 'available' },
                { status: { $exists: false } },
                { status: null }
            ]
        });
        res.json({ success: true, data: foods });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}

export { addFood, listFood, removeFood, updateFoodStatus, listAvailableFood };
