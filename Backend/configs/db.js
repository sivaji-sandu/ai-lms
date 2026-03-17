
import mongoose from "mongoose";
const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log(" DB connected successfully");
    } catch (err) {
        console.error("DB connection error:", err.message);
        process.exit(1); // Stop server if DB fails
    }
}

export default connectDb;
