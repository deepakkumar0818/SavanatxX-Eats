import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    // await mongoose.connect("mongodb+srv://dk0133964:Deepak12345@cluster0.nkpra.mongodb.net/food-delivery");
    await mongoose.connect("mongodb+srv://dk0133964:Deepak12345@cluster0.nkpra.mongodb.net/food-delivery");
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
   
  }
};
