
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
        _id: {
          type: mongoose.Types.ObjectId,
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
        price: {
          type: Number,
          min: 1
        },
        amount_total: {
          type: Number,
          min: 1,
        },
        productImages: [String]

      },
    ],
    status: {
      type: String,
      enum: ["pending", "shipped", "delivered"],
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    shippingAddress: {
      type: String,
    }
  },
  { timestamps: true }
);

export default mongoose.model("Order", OrderSchema);
