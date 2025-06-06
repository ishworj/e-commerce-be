
import mongoose from "mongoose";

const userHistorySchemas = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: function () { return !this.guestSessionId; }
    },
    guestSessionId: {
        type: String,
        required: function () { return !this.userId },
    },
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
    }
}, { timestamps: true })

export default mongoose.model("UserBehaviour", userHistorySchemas)