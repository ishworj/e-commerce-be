import mongoose from "mongoose";
const mongoURL = process.env.MONGO_URL

export const connectDB = async ()=>{
try {
    const connection = await mongoose.connect(mongoURL)
    connection && console.log("MongoDB database connected")
} catch (error) {
    console.log("Error while connecting to Database ", error)
     process.exit(1);
}
}