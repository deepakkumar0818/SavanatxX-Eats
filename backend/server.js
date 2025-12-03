import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import foodRouter from './routes/foodRoute.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoute.js';
import 'dotenv/config.js'; 
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import bookingRouter from './routes/bookingRoute.js';
import tableRouter from './routes/tableRoute.js';

// app config
const app = express();
const port = process.env.PORT || 4000;

// middleware
app.use(express.json());
app.use(cors());

// api routes
app.get('/', (req, res) => {
    res.send('API WORKING!!!!');
});

// routes
app.use('/api/food', foodRouter);
app.use('/api/user', userRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.use('/api/booking', bookingRouter);
app.use('/api/table', tableRouter);

// db connection
connectDB();
connectCloudinary();


// listener
app.listen(port, () => console.log(`Server started on localhost:${port}`));
