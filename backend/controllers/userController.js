import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET);
};

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Check if the user already exists
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Validate input fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Email is not valid" });
    }
    if (password.length < 8) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save new user
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword
    });

    const user = await newUser.save();
    const token = createToken(user._id);

    // Send success response with token
    res.status(201).json({ success: true, token });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const loginUser = async (req, res) => {

    try {
        const {email,password} = req.body;

        const user = await userModel.findOne({ email });
        if (!user) {
          return res.json({ success: false, message: "User does not exist" });
        }
    
        const isMatch = await bcrypt.compare(password, user.password);
    
        if (!isMatch) { 
          return res.json({ success: false, message: "Invalid credentials" });
        }
    
        const token = createToken(user._id);
        res.json({ success: true, token });
        
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Something went wrong" });
    }

   
};

// Get user profile
const getUserProfile = async (req, res) => {
    try {
        const userId = req.body.userId;
        const user = await userModel.findById(userId).select('-password');
        
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        
        res.json({ 
            success: true, 
            data: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error fetching profile" });
    }
};

export { registerUser, loginUser, getUserProfile };
