import express from 'express';
dotenv.config()
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import authRouter from './routes/routes.auth.js';
import userRouter from './routes/routes.user.js';
import cors from 'cors';


const app = express();
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)



app.listen(process.env.PORT, () => {
    connectDB()
    console.log(`Server running on port ${process.env.PORT}`);
})