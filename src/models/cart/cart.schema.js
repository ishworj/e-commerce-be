
import mongoose, { Schema } from "mongoose";

const CartItemSchema = new Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        default: 1,
        min: 1
    }
})
const CartSchema = new Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
    },
    cartItems: [CartItemSchema]

}, {
    timestamps: true
})

export default mongoose.model("Cart", CartSchema)