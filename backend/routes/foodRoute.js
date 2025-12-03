import express from "express";

import { addFood, listFood, removeFood, updateFoodStatus, listAvailableFood } from "../controllers/foodController.js";
import upload from "../uploads/multer.js";

const foodRouter = express.Router();

foodRouter.post("/add", upload.single("image"), addFood);
foodRouter.get("/list", listFood);
foodRouter.get("/available", listAvailableFood); // For user frontend - only available items
foodRouter.post("/remove", removeFood);
foodRouter.post("/status", updateFoodStatus); // Update item status

export default foodRouter;