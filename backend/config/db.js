import mongoose from "mongoose";

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("MongoDB connected");   
    }

    catch{
        console.log("MongoDB connection failed");
    }
}

export default connectDB;