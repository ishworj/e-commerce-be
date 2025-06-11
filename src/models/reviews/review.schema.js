import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      maxlength: 1000,
    },
    approved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Review", ReviewSchema);
