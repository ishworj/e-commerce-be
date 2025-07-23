
import mongoose from "mongoose";

const recentActivitySchema = new mongoose.Schema({
    userDetail: {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User"
        },
        userName: { type: String, required: true }
    },
    action: {
        type: String,
        enum: ["userRegistration", "userUpdated", "orderPlaced", "orderDeleted", "orderDelivered", "orderShipped", "orderUpdated", "productAdded", "productDeleted", "productUpdated", "bannerCreated", "bannerDeleted", "bannerUpdated", "productReviewed", "reviewUpdated", "categoryCreated", "categoryUpdated", "categoryDeleted"],
        required: true
    },
    entityId: {
        type: String,
        required: true
    },

}, { timestamps: true })

export const RecentActivitySchema = mongoose.model("RecentActivity", recentActivitySchema)