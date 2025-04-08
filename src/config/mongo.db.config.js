import mongoose from "mongoose";
import { conf } from "../conf/conf.js";

export const connectDB = async () => {
    try {
        const connection = await mongoose.connect(
            conf.mongoUrl ||
                "mongodb://localhost:127.0.0.1:27017//e-ecommerce-db"
        );
        connection && console.log("MongoDB database connected");
    } catch (error) {
        console.log("Error while connecting to Database ", error);
        process.exit(1);
    }
};
