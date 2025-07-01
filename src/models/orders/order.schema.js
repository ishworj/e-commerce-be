
import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    paymentIntent: {
      type: String,
      required: true,
      unique: true
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
    },
    expectedDeliveryDate: {
      type: Date
    },
    invoiceId: {
      type: mongoose.Types.ObjectId,
      ref: "Invoice"
    }
  },
  { timestamps: true }
);

OrderSchema.plugin(mongoosePaginate)

OrderSchema.pre("save", function (next) {
  if (!this.expectedDeliveryDate) {
    const deliveryBufferDays = 5;
    const baseDate = this.createdAt || new Date();
    const expectedDate = new Date(baseDate);
    expectedDate.setDate(baseDate.getDate() + deliveryBufferDays)
    this.expectedDeliveryDate = expectedDate;
  }
  next()
})

export default mongoose.model("Order", OrderSchema);
