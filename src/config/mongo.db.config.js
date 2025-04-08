import mongoose from "mongoose";
const mongoURL = process.env.MONGO_URL

export const connectDB = async () => {
    try {
        const connection = await mongoose.connect(mongoURL || "mongodb://localhost:127.0.0.1:27017//e-ecommerce-db")
        connection && console.log("MongoDB database connected")
    } catch (error) {
        console.log("Error while connecting to Database ", error)
        process.exit(1);
    }
}