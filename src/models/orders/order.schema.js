
import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        id: {
          type: String,
          ref: "Product",
          required: true,
        },
        name: {
          type: String,
          required: true
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        amount_total: {
          type: Number,
          min: 1
        },
        productImages: [String]

      },
    ],
    status: {
      type: String,
      enum: ["pending", "shipped", "delivered"],
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    shippingAddress: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Order", OrderSchema);
