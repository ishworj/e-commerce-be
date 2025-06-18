import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

const ProductSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      maxlength: 5000,
    },
    price: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      default: 0,
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
    },
    images: [String],

    ratings: {
      type: [Number],
      default: [0],
    },

    reviews: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  { timestamps: true }
);


ProductSchema.plugin(mongoosePaginate)


export default mongoose.model("Product", ProductSchema);
