
import mongoose from "mongoose";

const actionHistorySchemas = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },
    action: {
        type: String,
        enum: ["view", "click", "add_to_cart", "purchase"],
        default: "view"
    },
    defaulttimestamp: {
        type: Date,
        default: Date.now
    }
})
const userHistorySchemas = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        default: null
    },
    guestSessionId: {
        type: String,
        default: null
    },
    history: [actionHistorySchemas]
}, { timestamps: true })


userHistorySchemas.index({ guestSessionId: 1 });
userHistorySchemas.index({ userId: 1 });

export default mongoose.model("UserBehaviour", userHistorySchemas)